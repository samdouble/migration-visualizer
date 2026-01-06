import partition from 'lodash.partition';
import path from 'node:path';
import type { ConnectionOptions } from './queryBuilders/QueryBuilderFactory';
import { QueryBuilderFactory } from './queryBuilders/QueryBuilderFactory';
import type { DialectType, Migration, QueryBuilderType } from './queryBuilders/types';
import { VisualizerFactory } from './visualizers/VisualizerFactory';
export * from './connectors';
export * from './queryBuilders';
export * from './visualizers';

export type VisualizeOptions = {
  changed: string[];
  connection?: ConnectionOptions;
  dialect?: DialectType;
  migrations?: string;
  queryBuilder: QueryBuilderType;
  output?: string;
};

export const visualize = async (options: VisualizeOptions) => {
  const {
    changed = [],
    queryBuilder: queryBuilderName,
    output = 'mermaid',
  } = options;
  if (!queryBuilderName) {
    throw new Error('Query builder not provided');
  }

  const queryBuilder = await QueryBuilderFactory.create(queryBuilderName, {
    connection: options.connection,
    dialect: options.dialect,
    migrations: options.migrations,
    useNullAsDefault: options.connection?.useNullAsDefault,
  });

  const migrations = await queryBuilder.getMigrations();
  const pendingMigrations = migrations.pending;
  const [beforeMigrations, afterMigrations] = partition(
    pendingMigrations,
    (migration: Migration) => {
      const changedFiles = changed.map((file: string) => path.basename(file));
      return !changedFiles.includes(migration.file);
    },
  );

  for (const migration of beforeMigrations) {
    await queryBuilder.migrateUp(migration.file);
  }
  const beforeState = await queryBuilder.getState();
  for (const migration of afterMigrations) {
    await queryBuilder.migrateUp(migration.file);
  }
  const afterState = await queryBuilder.getState();

  queryBuilder.close();

  const visualizer = VisualizerFactory.create(output);
  return visualizer.visualize(beforeState, afterState);
};
