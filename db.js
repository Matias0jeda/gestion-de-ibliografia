const { Pool } = require('pg');
const {
    DATABASE_URL,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    DB_PORT,
} = require('./config.js');

// Priorizar DATABASE_URL si está disponible
const connectionString = DATABASE_URL || 
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

console.log('💾 Intentando conectar a la DB con:');
if (DATABASE_URL) {
    console.log('🔗 Usando DATABASE_URL:', connectionString);
} else {
    console.log('Host:', DB_HOST);
    console.log('User:', DB_USER);
    console.log('Database:', DB_NAME);
    console.log('Port:', DB_PORT);
    console.log('🔗 Connection string:', connectionString);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Necesario para conexiones externas a Railway
    }
});

// Probar la conexión
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✅ Conexión exitosa a la base de datos');
        release();
    }
});

module.exports = pool;