const {
  getAllLicenses,
  findLicensesByHardwareOrLicenseKey,
  createLicense,
  assignProductsToLicense,
  findLicenseById,
  updateLicense,
  assignHardwareToLicense
} = require('../models/license.model');
const { checkInvoiceExists } = require('../models/invoice.model'); // Asegúrate de tener esta función
const logger = require('../config/logger');

// Obtener todas las licencias
const getLicenses = async (req, res) => {
  try {
    const licenses = await getAllLicenses();
    logger.info(`Obteniendo Licencias: : ${licenses}`);
    res.json(licenses);
  } catch (err) {
    logger.error(`Error al obtener licencias: ${err.message}`);
    res.status(500).json({ message: 'Error al obtener licencias', error: err.message });
  }
};

// Buscar por hardware_code o license_key
const searchLicenses = async (req, res) => {
  try {
    const { hardware_code, license_key } = req.query;
    logger.info(`La informacion de hardware_code es: ${hardware_code} y la de license_key es: ${license_key}`);
    if (!hardware_code && !license_key) {
      logger.error('Debes proporcionar hardware_code o license_key');
      return res.status(400).json({ message: 'Debes proporcionar hardware_code o license_key' });
    }
    const results = await findLicensesByHardwareOrLicenseKey({ hardware_code, license_key });
    logger.info('Licencias Encontrada ', results)
    res.json(results);
  } catch (err) {
    logger.error(`Error al buscar licencias: ${err.message}`);
    res.status(500).json({ message: 'Error al buscar licencias', error: err.message });
  }
};

// Crear nueva licencia
const createNewLicense = async (req, res) => {
  try {
    const {
      license_key,
      invoice_id,
      type = 'demo',
      product_ids = [],
      hardware_codes = []
    } = req.body;

    const validTypes = ['paid', 'demo', 'internal'];
    const normalizedType = (type || '').toLowerCase();
    logger.info(`Datos recibidos: ${req.body}`);

    if (!license_key || !normalizedType) {
      logger.error(`Faltan campos obligatorios license_key , type`);
      return res.status(400).json({
        message: 'Faltan campos obligatorios (license_key, type)'
      });
    }

    if (!validTypes.includes(normalizedType)) {
      logger.warn(`Tipo de licencia no válido:  ${normalizedType}`);
      return res.status(400).json({
        message: `Tipo de licencia inválido. Los permitidos son: ${validTypes.join(', ')}`
      });
    }

    if (normalizedType === 'paid' && !invoice_id) {
      logger.warn(` Tipo "paid" pero falta invoice_id`);
      return res.status(400).json({
        message: 'Las licencias pagadas requieren una factura (invoice_id)'
      });
    }

    logger.info(` Validaciones superadas, creando licencia...`);

    const licenseId = await createLicense({
      license_key,
      invoice_id,
      type: normalizedType
    });

    logger.info(` Licencia creada con ID: ${licenseId}`);

    await assignProductsToLicense(licenseId, product_ids);
    logger.info(` Productos asignados: ${product_ids}`);

    await assignHardwareToLicense(licenseId, hardware_codes);
    logger.info(` Códigos de hardware asignados: ${hardware_codes}`);

    res.status(201).json({
      message: 'Licencia creada exitosamente',
      license_id: licenseId
    });

  } catch (err) {
    logger.error(`Error en createNewLicense: ${err.message}`);
    res.status(500).json({
      message: 'Error al crear licencia',
      error: err.message
    });
  }
};



// Obtener una licencia por ID (solo admin)
const getLicenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    logger.info(`Id de licencia a buscar: ${id}`);

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access forbidden: Admins only" });
    }

    const license = await findLicenseById(id);  // <-- usamos la nueva función aquí

    if (!license) {
      return res.status(404).json({ message: "License not found" });
    }

    res.status(200).json(license);

  } catch (error) {
    logger.error(`Error al realizar busqueda ${error}`);
    res.status(500).json({ error: error.message });
  }
};


const updateLicenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const fieldsToUpdate = req.body;
    logger.info(`Id de Licencia a actualizar: ${id}`);
    logger.info(`Campos a actualizar: ${fieldsToUpdate}`);

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access forbidden: Admins only" });
    }

    // Verificar primero que la licencia exista
    const existingLicense = await findLicenseById(id);
    if (!existingLicense) {
      return res.status(404).json({ message: "License not found" });
    }

    // Determinar el tipo de licencia actualizado
    const updatedType = fieldsToUpdate.type || existingLicense.type;  // Si no envían 'type', usamos el existente

    if (updatedType === 'paid') {
      // Si quieren que sea 'paid', debe existir invoice_id
      logger.info(`La licencia ${id} fue pagada`);
      const invoiceId = fieldsToUpdate.invoice_id || existingLicense.invoice_id;

      if (!invoiceId) {
        logger.warn(`El ID de invoice es requerido para una licencia pagada`);
        return res.status(400).json({ message: "Invoice ID is required for paid licenses" });
      }

      const exists = await checkInvoiceExists(invoiceId);
      if (!exists) {
        logger.info(`La factura no existe`);
        return res.status(400).json({ message: "Invoice ID does not exist" });
      }
    }

    const updated = await updateLicense(id, fieldsToUpdate);

    if (!updated) {
      
      return res.status(404).json({ message: "License not found or no fields updated" });
    }

    res.status(200).json({ message: "License updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getLicenses,
  searchLicenses,
  getLicenseById,
  createNewLicense,
  updateLicenseById   // 🚀 nuevo export
};
