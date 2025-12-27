import type { Knex } from 'knex';

export const getTables = async (db: Knex) => {
  return db.raw(`
    select name from sqlite_master 
    where
      type='table' 
      and name not like 'sqlite_%' 
      and name not like 'knex_%'
    order by name
  `);
};

export const getColumnsInfo = async (db: Knex, tableName: string) => {
  return db.raw(`pragma table_info(${tableName})`);
};

export const getDdl = async (db: Knex, tableName: string) => {
  return db.raw(`
    select sql from sqlite_master
    where
      type='table'
      and name=?
    `,
    [tableName],
  );
};
