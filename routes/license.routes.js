const express = require('express');
const router = express.Router();
const {
  getLicenses,
  searchLicenses,
  createNewLicense
} = require('../controllers/license.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Obtener todas las licencias (admin)
router.get('/', verifyToken, isAdmin, getLicenses);

// Buscar por license_key o hardware_code
router.get('/search', verifyToken, searchLicenses);

// Crear nueva licencia (solo admin)
router.post('/', verifyToken, isAdmin, createNewLicense);

module.exports = router;
