const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { hashPassword, verifyPassword } = require('../utils/hash');
const transporter = require('../config/mail');
const {
  findUserByUsername,
  findUserByEmail,
  createUser
} = require('../models/user.model');

// Generar token JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// POST /login
async function login(req, res) {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
}

// POST /register
async function register(req, res) {
  const { username, email, password } = req.body;
  const existing = await findUserByUsername(username);
  if (existing) return res.status(400).json({ message: 'Usuario ya existe' });

  const id = await createUser({ username, email, password });
  res.status(201).json({ message: 'Usuario creado', userId: id });
}

// POST /reset-password-request
async function requestPasswordReset(req, res) {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Correo no encontrado' });

  const token = generateToken(user);
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Licencias ERP" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Solicitud para restablecer contraseña',
    html: `<p>Hola ${user.username}, haz clic <a href="${resetLink}">aquí</a> para restablecer tu contraseña.</p>`
  });

  res.json({ message: 'Correo enviado para restablecer contraseña' });
}

// POST /reset-password
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByUsername(decoded.username);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const hashed = await require('bcryptjs').hash(newPassword, 10);
    await require('../config/db').query('UPDATE user SET password_hash = ? WHERE id = ?', [hashed, user.id]);
    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = {
  login,
  register,
  requestPasswordReset,
  resetPassword
};
