import knex, { Knex } from 'knex';
import fs from 'node:fs';
import path from 'node:path';
import { ConnectorFactory } from './connectors/ConnectorFactory';
import { VisualizerFactory } from './visualizers/VisualizerFactory';
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

export type VisualizeOptions = {
  output?: string;
  changed: string[];
};

export const visualize = async (options: VisualizeOptions) => {
  const {
    changed = [],
    output = 'mermaid',
  } = options;
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
  console.log(changed);
  const list = await db.migrate.list();
  console.log(list);
  await db.migrate.latest();

  const connector = ConnectorFactory.create(db.client?.dialect);
  const tables = await connector.getTables(db);
  const columns = await Promise.all(
    tables.map(async (table) => connector.getColumns(db, table.name)),
  );
  const foreignKeys = await Promise.all(
    tables.map(async (table) => connector.getForeignKeys(db, table.name)),
  );
  const indexes = await Promise.all(
    tables.map(async (table) => connector.getIndexes(db, table.name)),
  );

  db.destroy();

  const visualizer = VisualizerFactory.create(output);
  return visualizer.visualize(tables, columns.flat(), foreignKeys.flat(), indexes.flat());
};
