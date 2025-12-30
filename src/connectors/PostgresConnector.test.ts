import knex from 'knex';
import { runConnectorTests } from '../../tests/connectorTests';
import { PostgresConnector } from './PostgresConnector';

const describeIfPostgres = process.env.CI ? describe : describe.skip;

describeIfPostgres('PostgreSQL', () => {
  runConnectorTests(
    'PostgreSQL',
    async () => {
      const knexDb = knex({
        client: 'pg',
        connection: {
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT!, 10),
          database: process.env.POSTGRES_DB,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
          directory: './tests/fixtures/migrations/knex',
          extension: 'ts',
        },
      });
      await knexDb.migrate.latest();
      const connector = new PostgresConnector();
      return { db: knexDb, connector };
    },
    async (knexDb) => {
      // Clean up tables in reverse order of creation
      await knexDb.migrate.rollback(undefined, true);
      await knexDb.destroy();
    },
  );
});
