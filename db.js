const { Pool } = require('pg');

console.log('🔗 DATABASE_URL disponible:', process.env.DATABASE_URL ? 'SÍ' : 'NO');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;