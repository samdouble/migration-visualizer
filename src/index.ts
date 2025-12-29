import knex, { Knex } from 'knex';
import fs from 'node:fs';
import path from 'node:path';
import { ConnectorFactory } from './connectors/ConnectorFactory';
import { MermaidVisualizer } from './visualizers/MermaidVisualizer';
export { IConnector } from './connectors/IConnector';
export { MysqlConnector } from './connectors/MysqlConnector';
export { SqliteConnector } from './connectors/SqliteConnector';
export { Column, Ddl, Table } from './connectors/types';
export { MermaidVisualizer } from './visualizers/MermaidVisualizer';

const findKnexConfig = () => {
  const cwd = process.cwd();
  const candidates = ['knexfile.cjs', 'knexfile.js', 'knexfile.ts'];
  return candidates.map(f => path.join(cwd, f)).find(fs.existsSync);
};

export const visualize = async (_output: string) => {
  const knexfilePath = findKnexConfig();
  if (!knexfilePath) {
    console.error('knexfile not found');
    process.exit(1);
  }
  let config: Knex.Config;
  try {
    config = (await import(knexfilePath)).default ?? (await import(knexfilePath));
  } catch (err) {
    console.error(`Error loading knexfile: ${err}`);
    process.exit(1);
  }

  const db = knex(config);
  await db.migrate.latest();

  const connector = ConnectorFactory.create(db.client?.dialect);
  const tables = await connector.getTables(db);
  const columns = await Promise.all(
    tables.map(async (table) => connector.getColumns(db, table.name)),
  );
  const foreignKeys = await Promise.all(
    tables.map(async (table) => connector.getForeignKeys(db, table.name)),
  );

  db.destroy();

  const visualizer = new MermaidVisualizer();
  return visualizer.visualize(tables, columns.flat(), foreignKeys.flat());
};
