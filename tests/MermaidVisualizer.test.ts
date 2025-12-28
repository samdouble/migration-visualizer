import { Column, Table } from '../src/connectors/types';
import { MermaidVisualizer } from '../src/visualizers/MermaidVisualizer';

describe('MermaidVisualizer', () => {
  const visualizer = new MermaidVisualizer();

  const tables: Table[] = [
    { name: 'users', schema: 'public', database: 'test' },
    { name: 'posts', schema: 'public', database: 'test' },
    { name: 'comments', schema: 'public', database: 'test' },
  ];

  const columns: Column[] = [
    { cid: 0, name: 'id', type: 'INTEGER', notnull: true, dflt_value: '', pk: true },
    { cid: 1, name: 'email', type: 'VARCHAR(255)', notnull: true, dflt_value: '', pk: false },
    { cid: 2, name: 'username', type: 'VARCHAR(100)', notnull: true, dflt_value: '', pk: false },
  ];

  it('should generate mermaid diagram', async () => {
    const result = await visualizer.visualize(tables, columns);

    expect(result).toMatchSnapshot();
  });
});
