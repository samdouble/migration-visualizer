import knex, { Knex } from 'knex';
import partition from 'lodash.partition';
import fs from 'node:fs';
import path from 'node:path';
import { ConnectorFactory } from './connectors/ConnectorFactory';
import { State } from './connectors/types';
import { VisualizerFactory } from './visualizers/VisualizerFactory';
export { IConnector } from './connectors/IConnector';
export { MysqlConnector } from './connectors/MysqlConnector';
export { SqliteConnector } from './connectors/SqliteConnector';
export { Column, Ddl, State, Table } from './connectors/types';
export { MermaidVisualizer } from './visualizers/MermaidVisualizer';

export type VisualizeOptions = {
  output?: string;
  changed: string[];
};

const findKnexConfig = () => {
  const cwd = process.cwd();
  const candidates = ['knexfile.cjs', 'knexfile.js', 'knexfile.ts'];
  return candidates.map(f => path.join(cwd, f)).find(fs.existsSync);
};

const getState = async (db: Knex): Promise<State> => {
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
  return {
    tables,
    columns: columns.flat(),
    foreignKeys: foreignKeys.flat(),
    indexes: indexes.flat(),
  };
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
  const migrations = await db.migrate.list();
  const pendingMigrations = migrations[1];
  const [beforeMigrations, afterMigrations] = partition(
    pendingMigrations,
    (migration: { file: string, directory: string }) => {
      const changedFiles = changed.map((file: string) => path.basename(file));
      return !changedFiles.includes(migration.file);
    },
  );

  for (const migration of beforeMigrations) {
    await db.migrate.up({ name: migration.file });
  }
  const beforeState = await getState(db);
  for (const migration of afterMigrations) {
    await db.migrate.up({ name: migration.file });
  }
  const afterState = await getState(db);

  db.destroy();

  const visualizer = VisualizerFactory.create(output);
  return visualizer.visualize(beforeState, afterState);
};
