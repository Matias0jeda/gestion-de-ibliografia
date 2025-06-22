const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear materia
router.post('/', async (req, res) => {
  const { facultad, material_detalle, nombre_materia, turnos, creditos } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Materias (facultad, material_detalle, nombre_materia, turnos, creditos)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [facultad, material_detalle, nombre_materia, turnos, creditos]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las materias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materias');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una materia
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM materias WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una materia
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { facultad, material_detalle, nombre_materia, turnos, creditos } = req.body;
  try {
    const result = await pool.query(
      `UPDATE materias SET facultad = $1, material_detalle = $2, nombre_materia = $3,
       turnos = $4, creditos = $5 WHERE id = $6 RETURNING *`,
      [facultad, material_detalle, nombre_materia, turnos, creditos, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una materia
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM materias WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materia no encontrada' });
    res.json({ message: 'Materia eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
