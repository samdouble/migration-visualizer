import dedent from 'dedent';
import { Column, ForeignKey, Index, State, Table } from '../connectors/types';
import { IVisualizer } from './IVisualizer';

const indent = (text: string, nbSpaces: number): string => {
  const padding = ' '.repeat(nbSpaces);
  return text.split('\n').map(line => padding + line).join('\n');
};

export class MermaidVisualizer implements IVisualizer {
  static renderColumn(column: Column, isForeignKey: boolean, isUniqueKey: boolean): string {
    const keys = [
      ...(column.pk ? ['PK'] : []),
      ...(isForeignKey ? ['FK'] : []),
      ...(isUniqueKey ? ['UK'] : []),
    ];
    return `${column.type.toLowerCase()} ${column.name} ${keys.join(',')} "${column.description ?? ''}"`;
  }

  static renderReferences(foreignKeys: ForeignKey[]): string {
    return foreignKeys.map((foreignKey) => {
      return (
        `
        ${foreignKey.from_table_name} ||--o{ ${foreignKey.to_table_name}: -
        `
      );
    }).join('\n');
  }

  static renderTable(table: Table, columns: Column[], foreignKeys: ForeignKey[], indexes: Index[]): string {
    return dedent(
    `
    ${MermaidVisualizer.renderReferences(foreignKeys)}
    ${table.name} {
    ${indent(columns.map((column) => {
      const isForeignKey = foreignKeys.some((foreignKey) => foreignKey.from_column_name === column.name);
      const isUniqueKey = indexes.some((index) => index.unique && index.columns.includes(column.name));
      return MermaidVisualizer.renderColumn(column, isForeignKey, isUniqueKey);
    }).join('\n'), 8)}
    }
    `,
    );
  }

  async visualize(_beforeState: State, afterState: State): Promise<string> {
    const { tables, columns, foreignKeys, indexes } = afterState;
    const tableDefs = tables.map((table) => {
      const tableColumns = columns.filter((column) => column.table_name === table.name);
      const tableForeignKeys = foreignKeys.filter((foreignKey) => foreignKey.from_table_name === table.name);
      const tableIndexes = indexes.filter((index) => index.table_name === table.name);
      return MermaidVisualizer.renderTable(table, tableColumns, tableForeignKeys, tableIndexes);
    });

    return dedent(
    `
    ---
    title: Database Schema
    ---
    %%{init: { 'theme': 'base', 'themeVariables': { 
      'primaryColor': '#00ff00', 
      'lineColor': '#0000ff',
      'mainBkg': '#ffffff'
    } } }%%
    erDiagram
    ${indent(tableDefs.join('\n'), 4)}
    `,
    );
  }
}
