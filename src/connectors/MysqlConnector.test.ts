import knex from 'knex';
import { MySQLDB } from 'mysql-memory-server/dist/types';
import { runConnectorTests } from '../../tests/connectorTests';
import { dbConnect, dbDisconnect } from '../../tests/mysql';
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
  'MySQL',
  async () => {
    const knexDb = knex({
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        port: db.port,
        database: db.dbName,
        user: db.username,
        password: '',
      },
      migrations: {
        directory: './tests/fixtures/migrations',
        extension: 'ts',
      },
    });
    await knexDb.migrate.latest();
    const connector = new MysqlConnector(knexDb);
    return { db: knexDb, connector };
  },
  async (knexDb) => {
    await knexDb.destroy();
  }
);
