const express = require('express');
const cors = require('cors');
const materiasRouter = require('./routes/materias');
const facultadRouter = require('./routes/facultad');
const bibliografiaRouter = require("./routes/bibliografia");
const autoresRouter = require('./routes/autores');
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

// Middleware de logging para debug
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.json({
      message: "API de Gestión de Bibliografía",
      status: "OK",
      timestamp: new Date().toISOString(),
      endpoints: {
        materias: "/materias (GET, POST)",
        materia_by_id: "/materias/:id (GET, PUT, DELETE)",
        facultades: "/facultad (GET, POST)",
        facultad_by_id: "/facultad/:id (GET, PUT, DELETE)",
        bibliografias: "/bibliografia (GET, POST)",
        bibliografia_by_id: "/bibliografia/:id (GET, PUT, DELETE)",
        autores: "/autores (GET, POST)",
        autor_by_id: "/autores/:id (GET, PUT, DELETE)",
      },
    });
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Ruta para probar la base de datos
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            message: 'Base de datos conectada correctamente',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('❌ Error de DB:', error);
        res.status(500).json({ 
            error: 'Error de base de datos',
            message: error.message
        });
    }
});

// Rutas de la API
app.use('/materias', materiasRouter);
app.use('/Materias', materiasRouter); // Compatibilidad con mayúscula
app.use('/facultad', facultadRouter);
app.use('/Facultad', facultadRouter); // Compatibilidad con mayúscula
app.use('/bibliografia', bibliografiaRouter);
app.use("/Bibliografia", bibliografiaRouter); // Compatibilidad con mayúscula
app.use('/autores', autoresRouter);
app.use('/Autores', autoresRouter); // Compatibilidad con mayúscula

// Probar conexión a DB al iniciar
pool.query("SELECT * FROM materias LIMIT 5", (err, res) => {
  if (err) {
    console.error("❌ Error al consultar la tabla materias:", err.message);
  } else {
    console.log(
      "✅ Conexión a DB exitosa. Materias encontradas:",
      res.rows.length
    );
  }
});

// Verificar conexión con las nuevas tablas
pool.query("SELECT * FROM facultad LIMIT 5", (err, res) => {
  if (err) {
    console.error("❌ Error al consultar la tabla facultad:", err.message);
  } else {
    console.log(
      "✅ Tabla facultad accesible. Facultades encontradas:",
      res.rows.length
    );
  }
});

pool.query("SELECT * FROM bibliografia LIMIT 5", (err, res) => {
  if (err) {
    console.error("❌ Error al consultar la tabla bibliografia:", err.message);
  } else {
    console.log(
      "✅ Tabla bibliografia accesible. Bibliografías encontradas:",
      res.rows.length
    );
  }
});

pool.query("SELECT * FROM autores LIMIT 5", (err, res) => {
  if (err) {
    console.error("❌ Error al consultar la tabla autores:", err.message);
  } else {
    console.log(
      "✅ Tabla autores accesible. Autores encontrados:",
      res.rows.length
    );
  }
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    console.log('❌ Ruta no encontrada:', req.method, req.originalUrl);
    res.status(404).json({
      error: "Ruta no encontrada",
      path: req.originalUrl,
      method: req.method,
      availableRoutes: [
        "GET /",
        "GET /health",
        "GET /test-db",
        "GET /materias",
        "POST /materias",
        "GET /materias/:id",
        "PUT /materias/:id",
        "DELETE /materias/:id",
        "GET /facultad",
        "POST /facultad",
        "GET /facultad/:id",
        "PUT /facultad/:id",
        "DELETE /facultad/:id",
        "GET /bibliografia",
        "POST /bibliografia",
        "GET /bibliografia/:id",
        "PUT /bibliografia/:id",
        "DELETE /bibliografia/:id",
        "GET /autores",
        "POST /autores",
        "GET /autores/:id",
        "PUT /autores/:id",
        "DELETE /autores/:id",
      ],
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('💥 Error del servidor:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    console.log(`🌐 URL local: http://localhost:${PORT}`);
});

module.exports = app;