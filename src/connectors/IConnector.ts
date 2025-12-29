import { Knex } from 'knex';
import { Column, Ddl, Table } from './types';

export interface IConnector {
  getColumns: (db: Knex, tableName: string) => Promise<Column[]>;
  getDdl: (db: Knex, tableName: string) => Promise<Ddl | null>;
  getTables: (db: Knex) => Promise<Table[]>;
}
