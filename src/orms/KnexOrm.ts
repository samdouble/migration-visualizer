import knex, { Knex } from 'knex';
import fs from 'node:fs';
import path from 'node:path';
import { ConnectorFactory } from '../connectors/ConnectorFactory';
import { State } from '../connectors/types';
import { Migration } from './types';

export class KnexOrm {
  private db: Knex | null = null;

  constructor() {
    this.db = null;
  }

  async initialize(): Promise<void> {
    if (this.db) {
      return;
    }
    const configFilePath = KnexOrm.getConfigFile();
    if (!configFilePath) {
      throw new Error('Knexfile file not found');
    }
    let config: Knex.Config;
    try {
      config = (await import(configFilePath)).default ?? (await import(configFilePath));
    } catch (err) {
      throw new Error(`Error loading Knexfile: ${err}`);
    }
    this.db = knex(config);
  }

  static getConfigFile(): string | null {
    const cwd = process.cwd();
    const candidates = ['knexfile.cjs', 'knexfile.js', 'knexfile.ts'];
    return candidates.map(f => path.join(cwd, f)).find(fs.existsSync) ?? null;
  }

  async getMigrations(): Promise<{ completed: Migration[], pending: Migration[] }> {
    if (!this.db) {
      await this.initialize();
    }
    const [completed, pending] = await this.db!.migrate.list();
    return {
      completed,
      pending,
    };
  }

  async getState(): Promise<State> {
    if (!this.db) {
      await this.initialize();
    }
    const connector = ConnectorFactory.create(this.db!.client?.dialect);
    const tables = await connector.getTables(this.db!);
    const columns = await Promise.all(
      tables.map(async (table) => connector.getColumns(this.db!, table.name)),
    );
    const foreignKeys = await Promise.all(
      tables.map(async (table) => connector.getForeignKeys(this.db!, table.name)),
    );
    const indexes = await Promise.all(
      tables.map(async (table) => connector.getIndexes(this.db!, table.name)),
    );
    return {
      tables,
      columns: columns.flat(),
      foreignKeys: foreignKeys.flat(),
      indexes: indexes.flat(),
    };
  }

  async migrateUp(migrationName: string): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }
    await this.db!.migrate.up({ name: migrationName });
  }

  close(): void {
    if (!this.db) {
      return;
    }
    this.db.destroy();
    this.db = null;
  }
}
