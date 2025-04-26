const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { hashPassword, verifyPassword } = require('../utils/hash');
const transporter = require('../config/mail');
const logger = require('../config/logger');
const {
  findUserByUsername,
  findUserByEmail,
  createUser
} = require('../models/user.model');

// Generar token JWT
function generateToken(user) {
  logger.info(`Generando Token de sesion de Usuario: ${user.id}`);
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
  if (!user){
    logger.error(`Usuario no encontrado: ${username}`);
    return res.status(401).json({ message: 'Usuario no encontrado' });
  } 
  logger.info('Usuario Encontrado');
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    logger.error(`Contraseña incorrecta de usuario: ${username}`);
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = generateToken(user);
  logger.info(`Token Generado: ${token}`);
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
}

// POST /register
async function register(req, res) {
  const { username, email, password } = req.body;
  logger.info(`Registrando usuario: ${username}`)
  const existing = await findUserByUsername(username);
  if (existing){
    logger.error('Usuario ya existe');
    return res.status(400).json({ message: 'Usuario ya existe' });
  } 

  const id = await createUser({ username, email, password });
  logger.info(`Usuario creado ${id}`)
  res.status(201).json({ message: 'Usuario creado', userId: id });
}

// POST /reset-password-request
async function requestPasswordReset(req, res) {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    logger.error(`Correo no encontrado`);
    return res.status(404).json({ message: 'Correo no encontrado' });
  }
  
  const token = generateToken(user);
  logger.info(`Generando Token de usuario ${user}`);
  logger.info(`Token de usuario ${user}: ${token}`);
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  try{
    await transporter.sendMail({
      from: `"Plataforma de Licenciamiento MacaoCloud " <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Solicitud para restablecer contraseña',
      html: `<p>Hola ${user.username}, haz clic <a href="${resetLink}">aquí</a> para restablecer tu contraseña.</p>`
    });
    logger.info(`📧 Correo de recuperación enviado a ${user.email}`);
    res.json({ message: 'Correo enviado para restablecer contraseña' });
  }catch (error) {
    res.status(401).json({ message: 'Correo no enviado' });
    logger.error(`❌ Error al enviar correo a ${user.email}: ${error.message}`);
  }

}

// POST /reset-password
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByUsername(decoded.username);
    if (!user){
      logger.info(`Usuario no encontrado: ${user}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } 
      

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
