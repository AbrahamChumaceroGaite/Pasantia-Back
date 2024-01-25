const express = require("express");
const router = express.Router();
const { queryDatabase } = require('../../services/db/query');
const { insertEnterprise, getDept, getRubr, getType, getEnterprisesLazyLoading, getEnterpriseById, getTotalRows, aprobeEnterprise, updateEnterprise, deleteEnterprise } = require('./query-admin');
const { validateEnterprise } = require('../../services/security/validators');

router.post("/post", async (req, res) => {
  try {
    const body = req.body;
    const validationErrors = validateEnterprise(body);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    const result = await insertEnterprise(body);
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensaje: "Error al registrar" });
  }
});

router.post("/toReview", async (req, res) => {
  try {
    const body = req.body;

    const promises = body.map(async (item) => {
      return await aprobeEnterprise(item.id);
    });

    const results = await Promise.all(promises);

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al registrar" });
  }
});


router.get("/get", async (req, res) => {
  const { first, rows, globalFilter, sortField, sortOrder, startDate, endDate } = req.query;
  const startIndex = parseInt(first);
  const numRows = parseInt(rows);
  try {
    const EnterpriseQuery = await getEnterprisesLazyLoading(startIndex, numRows, globalFilter, sortField, sortOrder, startDate, endDate);
    const Enterprises = await queryDatabase(EnterpriseQuery);

    const totalFilasQuery = await getTotalRows(globalFilter, startDate, endDate);
    const totalFilasResult = await queryDatabase(totalFilasQuery);
    const total = totalFilasResult[0].totalFilas;

    if (total.length === 0) {
      res.status(404).send({ mensaje: "Error al obtener datos" });
    } else {
      res.send({ filas: Enterprises, totalFilas: total });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensaje: "Error al obtener datos" });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getEnterpriseById(id);
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensaje: "Error al obtener el empresa por ID" });
  }
});

router.get("/getMisc", async (req, res) => {

  try {
    const dept = await getDept();
    const rubr = await getRubr();
    const type = await getType();
    res.json({ dept, rubr, type });
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensaje: "Error al obtener el empresa por ID" });
  }
});

router.put("/put/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  const validationErrors = validateEnterprise(updateData);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }
  try {
    await updateEnterprise(id, updateData);
    res.json({ mensaje: "Registro actualizado exitosamente" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensaje: "Error al actualizar el registro" });
  }
});

router.put("/aprobe/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    await aprobeEnterprise(id, updateData);
    res.json({ mensaje: "Registro actualizado exitosamente" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensaje: "Error al actualizar el registro" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteEnterprise(id);
    res.json({ mensaje: "Registro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el registro" });
  }
});


module.exports = router;
