import { IConnector } from '../src/connectors/IConnector';
import { IOrm } from '../src/orms/IOrm';

export function runConnectorTests(
  ormName: string,
  connectorName: string,
  setup: () => Promise<{ orm: IOrm; connector: IConnector }>,
  teardown: (orm: IOrm) => Promise<void>,
) {
  describe(`${ormName} - ${connectorName}`, () => {
    let orm: IOrm;
    let connector: IConnector;

    beforeAll(async () => {
      const result = await setup();
      orm = result.orm;
      connector = result.connector;
    });

    afterAll(async () => {
      await teardown(orm);
    });

    describe('getColumns', () => {
      it('should return columns for users table', async () => {
        const columns = await connector.getColumns(orm, 'users');
        const columnNames = columns.map((c) => c.name);

        expect(columnNames).toContain('id');
        expect(columnNames).toContain('email');
        expect(columnNames).toContain('username');
        expect(columnNames).toContain('created_at');
        expect(columnNames).toContain('updated_at');
      });

      it('should return columns for posts table including view_count', async () => {
        const columns = await connector.getColumns(orm, 'posts');
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
        const ddl = await connector.getDdl(orm, 'users');

        expect(ddl).toBeDefined();
        expect(ddl?.length).toBeGreaterThan(0);
        expect(ddl?.toLowerCase().startsWith('create table')).toBe(true);
      });

      it('should return empty for non-existent table', async () => {
        const ddl = await connector.getDdl(orm, 'nonexistent_table_xyz');

        expect(ddl).toBeNull();
      });
    });

    describe('getForeignKeys', () => {
      it('should return foreign keys for comments table', async () => {
        const foreignKeys = await connector.getForeignKeys(orm, 'comments');
        const foreignKeyNames = foreignKeys.map((fk) => fk.from_column_name);

        expect(foreignKeyNames).toContain('post_id');
        expect(foreignKeyNames).toContain('parent_id');
        expect(foreignKeyNames).toContain('author_id');
      });
    });

    describe('getIndexes', () => {
      it('should return indexes for comments table', async () => {
        const indexes = await connector.getIndexes(orm, 'comments');
        const indexNames = indexes.map((i) => i.name);

        expect(indexNames).toContain('comments_post_id_index');
        expect(indexNames).toContain('comments_author_id_index');
        expect(indexNames).toContain('comments_parent_id_index');
        expect(indexNames).toContain('comments_author_id_created_at_unique');
      });
    });

    describe('getTables', () => {
      it('should return all user-created tables', async () => {
        const tables = await connector.getTables(orm);
        const tableNames = tables.map((t) => t.name);

        expect(tableNames).toContain('users');
        expect(tableNames).toContain('posts');
        expect(tableNames).toContain('comments');
        expect(tableNames).toContain('tags');
        expect(tableNames).toContain('post_tags');
      });

      it('should not include internal migration tables', async () => {
        const tables = await connector.getTables(orm);
        const tableNames = tables.map((t) => t.name);

        const hasInternalTables = tableNames.some((name) =>
          name.toLowerCase().startsWith(orm.getTablePrefix()),
        );
        expect(hasInternalTables).toBe(false);
      });
    });
  });
}
