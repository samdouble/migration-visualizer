import { EngineType } from "../connectors/types";
import { DialectType } from "./types";

export const getEngineFromDialect = (dialect: DialectType): EngineType => {
  switch (dialect) {
    case DialectType.Mysql:
    case DialectType.Mysql2:
      return EngineType.Mysql;
    case DialectType.Pg:
    case DialectType.Postgres:
    case DialectType.Postgresql:
      return EngineType.Pg;
    case DialectType.Sqlite:
    case DialectType.Sqlite3:
    case DialectType.BetterSqlite3:
      return EngineType.Sqlite;
    default:
      throw new Error(`Unsupported dialect: ${dialect}`);
  }
};