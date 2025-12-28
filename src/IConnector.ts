import { Column, Ddl, Table } from "./types";

export interface IConnector {
  getColumns: (tableName: string) => Promise<Column[]>;
  getDdl: (tableName: string) => Promise<Ddl | null>;
  getTables: () => Promise<Table[]>;
}
