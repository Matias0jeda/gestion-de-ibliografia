const express = require('express');
const bodyParser = require('body-parser');
const materiasRouter = require('./routes/materias');
import {PORT} from './config.js'
const app = express();
const PORT = 3000;

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
