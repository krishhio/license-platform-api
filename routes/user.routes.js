const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Obtener todos los usuarios (solo admin)
router.get('/', verifyToken, isAdmin, userController.getUsers);

// Crear nuevo usuario (solo admin)
router.post('/', verifyToken, isAdmin, userController.createNewUser);

// Cambiar contraseña desde perfil autenticado
router.post('/change-password', verifyToken, userController.changePassword);

// Eliminar usuario por ID (solo admin)
router.delete('/:id', verifyToken, isAdmin, userController.deleteUserById);

// Editar usuario (solo admin)
router.put('/:id', verifyToken, isAdmin, userController.updateUserData);

module.exports = router;
