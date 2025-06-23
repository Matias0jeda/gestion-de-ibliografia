const { Pool } = require('pg');
const {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    DB_PORT,
} = require('./config.js');

console.log('💾 Intentando conectar a la DB con:');
console.log('Host:', DB_HOST);
console.log('User:', DB_USER);
console.log('Database:', DB_NAME);
console.log('Port:', DB_PORT);

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

module.exports = pool;