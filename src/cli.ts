#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { visualize } from './index';

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8'),
);
const program = new Command();

program
  .name('migration-visualizer')
  .description('Migration Visualizer for Knex.js')
  .version(packageJson.version);

program.command('visualize')
  .description('Visualize a database migration as a Entity Relationship diagram')
  // Required
  .option('--query-builder <query-builder>', 'Query builder to use (knex, kysely)')
  // Required for Kysely
  .option('--dialect <dialect>', 'database dialect (e.g., sqlite3, mysql2, pg)')
  .option('--migrations <path>', 'path to migrations directory')
  .option('--host <host>', 'database host')
  .option('--port <port>', 'database port')
  .option('--database <database>', 'database name')
  .option('--user <user>', 'database user')
  .option('--password <password>', 'database password')
  .option('--filename <filename>', 'database filename')
  .option('--useNullAsDefault', 'use null as default for sqlite3', false)
  // Optional
  .option('--changed <files...>', 'list of new and updated migration files', '')
  .option('--output <format>', 'output the diagram to a file', 'mermaid')
  .action(async (options) => {
    const diagram = await visualize({
      changed: options.changed,
      connection: {
        host: options.host,
        port: options.port,
        database: options.database,
        user: options.user,
        password: options.password,
        useNullAsDefault: options.useNullAsDefault,
      },
      dialect: options.dialect,
      migrations: options.migrations,
      queryBuilder: options.queryBuilder,
      output: options.output,
    });
    console.log(diagram);
  });

if (process.env.NODE_ENV !== 'test') {
  program.parse();
}

export default program;
