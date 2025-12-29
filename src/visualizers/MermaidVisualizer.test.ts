import { Column, ForeignKey, Table } from '../connectors/types';
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
    { cid: 3, name: 'password_hash', type: 'VARCHAR(255)', notnull: true, dflt_value: '', pk: false, table_name: 'users', description: 'This cannot be the actual password' },
    { cid: 0, name: 'id', type: 'INTEGER', notnull: true, dflt_value: '', pk: true, table_name: 'posts' },
    { cid: 1, name: 'title', type: 'VARCHAR(255)', notnull: true, dflt_value: '', pk: false, table_name: 'posts' },
    { cid: 2, name: 'content', type: 'TEXT', notnull: true, dflt_value: '', pk: false, table_name: 'posts' },
    { cid: 0, name: 'id', type: 'INTEGER', notnull: true, dflt_value: '', pk: true, table_name: 'comments' },
    { cid: 1, name: 'text', type: 'TEXT', notnull: true, dflt_value: '', pk: false, table_name: 'comments' },
    { cid: 2, name: 'post_id', type: 'INTEGER', notnull: true, dflt_value: '', pk: false, table_name: 'comments' },
    { cid: 3, name: 'user_id', type: 'INTEGER', notnull: true, dflt_value: '', pk: false, table_name: 'comments' },
  ];

  const foreignKeys: ForeignKey[] = [
    { id: 1, from_table_name: 'comments', from_column_name: 'post_id', to_table_name: 'posts', to_column_name: 'id', on_delete: 'CASCADE', on_update: 'CASCADE' },
    { id: 2, from_table_name: 'comments', from_column_name: 'user_id', to_table_name: 'users', to_column_name: 'id', on_delete: 'CASCADE', on_update: 'CASCADE' },
  ];

  it('should generate mermaid diagram', async () => {
    const result = await visualizer.visualize(tables, columns, foreignKeys);

    expect(result).toMatchSnapshot();
  });
});
