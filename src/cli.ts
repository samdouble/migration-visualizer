#!/usr/bin/env node

import { Command } from 'commander';
import { visualize } from './index';

const program = new Command();

program
  .name('migration-visualizer')
  .description('Migration Visualizer for Knex.js')
  .version('0.1.0');

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
