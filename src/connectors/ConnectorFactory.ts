import { DialectType } from "../queryBuilders/types";
import { IConnector } from "./IConnector";
import { MysqlConnector } from "./MysqlConnector";
import { PostgresConnector } from "./PostgresConnector";
import { SqliteConnector } from "./SqliteConnector";

export const ConnectorFactory = {
  create: (dialectName: string): IConnector => {
    const dialect = dialectName as DialectType;
    switch (dialect) {
      case DialectType.Mysql:
      case DialectType.Mysql2:
        return new MysqlConnector();
      case DialectType.Pg:
      case DialectType.Postgres:
      case DialectType.Postgresql:
        return new PostgresConnector();
      case DialectType.Sqlite:
      case DialectType.Sqlite3:
      case DialectType.BetterSqlite3:
        return new SqliteConnector();
      default:
        throw new Error(`Unsupported database type: ${dialect}`);
    }
  },
};
