import { Column, ForeignKey, Table } from '../connectors/types';

export interface IVisualizer {
  visualize: (tables: Table[], columns: Column[], foreignKeys: ForeignKey[]) => Promise<string>;
}
