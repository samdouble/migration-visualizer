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
  .option('--output', 'output the diagram to a file')
  .action(async (_arg, options) => {
    const output = options.output;
    const diagram = await visualize(output);
    console.log(diagram);
  });

program.parse();
