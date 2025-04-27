const db = require('../config/db');

// Crear nueva licencia
const createLicense = async ({ license_key, invoice_id, type, expiry_date, status = 'inactive' }) => {
  const [result] = await db.query(
    `INSERT INTO license (license_key, invoice_id, type, expiry_date, status)
     VALUES (?, ?, ?, ?, ?)`,
    [license_key, invoice_id, type, expiry_date, status]
  );
  return result.insertId;
};

// Asignar productos a una licencia
const assignProductsToLicense = async (license_id, product_ids = []) => {
  if (!product_ids.length) return;
  
  const values = product_ids.map(product_id => [license_id, product_id]);
  await db.query(
    `INSERT INTO license_product (license_id, product_id) VALUES ?`,
    [values]
  );
};

// Asignar hardware codes a una licencia
const assignHardwareToLicense = async (license_id, hardware_codes = []) => {
  if (!hardware_codes.length) return;

  const values = hardware_codes.map(code => [license_id, code]);
  await db.query(
    `INSERT INTO hardware_code (license_id, code) VALUES ?`,
    [values]
  );
};
// Obtener todas las licencias
const getAllLicenses = async () => {
  const [rows] = await db.query(`SELECT * FROM license`);
  return rows;
};

// Obtener licencia por ID
const getLicenseById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM license WHERE id = ?`, [id]);
  return rows.length ? rows[0] : null;
};

// Buscar licencias por filtros (license_key, type, status)
const searchLicenses = async (filters) => {
  let query = `SELECT * FROM license WHERE 1=1 `;
  const params = [];

  if (filters.license_key) {
    query += `AND license_key = ? `;
    params.push(filters.license_key);
  }

  if (filters.type) {
    query += `AND type = ? `;
    params.push(filters.type);
  }

  if (filters.status) {
    query += `AND status = ? `;
    params.push(filters.status);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

module.exports = {
  createLicense,
  assignProductsToLicense,
  assignHardwareToLicense,
  getAllLicenses,
  getLicenseById,
  searchLicenses
};
