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
  .option('--changed <files...>', 'list of new and updated migration files', '')
  .option('--output <format>', 'output the diagram to a file', 'mermaid')
  .action(async (options) => {
    const diagram = await visualize({
      ...options,
    });
    console.log(diagram);
  });

if (process.env.NODE_ENV !== 'test') {
  program.parse();
}

export default program;
