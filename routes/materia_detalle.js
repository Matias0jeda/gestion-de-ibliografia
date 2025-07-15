const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear materia detalle
router.post('/', async (req, res) => {
  const { materia_id, bibliografia_id, material } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO materia_detalle (materia_id, bibliografia_id, material) VALUES ($1, $2, $3) RETURNING *`,
      [materia_id, bibliografia_id, material]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las materias detalle
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materia_detalle');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una materia detalle
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM materia_detalle WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materia detalle no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una materia detalle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { materia_id, bibliografia_id, material } = req.body;
  try {
    const result = await pool.query(
      `UPDATE materia_detalle SET materia_id = $1, bibliografia_id = $2, material = $3 WHERE id = $4 RETURNING *`,
      [materia_id, bibliografia_id, material, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Materia detalle no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una materia detalle
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM materia_detalle WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materia detalle no encontrada' });
    res.json({ message: 'Materia detalle eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;