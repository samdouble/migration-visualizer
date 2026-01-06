import { IQueryBuilder } from '../queryBuilders/IQueryBuilder';
import { IConnector } from './IConnector';
import { Column, Ddl, ForeignKey, Index, Table } from './types';

export type SqliteTable = {
  name: string;
  schema: string;
  database: string;
};

export type SqliteColumn = {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string;
  pk: boolean;
};

export type SqliteDdl = {
  sql: string;
};

export type SqliteForeignKey = {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
  on_delete: string;
  on_update: string;
  match: string;
};

export type SqliteIndex = {
  type: string;
  name: string;
  tbl_name: string;
  rootpage: number;
  sql: string;
};

export class SqliteConnector implements IConnector {
  async getColumns(queryBuilder: IQueryBuilder, tableName: string): Promise<Column[]> {
    const result = await queryBuilder.query<SqliteColumn[]>(`pragma table_info(${tableName})`);
    return result.map((c: SqliteColumn) => ({
      ...c,
      description: undefined,
      table_name: tableName,
    }));
  }

  async getDdl(queryBuilder: IQueryBuilder, tableName: string): Promise<Ddl | null> {
    const result = await queryBuilder.query<SqliteDdl[]>(`
      select sql from sqlite_master
      where
        type='table'
        and name='${tableName}'
      `,
    );
    return result.length > 0 ? result[0].sql : null;
  }

  async getForeignKeys(queryBuilder: IQueryBuilder, tableName: string): Promise<ForeignKey[]> {
    const result = await queryBuilder.query<SqliteForeignKey[]>(`pragma foreign_key_list(${tableName})`);
    return result.map((fk: SqliteForeignKey) => ({
      id: fk.id,
      from_table_name: tableName,
      from_column_name: fk.from,
      to_table_name: fk.table,
      to_column_name: fk.to,
      on_delete: fk.on_delete,
      on_update: fk.on_update,
    }));
  }

  async getIndexes(queryBuilder: IQueryBuilder, tableName: string): Promise<Index[]> {
    const result = await queryBuilder.query<SqliteIndex[]>(`
      select * from sqlite_master
      where
        type='index'
        and tbl_name='${tableName}'
    `);
    return result.map((index: SqliteIndex) => ({
      name: index.name,
      columns: (
        index.sql?.toLowerCase()
          .match(/create(?:\sunique)?\sindex\s`\w+`\s+on\s+`\w+`\s+\((.*?)\)/)?.[1]
          .split(',')
          .map((c) => c.trim().replace(/`/g, ''))
      ) ?? [],
      unique: index.sql?.toLowerCase().startsWith('create unique index'),
      table_name: index.tbl_name,
    }));
  }

  async getTables(queryBuilder: IQueryBuilder): Promise<Table[]> {
    const result = await queryBuilder.query<SqliteTable[]>(`
      select * from sqlite_master 
      where
        type='table' 
        and name not like 'sqlite_%' 
        and name not like '${queryBuilder.getTablePrefix()}%'
    `);
    return result.map((t: SqliteTable) => ({
      name: t.name,
      schema: t.schema,
      database: t.database,
    }));
  }
}
