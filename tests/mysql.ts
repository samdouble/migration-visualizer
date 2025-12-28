import { createDB } from 'mysql-memory-server';
import { MySQLDB } from 'mysql-memory-server/dist/types';
import sql from 'mysql2/promise';

let connection: sql.Connection;
let db: MySQLDB;

export const dbConnect = async () => {
  db = await createDB();
  connection = await sql.createConnection({
    host: '127.0.0.1',
    port: db.port,
    database: db.dbName,
    user: db.username,
    password: '',
  });
  return { connection, db };
};

export const dbDisconnect = async () => {
  if (connection) {
    await connection.end();
  }
  if (db) {
    await db.stop();
  }
};
