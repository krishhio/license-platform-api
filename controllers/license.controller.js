const {
  getAllLicenses,
  getLicenseById,
  createLicense,
  assignProductsToLicense,
  assignHardwareToLicense,
  searchLicenses
} = require('../models/license.model');

const { getInvoiceById } = require('../models/invoice.model'); // Para validar facturas (si tienes invoice.model separado)


// Obtener todas las licencias
const listLicenses = async (req, res) => {
  try {
    const licenses = await getAllLicenses();
    res.status(200).json(licenses);
  } catch (error) {
    console.error('💥 Error en listLicenses:', error.message);
    res.status(500).json({ message: "Error al obtener licencias", error: error.message });
  }
};

// Obtener licencia específica por ID
const getLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const license = await getLicenseById(id);

    if (!license) {
      return res.status(404).json({ message: "Licencia no encontrada" });
    }

    res.status(200).json(license);
  } catch (error) {
    console.error('💥 Error en getLicense:', error.message);
    res.status(500).json({ message: "Error al obtener licencia", error: error.message });
  }
};

// Buscar licencias por filtros
const searchLicensesController = async (req, res) => {
  try {
    const filters = {
      license_key: req.query.license_key,
      type: req.query.type,
      status: req.query.status
    };

    const results = await searchLicenses(filters);
    res.status(200).json(results);

  } catch (error) {
    console.error('💥 Error en searchLicenses:', error.message);
    res.status(500).json({ message: "Error al buscar licencias", error: error.message });
  }
};

// Crear nueva licencia (demo, paid o internal)
const createNewLicense = async (req, res) => {
  try {
    const {
      license_key,
      type,
      expiry_date,
      invoice_id,
      product_ids = [],
      hardware_codes = []
    } = req.body;

    // Validar campos básicos
    if (!license_key || !type) {
      return res.status(400).json({ message: "license_key y type son obligatorios" });
    }

    const allowedTypes = ['paid', 'demo', 'internal'];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: `El tipo debe ser uno de: ${allowedTypes.join(', ')}` });
    }

    // Validaciones específicas por tipo
    if (type === 'demo') {
      if (!expiry_date) {
        return res.status(400).json({ message: "Las licencias demo requieren una fecha de expiración (expiry_date)" });
      }
    }

    if (type === 'paid') {
      if (!invoice_id) {
        return res.status(400).json({ message: "Las licencias pagadas requieren un invoice_id" });
      }

      // Validar que el invoice exista y esté pagado
      const invoice = await getInvoiceById(invoice_id);

      if (!invoice) {
        return res.status(400).json({ message: "La factura asociada no existe" });
      }

      if (invoice.status !== 'paid') {
        return res.status(400).json({ message: "La factura debe estar pagada para crear una licencia pagada" });
      }
    }

    // Crear licencia
    const newLicenseId = await createLicense({
      license_key,
      invoice_id: invoice_id || null,
      type,
      expiry_date: expiry_date || null,
      status: 'inactive'
    });

    // Asignar productos (si vienen)
    if (product_ids.length > 0) {
      await assignProductsToLicense(newLicenseId, product_ids);
    }

    // Asignar hardware codes (si vienen)
    if (hardware_codes.length > 0) {
      await assignHardwareToLicense(newLicenseId, hardware_codes);
    }

    res.status(201).json({
      message: "Licencia creada exitosamente",
      license_id: newLicenseId
    });

  } catch (error) {
    console.error("💥 Error en createNewLicense:", error.message);
    res.status(500).json({ message: "Error interno al crear licencia", error: error.message });
  }
};

module.exports = {
  createNewLicense,
  listLicenses,
  getLicense,
  searchLicensesController
};
