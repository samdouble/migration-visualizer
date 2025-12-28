import { Knex } from "knex";
import { IConnector } from "./IConnector";
import { Column, Ddl, Table } from "./types";

export class SqliteConnector implements IConnector {
  constructor(private readonly db: Knex) {
    this.db = db;
  }

  async getColumns(tableName: string): Promise<Column[]> {
    return this.db.raw(`pragma table_info(${tableName})`);
  }

  async getDdl(tableName: string): Promise<Ddl[]> {
    return this.db.raw(`
      select sql from sqlite_master
      where
        type='table'
        and name=?
      `,
      [tableName],
    );
  }

  async getTables(): Promise<Table[]> {
    return this.db.raw(`
      select name from sqlite_master 
      where
        type='table' 
        and name not like 'sqlite_%' 
        and name not like 'knex_%'
      order by name
    `);
  }
}
