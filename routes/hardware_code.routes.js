const express = require('express');
const router = express.Router();
const hardwareCodeController = require('../controllers/hardware_code.controller');
const { verifyToken } = require('../middlewares/authJwt'); // Protegemos con token si quieres

// Crear hardware code
router.post('/', verifyToken, hardwareCodeController.createNewHardwareCode);

// Listar hardware codes
router.get('/', verifyToken, hardwareCodeController.listHardwareCodes);

// Actualizar descripción de hardware code
router.put('/:id', verifyToken, hardwareCodeController.updateHardwareCode);

// Eliminar hardware code
router.delete('/:id', verifyToken, hardwareCodeController.deleteHardwareCodeById);

module.exports = router;
