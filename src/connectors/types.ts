export enum EngineType {
  Mysql = 'mysql',
  Pg = 'pg',
  Sqlite = 'sqlite',
}

export type Column = {
  cid: number;
  name: string;
  description?: string;
  type: string;
  notnull: boolean;
  dflt_value: string | null;
  pk: boolean;
  table_name: string;
};

export type Ddl = string;

export type ForeignKey = {
  id: number | string;
  from_table_name: string;
  from_column_name: string;
  to_table_name: string;
  to_column_name: string;
  on_delete: string;
  on_update: string;
};

export type Index = {
  name: string;
  columns: string[];
  unique: boolean;
  table_name: string;
};

export type Table = {
  name: string;
  schema: string;
  database: string;
};

export type State = {
  tables: Table[];
  columns: Column[];
  foreignKeys: ForeignKey[];
  indexes: Index[];
};
