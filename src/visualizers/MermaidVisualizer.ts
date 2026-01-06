import { Column, ForeignKey, Index, State, Table } from '../connectors/types';
import { dedent, indent } from '../utils/text';
import { IVisualizer } from './IVisualizer';

export class MermaidVisualizer implements IVisualizer {
  static renderColumn(column: Column, isForeignKey: boolean, isUniqueKey: boolean): string {
    const keys = [
      ...(column.pk ? ['PK'] : []),
      ...(isForeignKey ? ['FK'] : []),
      ...(isUniqueKey ? ['UK'] : []),
    ];
    return dedent(`${column.type.toLowerCase()} ${column.name} ${keys.join(',')} "${column.description ?? ''}"`);
  }

  static renderReferences(foreignKeys: ForeignKey[]): string {
    return foreignKeys.map((foreignKey) => {
      return `${foreignKey.from_table_name} ||--o{ ${foreignKey.to_table_name}: -`;
    }).join('\n');
  }

  static renderTable(table: Table, columns: Column[], foreignKeys: ForeignKey[], indexes: Index[]): string {
    return [
      MermaidVisualizer.renderReferences(foreignKeys),
      `${table.name} {`,
      indent(
        columns.map((column) => {
          const isForeignKey = foreignKeys.some((foreignKey) => foreignKey.from_column_name === column.name);
          const isUniqueKey = indexes.some((index) => index.unique && index.columns.includes(column.name));
          return MermaidVisualizer.renderColumn(column, isForeignKey, isUniqueKey);
        }).join('\n'),
        4,
      ),
      '}',
    ].join('\n');
  }

  async visualize(_beforeState: State, afterState: State): Promise<string> {
    const { tables, columns, foreignKeys, indexes } = afterState;
    const tableDefs = tables.map((table) => {
      const tableColumns = columns.filter((column) => column.table_name === table.name);
      const tableForeignKeys = foreignKeys.filter((foreignKey) => foreignKey.from_table_name === table.name);
      const tableIndexes = indexes.filter((index) => index.table_name === table.name);
      return MermaidVisualizer.renderTable(table, tableColumns, tableForeignKeys, tableIndexes);
    });

    return [
      '---',
      'title: Database Schema',
      '---',
      '%%{',
      indent('init: {', 4),
      indent('\'theme\': \'base\',', 8),
      indent('\'themeVariables\': {', 8),
      indent('\'primaryColor\': \'#00ff00\',', 12),
      indent('\'lineColor\': \'#0000ff\',', 12),
      indent('\'mainBkg\': \'#ffffff\'', 12),
      indent('}', 8),
      indent('}', 4),
      '}%%',
      '',
      'erDiagram',
      indent(tableDefs.join('\n'), 4),
    ].join('\n');
  }
}
