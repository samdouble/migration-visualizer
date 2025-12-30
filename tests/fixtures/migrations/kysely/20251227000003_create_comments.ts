import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('comments')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('post_id', 'integer', (col) =>
      col.notNull().references('posts.id').onDelete('cascade'),
    )
    .addColumn('author_id', 'integer', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('parent_id', 'integer', (col) =>
      col.references('comments.id').onDelete('cascade'),
    )
    .addColumn('body', 'text', (col) => col.notNull())
    .addColumn('is_approved', 'boolean', (col) => col.defaultTo(false))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
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
