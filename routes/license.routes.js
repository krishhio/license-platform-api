const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/license.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Obtener todas las licencias (requiere token)
router.get('/', verifyToken, licenseController.getLicenses);

// Obtener una licencia por ID (requiere token)
router.get('/:id', verifyToken, licenseController.getLicense);

// Buscar licencia por license_key o hardware_code (requiere token)
router.get('/search/license', verifyToken, licenseController.searchLicense);

// Crear nueva licencia (requiere token y rol admin)
router.post('/', verifyToken, isAdmin, licenseController.createNewLicense);

// Actualizar licencia (requiere token y rol admin)
router.put('/:id', verifyToken, isAdmin, licenseController.updateExistingLicense);

// Eliminar licencia (requiere token y rol admin)
router.delete('/:id', verifyToken, isAdmin, licenseController.deleteExistingLicense);

module.exports = router;
