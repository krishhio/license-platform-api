const db = require('../config/db');

// Crear nuevo hardware code
const createHardwareCode = async ({ license_id, code, description }) => {
  const [result] = await db.query(
    'INSERT INTO hardware_code (license_id, code, description) VALUES (?, ?, ?)',
    [license_id, code, description]
  );
  return {
    id: result.insertId,
    license_id,
    code,
    description
  };
};

// Listar todos los hardware codes
const getAllHardwareCodes = async () => {
  const [rows] = await db.query('SELECT * FROM hardware_code');
  return rows;
};

// Actualizar descripción de un hardware code
const updateHardwareCodeDescription = async (id, description) => {
  const [result] = await db.query(
    'UPDATE hardware_code SET description = ? WHERE id = ?',
    [description, id]
  );
  return result.affectedRows > 0;
};

// Eliminar hardware code
const deleteHardwareCode = async (id) => {
  const [result] = await db.query(
    'DELETE FROM hardware_code WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// Buscar hardware code por código
const findHardwareCodeByCode = async (code) => {
  const [rows] = await db.query(`SELECT * FROM hardware_code WHERE code = ?`, [code]);
  return rows.length ? rows[0] : null;
};

module.exports = {
  createHardwareCode,
  getAllHardwareCodes,
  updateHardwareCodeDescription,
  findHardwareCodeByCode,
  deleteHardwareCode
};
