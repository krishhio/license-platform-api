const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Iniciar sesión
router.post('/login', authController.login);

// Registrar usuario
router.post('/register', authController.register);

// Solicitar restablecimiento de contraseña
router.post('/reset-password-request', authController.requestPasswordReset);

// Confirmar nueva contraseña
router.post('/reset-password', authController.resetPassword);

module.exports = router;
