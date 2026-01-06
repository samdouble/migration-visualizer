export enum DialectType {
  BetterSqlite3 = 'better-sqlite3',
  Mysql = 'mysql',
  Mysql2 = 'mysql2',
  Pg = 'pg',
  Postgres = 'postgres',
  Postgresql = 'postgresql',
  Sqlite = 'sqlite',
  Sqlite3 = 'sqlite3',
}

export type MigrationConfig = {
  directory: string;
  extension: string;
};

export type MysqlConnectionConfig = {
  client: 'mysql' | 'mysql2';
  connection: {
    host: string;
    port: number;
    database: string;
    user?: string;
    password?: string;
  };
  migrations: MigrationConfig;
};

export type PostgresConnectionConfig = {
  client: 'pg' | 'postgres' | 'postgresql';
  connection: {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
  };
  migrations: MigrationConfig;
};

export type SqliteConnectionConfig = {
  client: 'better-sqlite3' | 'sqlite' | 'sqlite3';
  connection: {
    filename: string;
  };
  useNullAsDefault: boolean;
  migrations: MigrationConfig;
};

export type QueryBuilderConfig = (
  MysqlConnectionConfig
  | PostgresConnectionConfig
  | SqliteConnectionConfig
);

export type Migration = {
  file: string;
  directory: string;
};

export enum QueryBuilderType {
  Knex = 'knex',
  Kysely = 'kysely',
}
