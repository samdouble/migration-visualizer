import isEqual from 'lodash.isequal';
import { State } from '../connectors/types';
import { IVisualizer } from './IVisualizer';

export class JsonVisualizer implements IVisualizer {
  async visualize(beforeState: State, afterState: State): Promise<string> {
    const { tables: beforeTables } = beforeState;
    const { tables: afterTables } = afterState;

    return JSON.stringify({
      newTables: afterTables.filter((table) => !beforeTables.some((t) => t.name === table.name)),
      updatedTables: afterTables.filter((table) => {
        beforeTables.some((t) => t.name === table.name && !isEqual(t, table));
      }),
      deletedTables: beforeTables.filter((table) => !afterTables.some((t) => t.name === table.name)),
      // newColumns: afterColumns.filter((column) => !beforeColumns.some((c) => c.name === column.name)),
      // updatedColumns: afterColumns.filter((column) => beforeColumns.some((c) => c.name === column.name)),
      // deletedColumns: beforeColumns.filter((column) => !afterColumns.some((c) => c.name === column.name)),
      // newForeignKeys: afterForeignKeys
      //   .filter((foreignKey) => !beforeForeignKeys.some((fk) => fk.name === foreignKey.name)),
      // deletedForeignKeys: beforeForeignKeys
      //   .filter((foreignKey) => !afterForeignKeys.some((fk) => fk.name === foreignKey.name)),
      // updatedForeignKeys: afterForeignKeys
      //   .filter((foreignKey) => beforeForeignKeys.some((fk) => fk.name === foreignKey.name)),
      // newIndexes: afterIndexes.filter((index) => !beforeIndexes.some((i) => i.name === index.name)),
      // updatedIndexes: afterIndexes.filter((index) => beforeIndexes.some((i) => i.name === index.name)),
      // deletedIndexes: beforeIndexes.filter((index) => !afterIndexes.some((i) => i.name === index.name)),
    });
  }
}
