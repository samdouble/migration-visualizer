import { Knex } from 'knex';
import { Column, Ddl, ForeignKey, Index, Table } from './types';

export interface IConnector {
  getColumns: (db: Knex, tableName: string) => Promise<Column[]>;
  getDdl: (db: Knex, tableName: string) => Promise<Ddl | null>;
  getForeignKeys: (db: Knex, tableName: string) => Promise<ForeignKey[]>;
  getIndexes: (db: Knex, tableName: string) => Promise<Index[]>;
  getTables: (db: Knex) => Promise<Table[]>;
}
