import { runConnectorTests } from '../../tests/connectorTests';
import { KnexOrm } from '../orms/KnexOrm';
import { KyselyOrm } from '../orms/KyselyOrm';
import { DialectType } from '../orms/types';
import { SqliteConnector } from './SqliteConnector';

runConnectorTests(
  'Knex',
  'SQLite',
  async () => {
    const orm = new KnexOrm();
    await orm.initialize({
      client: DialectType.BetterSqlite3,
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
      migrations: {
        directory: './tests/fixtures/migrations/knex',
        extension: 'ts',
      },
    });
    await orm.migrateLatest();
    const connector = new SqliteConnector();
    return { orm, connector };
  },
  async (orm) => {
    await orm.rollbackAll();
    await orm.close();
  },
);

runConnectorTests(
  'Kysely',
  'SQLite',
  async () => {
    const orm = new KyselyOrm();
    await orm.initialize({
      client: 'better-sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
      migrations: {
        directory: './tests/fixtures/migrations/kysely',
        extension: 'ts',
      },
    });
    await orm.migrateLatest();
    const connector = new SqliteConnector();
    return { orm, connector };
  },
  async (orm) => {
    await orm.rollbackAll();
    await orm.close();
  },
);
