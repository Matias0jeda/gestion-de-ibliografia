const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear facultad
router.post('/', async (req, res) => {
  const { descripcion } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO facultad (descripcion) VALUES ($1) RETURNING *`,
      [descripcion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las facultades
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM facultad');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una facultad
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM facultad WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Facultad no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una facultad
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  try {
    const result = await pool.query(
      `UPDATE facultad SET descripcion = $1 WHERE id = $2 RETURNING *`,
      [descripcion, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Facultad no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una facultad
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM facultad WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Facultad no encontrada' });
    res.json({ message: 'Facultad eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;