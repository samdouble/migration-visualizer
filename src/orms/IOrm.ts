import { State } from "../connectors/types";
import { Migration } from "./types";

export interface IOrm {
  getMigrations: () => Promise<{ completed: Migration[], pending: Migration[] }>;
  getState: () => Promise<State>;
  getTablePrefix(): string;
  initialize: (providedConfig?: unknown) => Promise<void>;
  migrateLatest: () => Promise<void>;
  migrateUp: (file: string) => Promise<void>;
  query: <T>(query: string, params?: unknown[]) => Promise<T>;
  close: () => void;
}
