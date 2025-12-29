export type Column = {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string;
  pk: boolean;
  table_name: string;
};

export type Ddl = string;

export type MysqlTable = {
  TABLE_NAME: string;
  TABLE_SCHEMA: string;
  TABLE_CATALOG: string;
};

export type MysqlColumn = {
  COLUMN_DEFAULT: string;
  COLUMN_KEY: string;
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  ORDINAL_POSITION: number;
  TABLE_NAME: string;
};

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

export type Table = {
  name: string;
  schema: string;
  database: string;
};
