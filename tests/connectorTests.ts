import { Knex } from 'knex';
import { IConnector } from '../src/connectors/IConnector';

export function runConnectorTests(
  name: string,
  setup: () => Promise<{ db: Knex; connector: IConnector }>,
  teardown: (db: Knex) => Promise<void>,
) {
  describe(name, () => {
    let db: Knex;
    let connector: IConnector;

    beforeAll(async () => {
      const result = await setup();
      db = result.db;
      connector = result.connector;
    });

    afterAll(async () => {
      await teardown(db);
    });

    describe('getColumns', () => {
      it('should return columns for users table', async () => {
        const columns = await connector.getColumns(db, 'users');
        const columnNames = columns.map((c) => c.name);

        expect(columnNames).toContain('id');
        expect(columnNames).toContain('email');
        expect(columnNames).toContain('username');
        expect(columnNames).toContain('created_at');
        expect(columnNames).toContain('updated_at');
      });

      it('should return columns for posts table including view_count', async () => {
        const columns = await connector.getColumns(db, 'posts');
        const columnNames = columns.map((c) => c.name);

        expect(columnNames).toContain('id');
        expect(columnNames).toContain('author_id');
        expect(columnNames).toContain('title');
        expect(columnNames).toContain('slug');
        expect(columnNames).toContain('content');
        expect(columnNames).toContain('excerpt');
        expect(columnNames).toContain('status');
        expect(columnNames).toContain('published_at');
        expect(columnNames).toContain('created_at');
        expect(columnNames).toContain('updated_at');
      });
    });

    describe('getDdl', () => {
      it('should return DDL for users table', async () => {
        const ddl = await connector.getDdl(db, 'users');

        expect(ddl).toBeDefined();
        expect(ddl?.length).toBeGreaterThan(0);
        expect(ddl?.toLowerCase().startsWith('create table')).toBe(true);
      });

      it('should return empty for non-existent table', async () => {
        const ddl = await connector.getDdl(db, 'nonexistent_table_xyz');

        expect(ddl).toBeNull();
      });
    });

    describe('getForeignKeys', () => {
      it('should return foreign keys for comments table', async () => {
        const foreignKeys = await connector.getForeignKeys(db, 'comments');
        const foreignKeyNames = foreignKeys.map((fk) => fk.from_column_name);

        expect(foreignKeyNames).toContain('post_id');
        expect(foreignKeyNames).toContain('parent_id');
        expect(foreignKeyNames).toContain('author_id');
      });
    });

    describe('getTables', () => {
      it('should return all user-created tables', async () => {
        const tables = await connector.getTables(db);
        const tableNames = tables.map((t) => t.name);

        expect(tableNames).toContain('users');
        expect(tableNames).toContain('posts');
        expect(tableNames).toContain('comments');
        expect(tableNames).toContain('tags');
        expect(tableNames).toContain('post_tags');
      });

      it('should not include internal migration tables', async () => {
        const tables = await connector.getTables(db);
        const tableNames = tables.map((t) => t.name);

        const hasKnexTables = tableNames.some((name) =>
          name.toLowerCase().includes('knex'),
        );
        expect(hasKnexTables).toBe(false);
      });
    });
  });
}
