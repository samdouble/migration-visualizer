import { MySQLDB } from 'mysql-memory-server/dist/types';
import { runConnectorTests } from '../../tests/connectorTests';
import { dbConnect, dbDisconnect } from '../../tests/mysql';
import { KnexQueryBuilder } from '../queryBuilders/KnexQueryBuilder';
import { KyselyQueryBuilder } from '../queryBuilders/KyselyQueryBuilder';
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
    const queryBuilder = new KnexQueryBuilder();
    await queryBuilder.initialize({
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
    await queryBuilder.migrateLatest();
    const connector = new MysqlConnector();
    return { queryBuilder, connector };
  },
  async (queryBuilder) => {
    await queryBuilder.rollbackAll();
    await queryBuilder.close();
  },
);

runConnectorTests(
  'Kysely',
  'MySQL',
  async () => {
    const queryBuilder = new KyselyQueryBuilder();
    await queryBuilder.initialize({
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        port: db.port,
        database: db.dbName,
        user: db.username,
        password: '',
      },
      migrations: {
        directory: './tests/fixtures/migrations/kysely',
        extension: 'ts',
      },
    });
    await queryBuilder.migrateLatest();
    const connector = new MysqlConnector();
    return { queryBuilder, connector };
  },
  async (queryBuilder) => {
    await queryBuilder.rollbackAll();
    await queryBuilder.close();
  },
);
