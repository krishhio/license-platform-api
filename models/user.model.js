// models/user.model.js
const db = require('../config/db');
const bcrypt = require('bcrypt');


// Buscar usuario por ID
const findUserById = async (id) => {
  const [rows] = await db.query('SELECT id, username, email, role, password_hash FROM user WHERE id = ?', [id]);
  return rows[0];
};

// Buscar usuario por username
const findUserByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
  return rows[0];
};

// Buscar usuario por email
const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
  return rows[0];
};

// Crear nuevo usuario
const createUser = async ({ username, email, password, role = 'user' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO user (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  );
  return result.insertId;
};

// Obtener todos los usuarios
const getAllUsers = async () => {
  const [rows] = await db.query('SELECT id, username, email, role FROM user');
  return rows;
};

// Actualizar usuario
const updateUser = async (id, { username, email, role }) => {
  const [result] = await db.query(
    'UPDATE user SET username = ?, email = ?, role = ? WHERE id = ?',
    [username, email, role, id]
  );
  return result.affectedRows > 0;
};

// Eliminar usuario
const deleteUser = async (id) => {
  const [result] = await db.query('DELETE FROM user WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Actualizar Password de Usuario
async function updateUserPassword(id, hashedPassword) {
  const [result] = await db.query('UPDATE user SET password_hash = ? WHERE id = ?', [
    hashedPassword,
    id
  ]);
  return result;
}


module.exports = {
  findUserById,
  findUserByUsername,
  findUserByEmail,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserPassword
};
