import knex from 'knex';
import { runConnectorTests } from '../../tests/connectorTests';
import { SqliteConnector } from './SqliteConnector';

runConnectorTests(
  'SQLite',
  async () => {
    const knexDb = knex({
      client: 'better-sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
      migrations: {
        directory: './tests/fixtures/migrations/knex',
        extension: 'ts',
      },
    });

    await knexDb.migrate.latest();
    const connector = new SqliteConnector();
    return { db: knexDb, connector };
  },
  async (knexDb) => {
    await knexDb.destroy();
  },
);
