import { Knex } from 'knex';
import { Column, Ddl, ForeignKey, Table } from './types';

export interface IConnector {
  getColumns: (db: Knex, tableName: string) => Promise<Column[]>;
  getDdl: (db: Knex, tableName: string) => Promise<Ddl | null>;
  getForeignKeys: (db: Knex, tableName: string) => Promise<ForeignKey[]>;
  getTables: (db: Knex) => Promise<Table[]>;
}
