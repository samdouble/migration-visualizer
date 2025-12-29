import { MermaidVisualizer } from './visualizers/MermaidVisualizer';

export { IConnector } from './connectors/IConnector';
export { MysqlConnector } from './connectors/MysqlConnector';
export { SqliteConnector } from './connectors/SqliteConnector';
export { Column, Ddl, Table } from './connectors/types';
export { MermaidVisualizer } from './visualizers/MermaidVisualizer';

export const visualize = async (_output: string) => {
  const visualizer = new MermaidVisualizer();
  return visualizer.visualize([], []);
};
