import { runConnectorTests } from '../../tests/connectorTests';
import { KnexQueryBuilder } from '../queryBuilders/KnexQueryBuilder';
import { KyselyQueryBuilder } from '../queryBuilders/KyselyQueryBuilder';
import { DialectType } from '../queryBuilders/types';
import { SqliteConnector } from './SqliteConnector';

runConnectorTests(
  'Knex',
  'SQLite',
  async () => {
    const queryBuilder = new KnexQueryBuilder();
    await queryBuilder.initialize({
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
    await queryBuilder.migrateLatest();
    const connector = new SqliteConnector();
    return { queryBuilder, connector };
  },
  async (queryBuilder) => {
    await queryBuilder.rollbackAll();
    await queryBuilder.close();
  },
);

runConnectorTests(
  'Kysely',
  'SQLite',
  async () => {
    const queryBuilder = new KyselyQueryBuilder();
    await queryBuilder.initialize({
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
    await queryBuilder.migrateLatest();
    const connector = new SqliteConnector();
    return { queryBuilder, connector };
  },
  async (queryBuilder) => {
    await queryBuilder.rollbackAll();
    await queryBuilder.close();
  },
);
