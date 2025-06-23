const { Pool } = require('pg');
const {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    DB_PORT,
} = require('./config.js');

const connectionString = `postgresql://${postgres}:${QokwCIGzvTjARxNJRcVpaCywTkilzPyL}@${switchyard.proxy.rlwy.net}:${50755}/${railway}`;

console.log('💾 Intentando conectar a la DB con:');
console.log('Host:', DB_HOST);
console.log('User:', DB_USER);
console.log('Database:', DB_NAME);
console.log('Port:', DB_PORT);
console.log('🔗 Connection string:', connectionString);

const pool = new Pool({
  connectionString: connectionString,
});

module.exports = pool;