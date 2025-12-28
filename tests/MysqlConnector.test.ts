import knex from 'knex';
import { MySQLDB } from 'mysql-memory-server/dist/types';
import { MysqlConnector } from '../src/connectors/MysqlConnector';
import { runConnectorTests } from './connectorTests';
import { dbConnect, dbDisconnect } from './mysql';

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
