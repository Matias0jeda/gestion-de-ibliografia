const PORT = process.env.PORT || 3000;

// Usar DATABASE_URL directamente si está disponible
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:QokwCIGzvTjARxNJRcVpaCywTkilzPyL@switchyard.proxy.rlwy.net:50755/railway';

// Variables individuales como fallback
const DB_HOST = process.env.DB_HOST || 'switchyard.proxy.rlwy.net';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'QokwCIGzvTjARxNJRcVpaCywTkilzPyL';
const DB_NAME = process.env.DB_NAME || 'railway';
const DB_PORT = process.env.DB_PORT || '50755';

module.exports = {
  PORT,
  DATABASE_URL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
};