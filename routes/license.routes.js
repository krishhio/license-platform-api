const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/license.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Crear licencia
router.post('/', verifyToken, licenseController.createNewLicense);

// Listar todas las licencias
router.get('/', verifyToken, licenseController.listLicenses);

// Buscar licencia por ID
router.get('/:id', verifyToken, licenseController.getLicense);

// Buscar licencias por filtros (license_key, type, status)
router.get('/search', verifyToken, licenseController.searchLicensesController);

module.exports = router;


