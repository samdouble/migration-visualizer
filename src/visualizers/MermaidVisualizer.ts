import dedent from 'dedent';
import { Column, ForeignKey, Table } from '../connectors/types';
import { IVisualizer } from './IVisualizer';

const indent = (text: string, nbSpaces: number): string => {
  const padding = ' '.repeat(nbSpaces);
  return text.split('\n').map(line => padding + line).join('\n');
};

export class MermaidVisualizer implements IVisualizer {
  static renderColumn(column: Column, isForeignKey: boolean): string {
    const keys = [
      ...(column.pk ? ['PK'] : []),
      ...(isForeignKey ? ['FK'] : []),
    ];
    return `${column.type.toLowerCase()} ${column.name} ${keys.join(',')} "${column.description ?? ''}"`;
  }

  static renderReferences(foreignKeys: ForeignKey[]): string {
    return foreignKeys.map((foreignKey) => {
      return `${foreignKey.from_table_name} ||--o{ ${foreignKey.to_table_name}: uses`;
    }).join('\n');
  }

  static renderTable(table: Table, columns: Column[], foreignKeys: ForeignKey[]): string {
    return dedent(
    `
    ${MermaidVisualizer.renderReferences(foreignKeys)}
    ${table.name} {
    ${indent(columns.map((column) => {
      const isForeignKey = foreignKeys.some((foreignKey) => foreignKey.from_column_name === column.name);
      return MermaidVisualizer.renderColumn(column, isForeignKey);
    }).join('\n'), 8)}
    }
    `,
    );
  }

  async visualize(tables: Table[], columns: Column[], foreignKeys: ForeignKey[]): Promise<string> {
    const tableDefs = tables.map((table) => {
      const tableColumns = columns.filter((column) => column.table_name === table.name);
      const tableForeignKeys = foreignKeys.filter((foreignKey) => foreignKey.from_table_name === table.name);
      return MermaidVisualizer.renderTable(table, tableColumns, tableForeignKeys);
    });

    return dedent(
    `
    ---
    title: Database Schema
    ---
    erDiagram
    ${indent(tableDefs.join('\n'), 4)}
    `,
    );
  }
}
