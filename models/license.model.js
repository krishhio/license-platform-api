const db = require('../config/db');

// Obtener todas las licencias
const getAllLicenses = async () => {
  const [rows] = await db.query('SELECT * FROM license');
  return rows;
};

// Obtener licencia por ID (con productos y hardware codes)
const getLicenseById = async (id) => {
  const [licenseRows] = await db.query('SELECT * FROM license WHERE id = ?', [id]);
  console.info("Id de licencia es:",id)
  if (licenseRows.length === 0) return null;

  const [productRows] = await db.query(
    `SELECT p.id, p.name, p.description 
     FROM products p
     JOIN license_products lp ON p.id = lp.product_id
     WHERE lp.license_id = ?`,
    [id]
  );

  const [hardwareRows] = await db.query(
    'SELECT id, code FROM hardware_codes WHERE id = ?',
    [id]
  );

  return {
    ...licenseRows[0],
    products: productRows,
    hardware_codes: hardwareRows
  };
};

// Crear nueva licencia
// Crear nueva licencia solo si existe el hardware y la factura con productos
const createLicense = async ({ license_key, hardware_code_id, invoice_id, expiry_date }) => {
  // Verificar si el código de hardware existe
  const [hardwareRows] = await db.query('SELECT id FROM hardware_code WHERE id = ?', [hardware_code_id]);
  if (hardwareRows.length === 0) {
    throw new Error('Código de hardware no válido');
  }

  // Verificar si la factura existe y tiene productos asociados
  const [invoiceRows] = await db.query(
    `SELECT ip.invoice_id
     FROM invoice_products ip
     JOIN invoice i ON i.id = ip.invoice_id
     WHERE ip.invoice_id = ?
     LIMIT 1`,
    [invoice_id]
  );
  if (invoiceRows.length === 0) {
    throw new Error('Factura no válida o sin productos asociados');
  }

  // Si ambas verificaciones pasan, crear la licencia
  const [result] = await db.query(
    'INSERT INTO license (license_key, hardware_code_id, invoice_id, expiry_date) VALUES (?, ?, ?, ?)',
    [license_key, hardware_code_id, invoice_id, expiry_date]
  );
  return result.insertId;
};

// Asignar productos a una licencia
const assignProductsToLicense = async (licenseId, productIds) => {
  const values = productIds.map(productId => [licenseId, productId]);
  await db.query('INSERT INTO license_products (license_id, product_id) VALUES ?', [values]);
};

// Agregar código de hardware a una licencia
const addHardwareCodeToLicense = async (licenseId, hardwareCode) => {
  const [result] = await db.query(
    'INSERT INTO hardware_codes (license_id, hardware_code) VALUES (?, ?)',
    [licenseId, hardwareCode]
  );
  return result.insertId;
};

// Actualizar licencia
const updateLicense = async (id, { name, description }) => {
  await db.query(
    'UPDATE license SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
};

// Eliminar licencia y sus relaciones
const deleteLicense = async (id) => {
  await db.query('DELETE FROM license_products WHERE license_id = ?', [id]);
  await db.query('DELETE FROM hardware_codes WHERE license_id = ?', [id]);
  await db.query('DELETE FROM license WHERE id = ?', [id]);
};

const findLicensesByHardwareOrLicenseKey = async ({ hardware_code, license_key }) => {
  let query = 'SELECT * FROM license WHERE 1 = 1';
  const params = [];
  console.info("Informacion recibida hardware_code ", hardware_code)
  console.info("Informacion recibida license_key ", license_key)

  if (hardware_code) {
    query += ' AND hardware_code_id = ?';
    params.push(hardware_code);
  }

  if (license_key) {
    query += ' AND license_key = ?';
    params.push(license_key);
  }

  const [rows] = await db.query(query, params);
  return rows;
};


module.exports = {
  getAllLicenses,
  getLicenseById,
  createLicense,
  assignProductsToLicense,
  addHardwareCodeToLicense,
  updateLicense,
  deleteLicense,
  findLicensesByHardwareOrLicenseKey
};
