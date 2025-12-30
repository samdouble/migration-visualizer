import { Knex } from 'knex';
import { IConnector } from './IConnector';
import { Column, Ddl, ForeignKey, Index, Table } from './types';

export type PostgresTable = {
  table_name: string;
  table_schema: string;
  table_catalog: string;
};

export type PostgresColumn = {
  column_name: string;
  ordinal_position: number;
  column_default: string | null;
  is_nullable: string;
  data_type: string;
  udt_name: string;
  table_name: string;
};

export type PostgresForeignKey = {
  constraint_name: string;
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  delete_rule: string;
  update_rule: string;
};

export type PostgresIndex = {
  indexname: string;
  tablename: string;
  indexdef: string;
};

export type PostgresPrimaryKey = {
  column_name: string;
};

export class PostgresConnector implements IConnector {
  async getColumns(db: Knex, tableName: string): Promise<Column[]> {
    const columns = await db.raw(`
      select
        c.column_name,
        c.ordinal_position,
        c.column_default,
        c.is_nullable,
        c.data_type,
        c.udt_name,
        c.table_name
      from information_schema.columns c
      where 
        c.table_name = ?
        and c.table_schema = current_schema()
      order by c.ordinal_position
    `, [tableName]);

    const primaryKeys = await db.raw(`
      select kcu.column_name
      from information_schema.table_constraints tc
      join information_schema.key_column_usage kcu
        on tc.constraint_name = kcu.constraint_name
        and tc.table_schema = kcu.table_schema
      where 
        tc.constraint_type = 'PRIMARY KEY'
        and tc.table_name = ?
        and tc.table_schema = current_schema()
    `, [tableName]);

    const pkColumns = new Set(primaryKeys.rows.map((pk: PostgresPrimaryKey) => pk.column_name));

    return columns.rows.map((c: PostgresColumn) => ({
      cid: c.ordinal_position,
      name: c.column_name,
      description: undefined,
      type: c.udt_name,
      notnull: c.is_nullable === 'NO',
      dflt_value: c.column_default,
      pk: pkColumns.has(c.column_name),
      table_name: c.table_name,
    }));
  }

  async getDdl(db: Knex, tableName: string): Promise<Ddl | null> {
    const exists = await this.tableExists(db, tableName);
    if (!exists) {
      return null;
    }
    const columns = await this.getColumns(db, tableName);
    const columnDefs = columns.map(c =>
      `${c.name} ${c.type}${c.notnull ? ' not null' : ''}${c.pk ? ' primary key' : ''}`,
    ).join(',\n  ');
    return `create table ${tableName} (\n  ${columnDefs}\n);`;
  }

  async getForeignKeys(db: Knex, tableName: string): Promise<ForeignKey[]> {
    const result = await db.raw(`
      select
        tc.constraint_name,
        kcu.table_name,
        kcu.column_name,
        ccu.table_name as foreign_table_name,
        ccu.column_name as foreign_column_name,
        rc.delete_rule,
        rc.update_rule
      from information_schema.table_constraints tc
      join information_schema.key_column_usage kcu
        on tc.constraint_name = kcu.constraint_name
        and tc.table_schema = kcu.table_schema
      join information_schema.constraint_column_usage ccu
        on ccu.constraint_name = tc.constraint_name
        and ccu.table_schema = tc.table_schema
      join information_schema.referential_constraints rc
        on rc.constraint_name = tc.constraint_name
        and rc.constraint_schema = tc.table_schema
      where 
        tc.constraint_type = 'FOREIGN KEY'
        and tc.table_name = ?
        and tc.table_schema = current_schema()
    `, [tableName]);

    return result.rows.map((fk: PostgresForeignKey, index: number) => ({
      id: index,
      from_table_name: fk.table_name,
      from_column_name: fk.column_name,
      to_table_name: fk.foreign_table_name,
      to_column_name: fk.foreign_column_name,
      on_delete: fk.delete_rule,
      on_update: fk.update_rule,
    }));
  }

  async getIndexes(db: Knex, tableName: string): Promise<Index[]> {
    const result = await db.raw(`
      select
        indexname,
        tablename,
        indexdef
      from pg_indexes
      where 
        tablename = ?
        and schemaname = current_schema()
    `, [tableName]);

    return result.rows.map((i: PostgresIndex) => {
      const columnsMatch = i.indexdef.match(/\(([^)]+)\)/);
      const columns = columnsMatch
        ? columnsMatch[1].split(',').map(c => c.trim().replace(/"/g, ''))
        : [];
      const isUnique = i.indexdef.toLowerCase().includes('create unique index');

      return {
        name: i.indexname,
        columns,
        unique: isUnique,
        table_name: i.tablename,
      };
    });
  }

  async getTables(db: Knex): Promise<Table[]> {
    const result = await db.raw(`
      select 
        table_name,
        table_schema,
        table_catalog
      from information_schema.tables
      where 
        table_type = 'BASE TABLE'
        and table_schema = current_schema()
        and table_name not like 'knex_%'
    `);

    return result.rows.map((t: PostgresTable) => ({
      name: t.table_name,
      schema: t.table_schema,
      database: t.table_catalog,
    }));
  }

  async tableExists(db: Knex, tableName: string): Promise<boolean> {
    const result = await db.raw(`
      select COUNT(*) as cnt 
      from information_schema.tables
      where 
        table_name = ?
        and table_schema = current_schema()
    `, [tableName]);
    return parseInt(result.rows[0].cnt, 10) > 0;
  }
}

