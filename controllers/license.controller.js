const {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
  findLicensesByHardwareOrLicenseKey,
  validateHardwareAndInvoice
} = require('../models/license.model');

// Obtener todas las licencias
const getLicenses = async (req, res) => {
  try {
    const licenses = await getAllLicenses();
    console.info("Obteniendo todas las licencias");
    res.json(licenses);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener licencias', error: err.message });
  }
};

// Obtener una licencia por ID
const getLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const license = await getLicenseById(id);
    console.info("Obteniendo  la licencias con el id: ",id);

    if (!license) {
      console.error('Licencia no encontrada con id: ',id)
      return res.status(404).json({ message: 'Licencia no encontrada' });
    }

    res.json(license);
  } catch (err) {
    console.error('Error al obtener licencia', err.message);
    res.status(500).json({ message: 'Error al obtener licencia', error: err.message });
  }
};

// Crear una nueva licencia
const createNewLicense = async (req, res) => {
  try {
    const { license_key, hardware_code_id, invoice_id, expiry_date } = req.body;

    if (!license_key || !hardware_code_id || !invoice_id || !expiry_date) {
      console.error('Todos los campos son obligatorios');
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const isValid = await validateHardwareAndInvoice(hardware_code_id, invoice_id);
    if (!isValid) {
      console.error('El código de hardware o la factura no son válidos o no tienen productos asociados');
      return res.status(400).json({
        message: 'El código de hardware o la factura no son válidos o no tienen productos asociados'
      });
    }

    const id = await createLicense({ license_key, hardware_code_id, invoice_id, expiry_date });
    res.status(201).json({ message: 'Licencia creada correctamente', id });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear licencia', error: err.message });
  }
};

// Actualizar licencia
const updateExistingLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const { license_key, hardware_code_id, invoice_id, expiry_date } = req.body;
    console.info("id de licencia a actualizar: ", id);
    console.info("license_key: ", license_key);
    console.info("hardware_code_id: ",hardware_code_id);
    console.info("invoice_id: ",invoice_id);
    console.info("expiry_date: ",expiry_date);

    const updated = await updateLicense(id, {
      license_key,
      hardware_code_id,
      invoice_id,
      expiry_date
    });

    if (!updated) {
      console.error('No se pudo actualizar la licencia con id: ',id)
      return res.status(404).json({ message: 'No se pudo actualizar la licencia' });
    }

    res.json({ message: 'Licencia actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar licencia', err.message);
    res.status(500).json({ message: 'Error al actualizar licencia', error: err.message });
  }
};

// Eliminar licencia
const deleteExistingLicense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteLicense(id);
    if (!deleted) {
      console.error('No se pudo eliminar la licencia con id: ',id)
      return res.status(404).json({ message: 'Licencia no encontrada para eliminar' });
    }

    res.json({ message: 'Licencia eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar licencia ',err.message)
    res.status(500).json({ message: 'Error al eliminar licencia', error: err.message });
  }
};

// Buscar por license_key o hardware_code
const searchLicense = async (req, res) => {
  try {
    const { license_key, hardware_code } = req.query;

    if (!license_key && !hardware_code) {
      console.error('Debe proporcionar license_key o hardware_code');
      return res.status(400).json({ message: 'Debe proporcionar license_key o hardware_code' });
    }

    const result = await findLicensesByHardwareOrLicenseKey(license_key, hardware_code);
    console.info('Licencia encontrada ',license_key );
    console.info('Licencia encontrada ',hardware_code );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar licencias', error: err.message });
  }
};

module.exports = {
  getLicenses,
  getLicense,
  createNewLicense,
  updateExistingLicense,
  deleteExistingLicense,
  searchLicense
};
