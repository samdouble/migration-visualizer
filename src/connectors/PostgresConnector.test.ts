import { runConnectorTests } from '../../tests/connectorTests';
import { KnexOrm } from '../orms/KnexOrm';
import { KyselyOrm } from '../orms/KyselyOrm';
import { PostgresConnector } from './PostgresConnector';

const describeIfPostgres = process.env.CI ? describe : describe.skip;

describeIfPostgres('PostgreSQL', () => {
  runConnectorTests(
    'Knex',
    'PostgreSQL',
    async () => {
      const orm = new KnexOrm();
      await orm.initialize({
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
      await orm.migrateLatest();
      const connector = new PostgresConnector();
      return { orm, connector };
    },
    async (orm) => {
      await orm.rollbackAll();
      await orm.close();
    },
  );
});

describeIfPostgres('PostgreSQL', () => {
  runConnectorTests(
    'Kysely',
    'PostgreSQL',
    async () => {
      const orm = new KyselyOrm();
      await orm.initialize({
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
      await orm.migrateLatest();
      const connector = new PostgresConnector();
      return { orm, connector };
    },
    async (orm) => {
      await orm.rollbackAll();
      await orm.close();
    },
  );
});
