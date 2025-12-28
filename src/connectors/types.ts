export type Column = {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string;
  pk: boolean;
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
};
export type SqliteTable = {
  name: string;
  schema: string;
  database: string;
};

export type Table = {
  name: string;
  schema: string;
  database: string;
};
