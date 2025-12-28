import knex from 'knex';
import config from '../knexfile';
import { SqliteConnector } from './SqliteConnector';

async function printSchema() {
  const db = knex(config);

  try {
    const connector = new SqliteConnector(db);
    const tables = await connector.getTables();

    console.log('=== Tables in database ===');
    console.log(tables.map((t: { name: string }) => t.name).join(', '));
    console.log('');

    console.log('=== Column details per table ===');
    for (const { name: tableName } of tables) {
      console.log(`--- ${tableName} ---`);
      
      const columns = await connector.getColumns(tableName);
      
      console.log(
        'cid'.padEnd(4) +
        'name'.padEnd(20) +
        'type'.padEnd(15) +
        'notnull'.padEnd(8) +
        'dflt_value'.padEnd(15) +
        'pk'
      );
      console.log('-'.repeat(70));
      
      for (const col of columns) {
        console.log(
          String(col.cid).padEnd(4) +
          col.name.padEnd(20) +
          (col.type || '').padEnd(15) +
          String(col.notnull).padEnd(8) +
          String(col.dflt_value ?? '').padEnd(15) +
          col.pk
        );
      }
    }

    console.log('=== Full table schemas ===');
    for (const { name: tableName } of tables) {
      const schema = await connector.getDdl(tableName);
      console.log(`--- ${tableName} ---`);
      console.log(schema[0]?.sql || 'No schema found');
      console.log('');
    }
  } finally {
    await db.destroy();
  }
}

printSchema().catch((err) => {
  console.error('Error printing schema:', err);
  process.exit(1);
});
