const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear bibliografía
router.post('/', async (req, res) => {
  const { autores_id, recursos_principales, recursos_secundarios } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bibliografia (autores_id, recursos_principales, recursos_secundarios) VALUES ($1, $2, $3) RETURNING *`,
      [autores_id, recursos_principales, recursos_secundarios]
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
    const result = await pool.query(`
      SELECT 
        b.id,
        b.recursos_principales,
        b.recursos_secundarios,
        a.id as autor_id,
        a.nombre as autor_nombre,
        a.apellido as autor_apellido,
        a.nacionalidad as autor_nacionalidad
      FROM bibliografia b
      LEFT JOIN autores a ON b.autores_id = a.id
      WHERE b.id = $1
    `, [id]);
    
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Bibliografía no encontrada' });
    
    const row = result.rows[0];
    
    // Formatear la respuesta según el formato solicitado
    const response = {
      id: row.id,
      recursos_principales: row.recursos_principales,
      recursos_secundarios: row.recursos_secundarios,
      autor: row.autor_id ? {
        id: row.autor_id,
        nombre: row.autor_nombre,
        apellido: row.autor_apellido,
        nacionalidad: row.autor_nacionalidad
      } : null
    };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una bibliografía
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { autores_id, recursos_principales, recursos_secundarios } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bibliografia SET autores_id = $1, recursos_principales = $2, recursos_secundarios = $3 WHERE id = $4 RETURNING *`,
      [autores_id, recursos_principales, recursos_secundarios, id]
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