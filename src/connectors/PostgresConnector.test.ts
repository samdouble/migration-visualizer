import { runConnectorTests } from '../../tests/connectorTests';
import { KnexOrm } from '../orms/KnexOrm';
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
      await orm.close();
    },
  );
});
