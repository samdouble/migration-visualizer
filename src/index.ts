import partition from 'lodash.partition';
import path from 'node:path';
import type { ConnectionOptions } from './orms/OrmFactory';
import { OrmFactory } from './orms/OrmFactory';
import type { DialectType, Migration, OrmType } from './orms/types';
import { VisualizerFactory } from './visualizers/VisualizerFactory';
export * from './connectors';
export * from './orms';
export * from './visualizers';

export type VisualizeOptions = {
  changed: string[];
  connection?: ConnectionOptions;
  dialect?: DialectType;
  migrations?: string;
  orm: OrmType;
  output?: string;
};

export const visualize = async (options: VisualizeOptions) => {
  const {
    changed = [],
    orm: ormName,
    output = 'mermaid',
  } = options;
  if (!ormName) {
    throw new Error('ORM not provided');
  }

  const orm = await OrmFactory.create(ormName, {
    connection: options.connection,
    dialect: options.dialect,
    migrations: options.migrations,
    useNullAsDefault: options.connection?.useNullAsDefault,
  });

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
