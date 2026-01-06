import { runConnectorTests } from '../../tests/connectorTests';
import { KnexQueryBuilder } from '../queryBuilders/KnexQueryBuilder';
import { KyselyQueryBuilder } from '../queryBuilders/KyselyQueryBuilder';
import { PostgresConnector } from './PostgresConnector';

const describeIfPostgres = process.env.CI ? describe : describe.skip;

describeIfPostgres('PostgreSQL', () => {
  runConnectorTests(
    'Knex',
    'PostgreSQL',
    async () => {
      const queryBuilder = new KnexQueryBuilder();
      await queryBuilder.initialize({
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
      await queryBuilder.migrateLatest();
      const connector = new PostgresConnector();
      return { queryBuilder, connector };
    },
    async (queryBuilder) => {
      await queryBuilder.rollbackAll();
      await queryBuilder.close();
    },
  );
});

describeIfPostgres('PostgreSQL', () => {
  runConnectorTests(
    'Kysely',
    'PostgreSQL',
    async () => {
      const queryBuilder = new KyselyQueryBuilder();
      await queryBuilder.initialize({
        client: 'pg',
        connection: {
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT!, 10),
          database: process.env.POSTGRES_DB,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
          directory: './tests/fixtures/migrations/kysely',
          extension: 'ts',
        },
      });
      await queryBuilder.migrateLatest();
      const connector = new PostgresConnector();
      return { queryBuilder, connector };
    },
    async (queryBuilder) => {
      await queryBuilder.rollbackAll();
      await queryBuilder.close();
    },
  );
});
