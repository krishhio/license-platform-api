const {
  getAllLicenses,
  findLicensesByHardwareOrLicenseKey,
  createLicense,
  assignProductsToLicense,
  assignHardwareToLicense
} = require('../models/license.model');

// Obtener todas las licencias
const getLicenses = async (req, res) => {
  try {
    const licenses = await getAllLicenses();
    console.info("Obteniendo Licencias: ",licenses);
    res.json(licenses);
  } catch (err) {
    console.error('Error al obtener licencias', err.message)
    res.status(500).json({ message: 'Error al obtener licencias', error: err.message });
  }
};

// Buscar por hardware_code o license_key
const searchLicenses = async (req, res) => {
  try {
    const { hardware_code, license_key } = req.query;
    if (!hardware_code && !license_key) {
      console.error('Debes proporcionar hardware_code o license_key');
      return res.status(400).json({ message: 'Debes proporcionar hardware_code o license_key' });
    }

    const results = await findLicensesByHardwareOrLicenseKey({ hardware_code, license_key });
    console.info('Licencias Encontrada ', results)
    res.json(results);
  } catch (err) {
    console.error('Error al buscar licencias', err.message);
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

    console.log('➡️ Datos recibidos:', req.body);

    if (!license_key || !normalizedType) {
      console.warn('⚠️ Faltan license_key o type');
      return res.status(400).json({
        message: 'Faltan campos obligatorios (license_key, type)'
      });
    }

    if (!validTypes.includes(normalizedType)) {
      console.warn('❌ Tipo de licencia no válido:', normalizedType);
      return res.status(400).json({
        message: `Tipo de licencia inválido. Los permitidos son: ${validTypes.join(', ')}`
      });
    }

    if (normalizedType === 'paid' && !invoice_id) {
      console.warn('❌ Tipo "paid" pero falta invoice_id');
      return res.status(400).json({
        message: 'Las licencias pagadas requieren una factura (invoice_id)'
      });
    }

    console.log('✅ Validaciones superadas, creando licencia...');

    const licenseId = await createLicense({
      license_key,
      invoice_id,
      type: normalizedType
    });

    console.log('✅ Licencia creada con ID:', licenseId);

    await assignProductsToLicense(licenseId, product_ids);
    console.log('📦 Productos asignados:', product_ids);

    await assignHardwareToLicense(licenseId, hardware_codes);
    console.log('🔐 Códigos de hardware asignados:', hardware_codes);

    res.status(201).json({
      message: 'Licencia creada exitosamente',
      license_id: licenseId
    });

  } catch (err) {
    console.error('💥 Error en createNewLicense:', err.message);
    res.status(500).json({
      message: 'Error al crear licencia',
      error: err.message
    });
  }
};

module.exports = {
  getLicenses,
  searchLicenses,
  createNewLicense
};
