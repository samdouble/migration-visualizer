import { IOrm } from '../orms/IOrm';
import { Column, Ddl, ForeignKey, Index, Table } from './types';

export interface IConnector {
  getColumns: (orm: IOrm, tableName: string) => Promise<Column[]>;
  getDdl: (orm: IOrm, tableName: string) => Promise<Ddl | null>;
  getForeignKeys: (orm: IOrm, tableName: string) => Promise<ForeignKey[]>;
  getIndexes: (orm: IOrm, tableName: string) => Promise<Index[]>;
  getTables: (orm: IOrm) => Promise<Table[]>;
}
