import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('posts')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('author_id', 'integer', (col) => col.notNull())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('slug', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('content', 'text')
    .addColumn('excerpt', 'text')
    .addColumn('status', 'varchar(20)', (col) => col.defaultTo('draft'))
    .addColumn('published_at', 'timestamp')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addForeignKeyConstraint('posts_author_id_fk', ['author_id'], 'users', ['id'], (cb) => cb.onDelete('cascade'))
    .execute();

  await db.schema.createIndex('posts_author_id_index').on('posts').column('author_id').execute();
  await db.schema.createIndex('posts_status_index').on('posts').column('status').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('posts').ifExists().execute();
}
