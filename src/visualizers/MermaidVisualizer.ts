import dedent from 'dedent';
import { Column, Table } from '../connectors/types';
import { IVisualizer } from './IVisualizer';

export class MermaidVisualizer implements IVisualizer {
  async visualize(_tables: Table[], _columns: Column[]): Promise<string> {
    return dedent`
      ---
      title: Database Schema
      ---
      erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
        CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
    `;
  }
}
