import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('tags')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('slug', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('color', 'varchar(7)')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema
    .createTable('post_tags')
    .addColumn('post_id', 'integer', (col) =>
      col.notNull().references('posts.id').onDelete('cascade'),
    )
    .addColumn('tag_id', 'integer', (col) =>
      col.notNull().references('tags.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('post_tags_pkey', ['post_id', 'tag_id'])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('post_tags').ifExists().execute();
  await db.schema.dropTable('tags').ifExists().execute();
}
