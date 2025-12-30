import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('tags', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('slug').notNullable().unique();
      table.string('color', 7);
      table.timestamps(true, true);
    })
    .createTable('post_tags', (table) => {
      table.integer('post_id').unsigned().notNullable()
        .references('id').inTable('posts').onDelete('CASCADE');
      table.integer('tag_id').unsigned().notNullable()
        .references('id').inTable('tags').onDelete('CASCADE');
      table.primary(['post_id', 'tag_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('post_tags')
    .dropTableIfExists('tags');
}
