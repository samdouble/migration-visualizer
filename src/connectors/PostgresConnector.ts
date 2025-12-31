import { IOrm } from '../orms/IOrm';
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
  async getColumns(orm: IOrm, tableName: string): Promise<Column[]> {
    const columns = await orm.query<{ rows: PostgresColumn[]}>(`
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
        c.table_name = '${tableName}'
        and c.table_schema = current_schema()
      order by c.ordinal_position
    `);

    const primaryKeys = await orm.query<{ rows: PostgresPrimaryKey[]}>(`
      select kcu.column_name
      from information_schema.table_constraints tc
      join information_schema.key_column_usage kcu
        on tc.constraint_name = kcu.constraint_name
        and tc.table_schema = kcu.table_schema
      where 
        tc.constraint_type = 'PRIMARY KEY'
        and tc.table_name = '${tableName}'
        and tc.table_schema = current_schema()
    `);

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

  async getDdl(orm: IOrm, tableName: string): Promise<Ddl | null> {
    const exists = await this.tableExists(orm, tableName);
    if (!exists) {
      return null;
    }
    const columns = await this.getColumns(orm, tableName);
    const columnDefs = columns.map(c =>
      `${c.name} ${c.type}${c.notnull ? ' not null' : ''}${c.pk ? ' primary key' : ''}`,
    ).join(',\n  ');
    return `create table ${tableName} (\n  ${columnDefs}\n);`;
  }

  async getForeignKeys(orm: IOrm, tableName: string): Promise<ForeignKey[]> {
    const result = await orm.query<{ rows: PostgresForeignKey[]}>(`
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
        and tc.table_name = '${tableName}'
        and tc.table_schema = current_schema()
    `);

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

  async getIndexes(orm: IOrm, tableName: string): Promise<Index[]> {
    const result = await orm.query<{ rows: PostgresIndex[]}>(`
      select
        indexname,
        tablename,
        indexdef
      from pg_indexes
      where 
        tablename = '${tableName}'
        and schemaname = current_schema()
    `);
    return result.rows.map((i) => {
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

  async getTables(orm: IOrm): Promise<Table[]> {
    const result = await orm.query<{ rows: PostgresTable[]}>(`
      select 
        table_name,
        table_schema,
        table_catalog
      from information_schema.tables
      where 
        table_type = 'BASE TABLE'
        and table_schema = current_schema()
        and table_name not like '${orm.getTablePrefix()}%'
    `);

    return result.rows.map((t: PostgresTable) => ({
      name: t.table_name,
      schema: t.table_schema,
      database: t.table_catalog,
    }));
  }

  async tableExists(orm: IOrm, tableName: string): Promise<boolean> {
    const result = await orm.query<{ rows: { cnt: number }[]}>(`
      select count(*) as cnt 
      from information_schema.tables
      where 
        table_name = '${tableName}'
        and table_schema = current_schema()
    `);
    return result.rows[0].cnt > 0;
  }
}

