const express = require('express');
const router = express.Router();
const { queryDatabase } = require('../../services/db/query');
const { createUser, getUsersLazyLoading, getTotalUsers, getUserById, updateUser, deleteUser } = require('./query');

router.post("/post", async (req, res) => {
  const { name, password, email, rol, parish } = req.body;
  try {
    await createUser({ name, password, email, rol, parish });
    res.json({ mensaje: 'Registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

router.get("/get", async (req, res) => {
 
  const { first, rows, globalFilter, sortField, sortOrder } = req.query;
  const startIndex = parseInt(first);
  const numRows = parseInt(rows);

  try {
    const certificateQuery = await getUsersLazyLoading(startIndex, numRows, globalFilter, sortField, sortOrder);
    const certificates = await queryDatabase(certificateQuery);

    const totalFilasQuery = await getTotalUsers(globalFilter);
    const totalFilasResult = await queryDatabase(totalFilasQuery);
    const total = totalFilasResult[0].totalFilas;

    if (total.length === 0) {
      res.status(404).send({ mensaje: "Error al obtener datos" });
    } else {
      res.send({ filas: certificates, totalFilas: total });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensaje: "Error al obtener datos" });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await getUserById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario por ID' });
  }
});

router.put("/put/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    await updateUser(id, updateData);
    res.json({ mensaje: 'Registro actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el registro' });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await deleteUser(id);
    res.json({ mensaje: 'Registro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el registro' });
  }
});

module.exports = router;