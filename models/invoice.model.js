const db = require('../config/db');

// Crear nueva factura
const createInvoice = async ({ reference, amount, client_name }) => {
  const [result] = await db.query(
    'INSERT INTO invoice (reference, amount, client_name) VALUES (?, ?, ?)',
    [reference, amount, client_name]
  );
  return {
    id: result.insertId,
    reference,
    amount,
    status: 'pending', // Siempre inicia en pending
    client_name
  };
};

// Obtener todas las facturas
const getAllInvoices = async () => {
  const [rows] = await db.query('SELECT * FROM invoice');
  return rows;
};

// Obtener una factura por ID
const getInvoiceById = async (id) => {
  const [rows] = await db.query('SELECT * FROM invoice WHERE id = ?', [id]);
  return rows.length ? rows[0] : null;
};

// Actualizar el estado de una factura
const updateInvoiceStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE invoice SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// Eliminar factura (solo si no está pagada)
const deleteInvoice = async (id) => {
  const [result] = await db.query('DELETE FROM invoice WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice
};
