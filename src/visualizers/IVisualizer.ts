import { Column, ForeignKey, Index, Table } from '../connectors/types';

export interface IVisualizer {
  visualize: (tables: Table[], columns: Column[], foreignKeys: ForeignKey[], indexes: Index[]) => Promise<string>;
}
