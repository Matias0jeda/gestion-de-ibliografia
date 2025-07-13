const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear autor
router.post('/', async (req, res) => {
  const { nombre, apellido, fecha_nacimiento, nacionalidad, biografia } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO autores (nombre, apellido, fecha_nacimiento, nacionalidad, biografia)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, apellido, fecha_nacimiento, nacionalidad, biografia]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los autores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM autores');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un autor
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM autores WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un autor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, fecha_nacimiento, nacionalidad, biografia } = req.body;
  try {
    const result = await pool.query(
      `UPDATE autores SET nombre = $1, apellido = $2, fecha_nacimiento = $3,
       nacionalidad = $4, biografia = $5 WHERE id = $6 RETURNING *`,
      [nombre, apellido, fecha_nacimiento, nacionalidad, biografia, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un autor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM autores WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Autor no encontrado' });
    res.json({ message: 'Autor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
