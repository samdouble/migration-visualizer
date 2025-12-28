import { Column, Table } from '../connectors/types';

export interface IVisualizer {
  visualize: (tables: Table[], columns: Column[]) => Promise<string>;
}
