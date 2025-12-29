import { Column, Table } from '../connectors/types';
import { MermaidVisualizer } from '../visualizers/MermaidVisualizer';

describe('MermaidVisualizer', () => {
  const visualizer = new MermaidVisualizer();

  const tables: Table[] = [
    { name: 'users', schema: 'public', database: 'test' },
    { name: 'posts', schema: 'public', database: 'test' },
    { name: 'comments', schema: 'public', database: 'test' },
  ];

  const columns: Column[] = [
    { cid: 0, name: 'id', type: 'INTEGER', notnull: true, dflt_value: '', pk: true, table_name: 'users' },
    { cid: 1, name: 'email', type: 'VARCHAR(255)', notnull: true, dflt_value: '', pk: false, table_name: 'users' },
    { cid: 2, name: 'username', type: 'VARCHAR(100)', notnull: true, dflt_value: '', pk: false, table_name: 'users' },
    { cid: 0, name: 'id', type: 'INTEGER', notnull: true, dflt_value: '', pk: true, table_name: 'posts' },
    { cid: 1, name: 'title', type: 'VARCHAR(255)', notnull: true, dflt_value: '', pk: false, table_name: 'posts' },
    { cid: 2, name: 'content', type: 'TEXT', notnull: true, dflt_value: '', pk: false, table_name: 'posts' },
    { cid: 0, name: 'id', type: 'INTEGER', notnull: true, dflt_value: '', pk: true, table_name: 'comments' },
    { cid: 1, name: 'text', type: 'TEXT', notnull: true, dflt_value: '', pk: false, table_name: 'comments' },
    { cid: 2, name: 'post_id', type: 'INTEGER', notnull: true, dflt_value: '', pk: false, table_name: 'comments' },
    { cid: 3, name: 'user_id', type: 'INTEGER', notnull: true, dflt_value: '', pk: false, table_name: 'comments' },
  ];

  it('should generate mermaid diagram', async () => {
    const result = await visualizer.visualize(tables, columns);

    expect(result).toMatchSnapshot();
  });
});
