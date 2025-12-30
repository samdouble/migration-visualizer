import { type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('posts')
    .addColumn('view_count', 'integer', (col) => col.defaultTo(0))
    .execute();

  await db.schema
    .alterTable('posts')
    .addColumn('like_count', 'integer', (col) => col.defaultTo(0))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('posts').dropColumn('view_count').execute();
  await db.schema.alterTable('posts').dropColumn('like_count').execute();
}
