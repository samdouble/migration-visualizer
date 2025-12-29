import dedent from 'dedent';
import { Column, Table } from '../connectors/types';
import { IVisualizer } from './IVisualizer';

export class MermaidVisualizer implements IVisualizer {
  async visualize(tables: Table[], columns: Column[]): Promise<string> {
    const tableDefs = tables.map((table) => {
      const tableColumns = columns.filter((column) => column.table_name === table.name);
      return (
        dedent`${table.name} ||--o{ ORDER : places\n` +
        dedent`${table.name} {\n` +
        dedent`  ${tableColumns.map((column) => `    ${column.type} ${column.name}`).join('\n')}\n` +
        dedent`}\n`
      );
    });
    return dedent`
      ---
      title: Database Schema
      ---
      erDiagram
        ${tableDefs.join('\n')}
    `;
  }
}
