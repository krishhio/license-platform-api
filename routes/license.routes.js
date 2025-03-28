const express = require('express');
const router = express.Router();
const {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense
} = require('../controllers/license.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Rutas protegidas
router.get('/', verifyToken, isAdmin, getAllLicenses);
router.get('/:id', verifyToken, isAdmin, getLicenseById);
router.post('/', verifyToken, isAdmin, createLicense);
router.put('/:id', verifyToken, isAdmin, updateLicense);
router.delete('/:id', verifyToken, isAdmin, deleteLicense);

module.exports = router;
