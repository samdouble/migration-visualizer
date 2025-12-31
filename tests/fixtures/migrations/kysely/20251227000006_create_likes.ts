import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('likes')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('post_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addForeignKeyConstraint('likes_user_id_fk', ['user_id'], 'users', ['id'], (cb) => cb.onDelete('cascade'))
    .addForeignKeyConstraint('likes_post_id_fk', ['post_id'], 'posts', ['id'], (cb) => cb.onDelete('cascade'))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('likes').ifExists().execute();
}
