import { IConnector } from "./IConnector";
import { MysqlConnector } from "./MysqlConnector";
import { PostgresConnector } from "./PostgresConnector";
import { SqliteConnector } from "./SqliteConnector";

export const ConnectorFactory = {
  create: (dialect: string): IConnector => {
    switch (dialect) {
      case 'mysql':
      case 'mysql2':
        return new MysqlConnector();
      case 'pg':
      case 'postgres':
      case 'postgresql':
        return new PostgresConnector();
      case 'sqlite':
      case 'sqlite3':
      case 'better-sqlite3':
        return new SqliteConnector();
      default:
        throw new Error(`Unsupported database type: ${dialect}`);
    }
  },
};
