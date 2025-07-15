const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear materia
router.post("/", async (req, res) => {
  const { facultad_id, material_detalle, nombre_materia, turnos, creditos, codigo } =
    req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insertar la materia (cabecera)
    const materiaResult = await client.query(
      `INSERT INTO Materias (facultad_id, codigo, nombre_materia, turnos, creditos)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [facultad_id, codigo, nombre_materia, turnos, creditos]
    );

    const materia = materiaResult.rows[0];

    // Insertar los detalles si se proporcionan
    if (
      material_detalle &&
      Array.isArray(material_detalle) &&
      material_detalle.length > 0
    ) {
      for (const bibliografia_id of material_detalle) {
        await client.query(
          `INSERT INTO materia_detalle (materia_id, bibliografia_id) VALUES ($1, $2)`,
          [materia.id, bibliografia_id]
        );
      }
    }

    await client.query("COMMIT");
    res.json(materia);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Obtener todas las materias
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM materias");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una materia
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener la materia con información de la facultad
    const materiaResult = await pool.query(
      `SELECT m.*, f.descripcion as facultad 
       FROM materias m
       LEFT JOIN facultad f ON m.facultad_id = f.id
       WHERE m.id = $1`,
      [id]
    );
    if (materiaResult.rows.length === 0)
      return res.status(404).json({ error: "Materia no encontrada" });

    const materia = materiaResult.rows[0];

    // Obtener los detalles con información de bibliografía
    const detalleResult = await pool.query(
      `
      SELECT md.id, md.bibliografia_id, b.recursos_principales, b.recursos_secundarios
      FROM materia_detalle md
      JOIN bibliografia b ON md.bibliografia_id = b.id
      WHERE md.materia_id = $1
    `,
      [id]
    );

    // Agregar los detalles a la materia
    materia.material_detalle = detalleResult.rows;

    res.json(materia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una materia
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { facultad_id, material_detalle, nombre_materia, turnos, creditos, codigo } =
    req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Actualizar la materia (cabecera)
    const materiaResult = await client.query(
      `UPDATE materias SET facultad_id = $1, codigo = $2, nombre_materia = $3,
       turnos = $4, creditos = $5 WHERE id = $6 RETURNING *`,
      [facultad_id, codigo, nombre_materia, turnos, creditos, id]
    );

    if (materiaResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Materia no encontrada" });
    }

    const materia = materiaResult.rows[0];

    // Si se proporcionan nuevos detalles, actualizar
    if (material_detalle && Array.isArray(material_detalle)) {
      // Eliminar detalles existentes
      await client.query("DELETE FROM materia_detalle WHERE materia_id = $1", [
        id,
      ]);

      // Insertar nuevos detalles
      for (const bibliografia_id of material_detalle) {
        await client.query(
          `INSERT INTO materia_detalle (materia_id, bibliografia_id) VALUES ($1, $2)`,
          [id, bibliografia_id]
        );
      }
    }

    await client.query("COMMIT");
    res.json(materia);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Eliminar una materia
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Eliminar primero los detalles
    await client.query("DELETE FROM materia_detalle WHERE materia_id = $1", [
      id,
    ]);

    // Eliminar la materia
    const result = await client.query(
      "DELETE FROM materias WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Materia no encontrada" });
    }

    await client.query("COMMIT");
    res.json({ message: "Materia eliminada" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
