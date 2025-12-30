import partition from 'lodash.partition';
import path from 'node:path';
import { OrmFactory } from './orms/OrmFactory';
import type { Migration } from './orms/types';
import { VisualizerFactory } from './visualizers/VisualizerFactory';
export * from './connectors';
export * from './orms';
export * from './visualizers';

export type VisualizeOptions = {
  output?: string;
  changed: string[];
};

export const visualize = async (options: VisualizeOptions) => {
  const {
    changed = [],
    output = 'mermaid',
  } = options;
  let orm;
  try {
    orm = OrmFactory.create();
  } catch (error) {
    console.error('Error creating ORM:', error);
    process.exit(1);
  }

  const migrations = await orm.getMigrations();
  const pendingMigrations = migrations.pending;
  const [beforeMigrations, afterMigrations] = partition(
    pendingMigrations,
    (migration: Migration) => {
      const changedFiles = changed.map((file: string) => path.basename(file));
      return !changedFiles.includes(migration.file);
    },
  );

  for (const migration of beforeMigrations) {
    await orm.migrateUp(migration.file);
  }
  const beforeState = await orm.getState();
  for (const migration of afterMigrations) {
    await orm.migrateUp(migration.file);
  }
  const afterState = await orm.getState();

  orm.close();

  const visualizer = VisualizerFactory.create(output);
  return visualizer.visualize(beforeState, afterState);
};
