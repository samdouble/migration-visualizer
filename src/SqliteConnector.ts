import { Knex } from "knex";
import { IConnector } from "./IConnector";
import { Column, Ddl, SqliteTable, Table } from "./types";

export class SqliteConnector implements IConnector {
  constructor(private readonly db: Knex) {
    this.db = db;
  }

  async getColumns(tableName: string): Promise<Column[]> {
    return this.db.raw(`pragma table_info(${tableName})`);
  }

  async getDdl(tableName: string): Promise<Ddl | null> {
    const result = await this.db.raw(`
      select sql from sqlite_master
      where
        type='table'
        and name=?
      `,
      [tableName],
    );
    return result.length > 0 ? result[0].sql : null;
  }

  async getTables(): Promise<Table[]> {
    const result = await this.db.raw(`
      select name from sqlite_master 
      where
        type='table' 
        and name not like 'sqlite_%' 
        and name not like 'knex_%'
    `);
    return result.map((t: SqliteTable) => ({
      name: t.name,
      schema: t.schema,
      database: t.database,
    }));
  }
}
