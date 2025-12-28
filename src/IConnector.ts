import { Column, Ddl, Table } from "./types";

export interface IConnector {
  getColumns: (tableName: string) => Promise<Column[]>;
  getDdl: (tableName: string) => Promise<Ddl[]>;
  getTables: () => Promise<Table[]>;
}
