const db = require('../config/db');

// Obtener todas las licencias con productos y hardware asociados
const getAllLicenses = async () => {
  const [licenses] = await db.query(`
    SELECT 
      l.id AS license_id,
      l.license_key,
      l.type,
      l.expiry_date,
      hc.code AS hardware_code,
      GROUP_CONCAT(p.name) AS products
    FROM license l
    LEFT JOIN hardware_code hc ON hc.license_id = l.id
    LEFT JOIN license_product lp ON lp.license_id = l.id
    LEFT JOIN product p ON p.id = lp.product_id
    GROUP BY l.id, hc.code
  `);
  console.info()
  return licenses;
};

// Buscar licencia por hardware_code o license_key
const findLicensesByHardwareOrLicenseKey = async ({ hardware_code, license_key }) => {
  let query = `
    SELECT 
      l.*, 
      GROUP_CONCAT(DISTINCT p.name) AS products,
      GROUP_CONCAT(DISTINCT hc.code) AS hardware_codes
    FROM license l
    LEFT JOIN license_product lp ON lp.license_id = l.id
    LEFT JOIN product p ON p.id = lp.product_id
    LEFT JOIN license_hardware_code lhc ON lhc.license_id = l.id
    LEFT JOIN hardware_code hc ON hc.id = lhc.hardware_code_id
  `;

  const conditions = [];
  const params = [];

  if (hardware_code) {
    conditions.push('hc.code = ?');
    params.push(hardware_code);
  }

  if (license_key) {
    conditions.push('l.license_key = ?');
    params.push(license_key);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' OR ');
  }

  query += ' GROUP BY l.id';

  const [rows] = await db.query(query, params);
  return rows;
};

// Crear nueva licencia
const createLicense = async ({  license_key, invoice_id, type = 'regular' }) => {
  if (type === 'regular' && !invoice_id) {
    throw new Error('Las licencias regulares requieren una factura (invoice_id)');
  }

  const [result] = await db.query(
    'INSERT INTO license (license_key, invoice_id, type) VALUES ( ?, ?, ?)',
    [license_key, invoice_id || null, type]
  );
  return result.insertId;
};

// Asignar productos a licencia
const assignProductsToLicense = async (license_id, product_ids = []) => {
  const values = product_ids.map(product_id => [license_id, product_id]);
  console.info('Productos asignados a licencia: ',values);
  if (values.length > 0) {
    await db.query('INSERT INTO license_product (license_id, product_id) VALUES ?', [values]);
  }
};

// Asignar hardware codes a licencia
const assignHardwareToLicense = async (license_id, hardware_codes = []) => {
  const values = hardware_codes.map(code => [license_id, code]);
  console.info('Hardware Codes asignados a licencia: ',values);
  if (values.length > 0) {
    await db.query('INSERT INTO hardware_code (license_id, code) VALUES ?', [values]);
  }
};

module.exports = {
  getAllLicenses,
  findLicensesByHardwareOrLicenseKey,
  createLicense,
  assignProductsToLicense,
  assignHardwareToLicense
};
