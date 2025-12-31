import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('comments')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('post_id', 'integer', (col) => col.notNull())
    .addColumn('author_id', 'integer', (col) => col.notNull())
    .addColumn('parent_id', 'integer')
    .addColumn('body', 'text', (col) => col.notNull())
    .addColumn('is_approved', 'boolean', (col) => col.defaultTo(false))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addForeignKeyConstraint('comments_post_id_fk', ['post_id'], 'posts', ['id'], (cb) => cb.onDelete('cascade'))
    .addForeignKeyConstraint('comments_author_id_fk', ['author_id'], 'users', ['id'], (cb) => cb.onDelete('cascade'))
    .addForeignKeyConstraint('comments_parent_id_fk', ['parent_id'], 'comments', ['id'], (cb) => cb.onDelete('cascade'))
    .execute();

  await db.schema.createIndex('comments_post_id_index').on('comments').column('post_id').execute();
  await db.schema.createIndex('comments_author_id_index').on('comments').column('author_id').execute();
  await db.schema.createIndex('comments_parent_id_index').on('comments').column('parent_id').execute();
  await db.schema
    .createIndex('comments_author_id_created_at_unique')
    .on('comments')
    .columns(['author_id', 'created_at'])
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('comments').ifExists().execute();
}
