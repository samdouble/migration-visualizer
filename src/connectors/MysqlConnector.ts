import { IOrm } from '../orms/IOrm';
import { IConnector } from './IConnector';
import { Column, Ddl, ForeignKey, Index, Table } from './types';

export type MysqlTable = {
  TABLE_NAME: string;
  TABLE_SCHEMA: string;
  TABLE_CATALOG: string;
};

export type MysqlColumn = {
  COLUMN_COMMENT: string;
  COLUMN_DEFAULT: string;
  COLUMN_KEY: string;
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  ORDINAL_POSITION: number;
  TABLE_NAME: string;
};

export type MysqlForeignKey = {
  CONSTRAINT_NAME: string;
  TABLE_NAME: string;
  COLUMN_NAME: string;
  REFERENCED_TABLE_NAME: string;
  REFERENCED_COLUMN_NAME: string;
  ON_DELETE: string;
  ON_UPDATE: string;
};

export type MysqlIndex = {
  INDEX_NAME: string;
  COLUMN_NAME: string;
  NON_UNIQUE: number;
  TABLE_NAME: string;
};

export class MysqlConnector implements IConnector {
  async getColumns(orm: IOrm, tableName: string): Promise<Column[]> {
    const result = await orm.query<MysqlColumn[][]>(`
      select * from information_schema.columns 
      where
        table_name=?
        and table_schema=database()
      `,
      [tableName],
    );
    return result[0].map((c: MysqlColumn) => ({
      cid: c['ORDINAL_POSITION'],
      name: c['COLUMN_NAME'],
      description: c['COLUMN_COMMENT'],
      type: c['COLUMN_TYPE'],
      notnull: c['IS_NULLABLE'] === 'NO',
      dflt_value: c['COLUMN_DEFAULT'],
      pk: c['COLUMN_KEY'] === 'PRI',
      table_name: c['TABLE_NAME'],
    }));
  }

  async getDdl(orm: IOrm, tableName: string): Promise<Ddl | null> {
    const exists = await this.tableExists(orm, tableName);
    if (!exists) {
      return null;
    }
    const result = await orm.query<{ 'Create Table': string }[][]>(`
      show create table ${tableName}
    `);
    return result[0][0]['Create Table'];
  }

  async getForeignKeys(orm: IOrm, tableName: string): Promise<ForeignKey[]> {
    const result = await orm.query<MysqlForeignKey[][]>(`
      select * from information_schema.key_column_usage
      where
        table_name = ?
        and table_schema = database()
    `, [tableName]);
    return result[0].map((fk: MysqlForeignKey) => ({
      id: fk['CONSTRAINT_NAME'],
      from_table_name: fk['TABLE_NAME'],
      from_column_name: fk['COLUMN_NAME'],
      to_table_name: fk['REFERENCED_TABLE_NAME'],
      to_column_name: fk['REFERENCED_COLUMN_NAME'],
      on_delete: fk['ON_DELETE'],
      on_update: fk['ON_UPDATE'],
    }));
  }

  async getIndexes(orm: IOrm, tableName: string): Promise<Index[]> {
    const result = await orm.query<MysqlIndex[][]>(`
      select * from information_schema.statistics
      where
        table_name = ?
        and table_schema = database()
    `, [tableName]);
    return result[0].map((i: MysqlIndex) => ({
      name: i['INDEX_NAME'],
      columns: i['COLUMN_NAME'].split(',').map((c) => c.trim()),
      unique: i['NON_UNIQUE'] === 0,
      table_name: i['TABLE_NAME'],
    }));
  }

  async getTables(orm: IOrm): Promise<Table[]> {
    const result = await orm.query<MysqlTable[][]>(`
      select * from information_schema.tables
      where
        table_type = 'BASE TABLE'
        and table_schema = database()
        and table_name not like ?
    `, [orm.getTablePrefix()]);
    return result[0].map((t: MysqlTable) => ({
      name: t['TABLE_NAME'],
      schema: t['TABLE_SCHEMA'],
      database: t['TABLE_CATALOG'],
    }));
  }

  async tableExists(orm: IOrm, tableName: string): Promise<boolean> {
    const result = await orm.query<{ cnt: number }[][]>(`
      select count(*) as cnt from information_schema.tables
      where
        table_name = ?
        and table_schema = database()
    `, [tableName]);
    return result[0][0]['cnt'] > 0;
  }
}
