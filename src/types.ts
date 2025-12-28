export type Column = {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string;
  pk: boolean;
};

export type Ddl = {
  sql: string;
};

export type Table = {
  name: string;
};
