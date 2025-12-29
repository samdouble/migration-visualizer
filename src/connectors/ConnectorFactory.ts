import { MysqlConnector } from "./MysqlConnector";
import { SqliteConnector } from "./SqliteConnector";

export const ConnectorFactory = {
  create: (dialect: string) => {
    switch (dialect) {
      case 'mysql':
      case 'mysql2':
        return new MysqlConnector();
      case 'sqlite':
      case 'sqlite3':
        return new SqliteConnector();
      default:
        throw new Error(`Unsupported database type: ${dialect}`);
    }
  },
};
