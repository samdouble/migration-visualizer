import { Knex } from 'knex';
import { IConnector } from './IConnector';
import { Column, Ddl, SqliteColumn, SqliteTable, Table } from './types';

export class SqliteConnector implements IConnector {
  async getColumns(db: Knex, tableName: string): Promise<Column[]> {
    const result = await db.raw(`pragma table_info(${tableName})`);
    return result.map((c: SqliteColumn) => ({
      ...c,
      table_name: tableName,
    }));
  }

  async getDdl(db: Knex, tableName: string): Promise<Ddl | null> {
    const result = await db.raw(`
      select sql from sqlite_master
      where
        type='table'
        and name=?
      `,
      [tableName],
    );
    return result.length > 0 ? result[0].sql : null;
  }

  async getTables(db: Knex): Promise<Table[]> {
    const result = await db.raw(`
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
