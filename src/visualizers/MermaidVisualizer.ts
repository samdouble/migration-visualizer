import dedent from 'dedent';
import { Column, Table } from '../connectors/types';
import { IVisualizer } from './IVisualizer';

export class MermaidVisualizer implements IVisualizer {
  async visualize(tables: Table[], columns: Column[]): Promise<string> {
    console.log(tables, columns);
    return dedent`
      ---
      title: Order example
      ---
      erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
        CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
    `;
  }
}
