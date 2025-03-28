const {
  findUserById,
  findUserByEmail,
  findUserByUsername,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserPassword
} = require('../models/user.model');

const bcrypt = require('bcrypt');

// Obtener todos los usuarios (solo admin)
const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
};

// Crear un nuevo usuario
const createNewUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const userId = await createUser({ username, email, password, role });
    res.status(201).json({ message: 'Usuario creado correctamente', userId });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
  }
};

// Actualizar un usuario
const updateUserData = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'No tienes permiso para editar este usuario' });
    }

    await updateUser(id, { username, email, role });
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

// Eliminar usuario
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo un admin puede eliminar usuarios' });
    }

    await deleteUser(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};

// Cambiar contraseña desde el perfil
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const user = await findUserById(userId);
    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'La contraseña actual no es válida' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashedPassword);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar contraseña', error: err.message });
  }
};

module.exports = {
  getUsers,
  createNewUser,
  updateUserData,
  deleteUserById,
  changePassword
};
