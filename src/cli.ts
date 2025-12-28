#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
migration-visualizer - Visualize your database migrations

Usage:
  migration-visualizer [options]

Options:
  -h, --help      Show this help message
  -v, --version   Show version number
`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

console.log('migration-visualizer');
console.log('No command specified. Use --help for usage information.');
