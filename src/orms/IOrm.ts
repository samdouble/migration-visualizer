import { State } from "../connectors/types";
import { Migration, OrmConfig } from "./types";

export interface IOrm {
  getMigrations: () => Promise<{ completed: Migration[], pending: Migration[] }>;
  getState: () => Promise<State>;
  getTablePrefix(): string;
  initialize: (providedConfig?: OrmConfig) => Promise<void>;
  migrateLatest: () => Promise<void>;
  migrateUp: (file: string) => Promise<void>;
  rollbackAll: () => Promise<void>;
  query: <T>(query: string, params?: unknown[]) => Promise<T>;
  close: () => void;
}
