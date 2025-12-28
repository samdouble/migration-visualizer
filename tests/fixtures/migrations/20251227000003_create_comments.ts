import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.integer('post_id').unsigned().notNullable()
      .references('id').inTable('posts').onDelete('CASCADE');
    table.integer('author_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('parent_id').unsigned()
      .references('id').inTable('comments').onDelete('CASCADE');
    table.text('body').notNullable();
    table.boolean('is_approved').defaultTo(false);
    table.timestamps(true, true);

    table.index('post_id');
    table.index('author_id');
    table.index('parent_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comments');
}
