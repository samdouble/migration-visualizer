import { Column, ForeignKey, Index, Table } from "../connectors/types";

export type Diff = {
  newTables: Table[];
  updatedTables: Table[];
  deletedTables: Table[];
  newColumns: Column[];
  updatedColumns: Column[];
  deletedColumns: Column[];
  newForeignKeys: ForeignKey[];
  deletedForeignKeys: ForeignKey[];
  updatedForeignKeys: ForeignKey[];
  newIndexes: Index[];
  updatedIndexes: Index[];
  deletedIndexes: Index[];
};
