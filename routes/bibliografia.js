const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear bibliografía
router.post('/', async (req, res) => {
  const { recursos_principales, recursos_secundarios } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bibliografia (recursos_principales, recursos_secundarios) VALUES ($1, $2) RETURNING *`,
      [recursos_principales, recursos_secundarios]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las bibliografías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bibliografia');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una bibliografía
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bibliografia WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Bibliografía no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una bibliografía
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { recursos_principales, recursos_secundarios } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bibliografia SET recursos_principales = $1, recursos_secundarios = $2 WHERE id = $3 RETURNING *`,
      [recursos_principales, recursos_secundarios, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Bibliografía no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una bibliografía
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM bibliografia WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Bibliografía no encontrada' });
    res.json({ message: 'Bibliografía eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;