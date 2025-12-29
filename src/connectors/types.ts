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

export type Table = {
  name: string;
  schema: string;
  database: string;
};

export type ForeignKey = {
  id: number;
  from_table_name: string;
  from_column_name: string;
  to_table_name: string;
  to_column_name: string;
  on_delete: string;
  on_update: string;
};
