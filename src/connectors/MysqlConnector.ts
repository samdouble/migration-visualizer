import { Knex } from 'knex';
import { IConnector } from './IConnector';
import { Column, Ddl, MysqlColumn, MysqlTable, Table } from './types';

export class MysqlConnector implements IConnector {
  async getColumns(db: Knex, tableName: string): Promise<Column[]> {
    const result = await db.raw(`
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
      type: c['COLUMN_TYPE'],
      notnull: c['IS_NULLABLE'] === 'NO',
      dflt_value: c['COLUMN_DEFAULT'],
      pk: c['COLUMN_KEY'] === 'PRI',
      table_name: c['TABLE_NAME'],
    }));
  }

  async getDdl(db: Knex, tableName: string): Promise<Ddl | null> {
    const exists = await this.tableExists(db, tableName);
    if (!exists) {
      return null;
    }
    const result = await db.raw(`
      show create table ${tableName}
    `);
    return result[0][0]['Create Table'];
  }

  async getTables(db: Knex): Promise<Table[]> {
    const result = await db.raw(`
      select * from information_schema.tables
      where
        table_type = 'BASE TABLE'
        and table_schema = database()
        and table_name not like 'knex_%'
    `);
    return result[0].map((t: MysqlTable) => ({
      name: t['TABLE_NAME'],
      schema: t['TABLE_SCHEMA'],
      database: t['TABLE_CATALOG'],
    }));
  }

  async tableExists(db: Knex, tableName: string): Promise<boolean> {
    const result = await db.raw(`
      select count(*) as cnt from information_schema.tables
      where
        table_name = ?
        and table_schema = database()
    `, [tableName]);
    return result[0][0]['cnt'] > 0;
  }
}
