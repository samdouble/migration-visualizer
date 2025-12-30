import { MySQLDB } from 'mysql-memory-server/dist/types';
import { runConnectorTests } from '../../tests/connectorTests';
import { dbConnect, dbDisconnect } from '../../tests/mysql';
import { KnexOrm } from '../orms/KnexOrm';
import { MysqlConnector } from './MysqlConnector';

let db: MySQLDB;

beforeAll(async () => {
  const res = await dbConnect();
  db = res.db;
});

afterAll(async () => {
  await dbDisconnect();
});

runConnectorTests(
  'Knex',
  'MySQL',
  async () => {
    const orm = new KnexOrm();
    await orm.initialize({
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        port: db.port,
        database: db.dbName,
        user: db.username,
        password: '',
      },
      migrations: {
        directory: './tests/fixtures/migrations/knex',
        extension: 'ts',
      },
    });
    await orm.migrateLatest();
    const connector = new MysqlConnector();
    return { orm, connector };
  },
  async (orm) => {
    await orm.close();
  },
);
