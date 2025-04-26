const express = require('express');
const router = express.Router();
const controller = require("../controllers/hardwarecode.controller");

// Rutas CRUD
router.post("/", controller.createHardwareCode);
router.get("/", controller.getHardwareCodes);
router.put("/:id", controller.updateHardwareCode);
router.delete("/:id", controller.deleteHardwareCode);

module.exports = router;
