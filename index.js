const express = require('express');
const bodyParser = require('body-parser');
const materiasRouter = require('./routes/materias');
const { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('./config.js');
console.log('🔍 Variables de entorno:');
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

console.log('🔧 Valores finales de config:');
console.log('HOST:', DB_HOST);
console.log('USER:', DB_USER);
console.log('NAME:', DB_NAME);
console.log('PORT_DB:', DB_PORT);
const app = express();
const pool = require('./db');


pool.query('SELECT * FROM materias', (err, res) => {
  if (err) {
    console.error('❌ Error al consultar la tabla materias:', err.message);
  } else {
    console.log('✅ Datos encontrados:', res.rows);
  }
});

app.use(bodyParser.json());
app.use('/Materias', materiasRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
});