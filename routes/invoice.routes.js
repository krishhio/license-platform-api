const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');


// Crear factura
router.post('/', verifyToken, invoiceController.createNewInvoice);

// Listar facturas
router.get('/', verifyToken, invoiceController.listInvoices);

// Obtener factura por ID
router.get('/:id', verifyToken, invoiceController.getInvoice);

// Actualizar estado de factura
router.put('/:id', verifyToken, invoiceController.updateInvoice);

// Eliminar factura
router.delete('/:id', verifyToken, invoiceController.deleteInvoiceById);

module.exports = router;
