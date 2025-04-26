const express = require('express');
const router = express.Router();
const controller = require("../controllers/hardwarecode.controller");
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Rutas CRUD
router.post("/", verifyToken, isAdmin, controller.createHardwareCode);
router.get("/", verifyToken, isAdmin, controller.getHardwareCodes);
router.put("/:id", verifyToken, isAdmin, controller.updateHardwareCode);
router.delete("/:id", verifyToken, isAdmin, controller.deleteHardwareCode);

module.exports = router;
