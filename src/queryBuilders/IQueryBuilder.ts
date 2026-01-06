import { State } from "../connectors/types";
import { Migration, QueryBuilderConfig } from "./types";

export interface IQueryBuilder {
  getMigrations: () => Promise<{ completed: Migration[], pending: Migration[] }>;
  getState: () => Promise<State>;
  getTablePrefix(): string;
  initialize: (providedConfig?: QueryBuilderConfig) => Promise<void>;
  migrateLatest: () => Promise<void>;
  migrateUp: (file: string) => Promise<void>;
  rollbackAll: () => Promise<void>;
  query: <T>(query: string, params?: unknown[]) => Promise<T>;
  close: () => void;
}
