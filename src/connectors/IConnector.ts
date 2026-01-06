import { IQueryBuilder } from '../queryBuilders/IQueryBuilder';
import { Column, Ddl, ForeignKey, Index, Table } from './types';

export interface IConnector {
  getColumns: (queryBuilder: IQueryBuilder, tableName: string) => Promise<Column[]>;
  getDdl: (queryBuilder: IQueryBuilder, tableName: string) => Promise<Ddl | null>;
  getForeignKeys: (queryBuilder: IQueryBuilder, tableName: string) => Promise<ForeignKey[]>;
  getIndexes: (queryBuilder: IQueryBuilder, tableName: string) => Promise<Index[]>;
  getTables: (queryBuilder: IQueryBuilder) => Promise<Table[]>;
}
