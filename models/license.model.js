const db = require('../config/db');

// Obtener todas las licencias
const findAllLicenses = async () => {
  const [rows] = await db.query('SELECT * FROM license');
  return rows;
};

// Obtener una licencia por ID
const findLicenseById = async (id) => {
  const [rows] = await db.query('SELECT * FROM license WHERE id = ?', [id]);
  return rows[0];
};

// Crear una nueva licencia
const createLicense = async ({ license_key, hardware_code_id, expiry_date, invoice_id }) => {
  const [result] = await db.query(
    'INSERT INTO license (license_key, hardware_code_id, expiry_date, invoice_id) VALUES (?, ?, ?, ?)',
    [license_key, hardware_code_id, expiry_date, invoice_id]
  );
  return result.insertId;
};

// Actualizar una licencia
const updateLicense = async (id, { license_key, hardware_code_id, expiry_date, invoice_id }) => {
  await db.query(
    'UPDATE license SET license_key = ?, hardware_code_id = ?, expiry_date = ?, invoice_id = ? WHERE id = ?',
    [license_key, hardware_code_id, expiry_date, invoice_id, id]
  );
};

// Eliminar una licencia
const deleteLicense = async (id) => {
  await db.query('DELETE FROM license WHERE id = ?', [id]);
};

module.exports = {
  findAllLicenses,
  findLicenseById,
  createLicense,
  updateLicense,
  deleteLicense
};
