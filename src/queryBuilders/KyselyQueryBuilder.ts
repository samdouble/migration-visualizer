import SqliteDatabase from 'better-sqlite3';
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  MysqlDialect,
  NO_MIGRATIONS,
  PostgresDialect,
  SqliteDialect,
  sql,
} from 'kysely';
import { createPool as createMysqlPool } from 'mysql2';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import { Pool as PostgresPool } from 'pg';
import { ConnectorFactory } from '../connectors/ConnectorFactory';
import { EngineType, State } from '../connectors/types';
import { IQueryBuilder } from './IQueryBuilder';
import {
  DialectType,
  Migration,
  MysqlConnectionConfig,
  PostgresConnectionConfig,
  QueryBuilderConfig,
  SqliteConnectionConfig,
} from './types';
import { getEngineFromDialect } from './utils';

export class KyselyQueryBuilder implements IQueryBuilder {
  private db: Kysely<unknown> | null = null;
  private dialect: DialectType | null = null;
  private migrator: Migrator | null = null;
  private migrationsDir: string | null = null;

  constructor() {
    this.db = null;
    this.dialect = null;
    this.migrator = null;
    this.migrationsDir = null;
  }

  async initialize(providedConfig?: QueryBuilderConfig): Promise<void> {
    if (this.db) {
      return;
    }
    if (!providedConfig) {
      throw new Error('Kysely config not provided');
    }
    const { client: dialectName, migrations } = providedConfig;
    const dialect = dialectName as DialectType;
    const engine = getEngineFromDialect(dialect);
    let dialectObj: MysqlDialect | PostgresDialect | SqliteDialect;
    switch (engine) {
      case EngineType.Mysql: {
        const connection = providedConfig.connection as MysqlConnectionConfig['connection'];
        dialectObj = new MysqlDialect({
          pool: createMysqlPool({
            host: connection?.host ?? 'localhost',
            port: connection?.port ?? 3306,
            database: connection?.database,
            user: connection?.user,
            password: connection?.password,
          }),
        });
        break;
      }
      case EngineType.Pg: {
        const connection = providedConfig.connection as PostgresConnectionConfig['connection'];
        dialectObj = new PostgresDialect({
          pool: new PostgresPool({
            host: connection?.host ?? 'localhost',
            port: connection?.port ?? 5432,
            database: connection?.database,
            user: connection?.user,
            password: connection?.password,
          }),
        });
        break;
      }
      case EngineType.Sqlite: {
        const connection = providedConfig.connection as SqliteConnectionConfig['connection'];
        dialectObj = new SqliteDialect({
          database: new SqliteDatabase(connection?.filename ?? 'dev.sqlite3'),
        });
        break;
      }
      default:
        throw new Error(`Unsupported dialect: ${dialectName}`);
    }
    this.db = new Kysely({
      dialect: dialectObj,
    });
    this.dialect = dialect;
    this.migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider({
        fs: fsPromises,
        path,
        migrationFolder: path.join(process.cwd(), migrations?.directory ?? ''),
      }),
    });
  }

  async getMigrations(): Promise<{ completed: Migration[], pending: Migration[] }> {
    if (!this.db || !this.migrator) {
      await this.initialize();
    }
    const migrations = await this.migrator!.getMigrations();

    const completed: Migration[] = [];
    const pending: Migration[] = [];

    for (const migration of migrations) {
      const migrationData: Migration = {
        file: `${migration.name}.ts`,
        directory: this.migrationsDir!,
      };
      if (migration.executedAt) {
        completed.push(migrationData);
      } else {
        pending.push(migrationData);
      }
    }

    return { completed, pending };
  }

  async getState(): Promise<State> {
    if (!this.db) {
      await this.initialize();
    }
    const connector = ConnectorFactory.create(this.dialect!);
    const tables = await connector.getTables(this);
    const columns = await Promise.all(
      tables.map(async (table) => connector.getColumns(this, table.name)),
    );
    const foreignKeys = await Promise.all(
      tables.map(async (table) => connector.getForeignKeys(this, table.name)),
    );
    const indexes = await Promise.all(
      tables.map(async (table) => connector.getIndexes(this, table.name)),
    );
    return {
      tables,
      columns: columns.flat(),
      foreignKeys: foreignKeys.flat(),
      indexes: indexes.flat(),
    };
  }

  getTablePrefix(): string {
    return 'kysely_';
  }

  async migrateLatest(): Promise<void> {
    if (!this.db || !this.migrator) {
      await this.initialize();
    }
    const { error } = await this.migrator!.migrateToLatest();
    if (error) {
      throw error;
    }
  }

  async migrateUp(migrationName: string): Promise<void> {
    if (!this.db || !this.migrator) {
      await this.initialize();
    }
    const name = migrationName.replace(/\.ts$/, '');
    const { error } = await this.migrator!.migrateTo(name);
    if (error) {
      throw error;
    }
  }

  async rollbackAll(): Promise<void> {
    if (!this.db || !this.migrator) {
      await this.initialize();
    }
    const { error } = await this.migrator!.migrateTo(NO_MIGRATIONS);
    if (error) {
      throw error;
    }
  }

  // TODO: Kysely doesn't support parametrized queries
  // Most of the queries passed to this method should be parametrized
  async query<T>(queryStr: string, _params?: unknown[]): Promise<T> {
    if (!this.db) {
      await this.initialize();
    }
    const result = await sql.raw(queryStr).execute(this.db!);
    // TODO: Ideally the Kysely Query Builder would be perfectly decoupled
    // from the database type
    const engine = getEngineFromDialect(this.dialect!);
    if (engine === EngineType.Mysql) {
      return [result.rows] as T;
    }
    if (engine === EngineType.Pg) {
      return { rows: result.rows } as T;
    }
    return result.rows as T;
  }

  close(): void {
    if (!this.db) {
      return;
    }
    this.db.destroy();
    this.db = null;
    this.dialect = null;
    this.migrator = null;
    this.migrationsDir = null;
  }
}
