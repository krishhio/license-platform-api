const db = require('../config/db');

// Verificar si un invoice existe
const checkInvoiceExists = async (invoice_id) => {
  const [rows] = await db.query('SELECT id FROM invoice WHERE id = ?', [invoice_id]);
  return rows.length > 0;
};

module.exports = {
  checkInvoiceExists
};
