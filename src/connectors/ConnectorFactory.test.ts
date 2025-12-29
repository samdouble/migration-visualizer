import { ConnectorFactory } from "./ConnectorFactory";
import { MysqlConnector } from "./MysqlConnector";
import { SqliteConnector } from "./SqliteConnector";

describe('ConnectorFactory', () => {
  it('should create a MySQL connector', () => {
    const connector = ConnectorFactory.create('mysql');
    expect(connector).toBeInstanceOf(MysqlConnector);
  });

  it('should create a SQLite connector', () => {
    const connector = ConnectorFactory.create('sqlite');
    expect(connector).toBeInstanceOf(SqliteConnector);
  });
});
