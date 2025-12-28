import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', (table) => {
    table.integer('view_count').unsigned().defaultTo(0);
    table.integer('like_count').unsigned().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', (table) => {
    table.dropColumn('view_count');
    table.dropColumn('like_count');
  });
}
