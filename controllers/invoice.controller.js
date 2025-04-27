const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoiceStatus,
    deleteInvoice
  } = require('../models/invoice.model');
  
  // Crear factura
  const createNewInvoice = async (req, res) => {
    try {
      const { reference, amount, client_name } = req.body;
  
      if (!reference || !amount) {
        return res.status(400).json({ message: "Reference and amount are required" });
      }
  
      const invoice = await createInvoice({ reference, amount, client_name });
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Listar todas las facturas
  const listInvoices = async (req, res) => {
    try {
      const invoices = await getAllInvoices();
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Obtener una factura por ID
  const getInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await getInvoiceById(id);
  
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      res.status(200).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Actualizar estado de factura
  const updateInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const allowedStatuses = ['pending', 'paid', 'canceled'];
  
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
      }
  
      const updated = await updateInvoiceStatus(id, status);
  
      if (!updated) {
        return res.status(404).json({ message: "Invoice not found or not updated" });
      }
  
      res.status(200).json({ message: "Invoice status updated successfully" });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Eliminar factura (solo si está pending)
  const deleteInvoiceById = async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await getInvoiceById(id);
  
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      if (invoice.status === 'paid') {
        return res.status(400).json({ message: "Cannot delete a paid invoice" });
      }
  
      const deleted = await deleteInvoice(id);
  
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete invoice" });
      }
  
      res.status(200).json({ message: "Invoice deleted successfully" });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    createNewInvoice,
    listInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoiceById
  };
  