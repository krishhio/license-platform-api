const {
    findAllLicenses,
    findLicenseById,
    createLicense,
    updateLicense,
    deleteLicense
  } = require('../models/license.model');
  
  // Obtener todas las licencias
  const getAllLicenses = async (req, res) => {
    try {
      const licenses = await findAllLicenses();
      res.json(licenses);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener licencias', error: err.message });
    }
  };
  
  // Obtener una licencia por ID
  const getLicenseById = async (req, res) => {
    try {
      const { id } = req.params;
      const license = await findLicenseById(id);
      if (!license) return res.status(404).json({ message: 'Licencia no encontrada' });
      res.json(license);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener la licencia', error: err.message });
    }
  };
  
  // Crear una nueva licencia
  const createNewLicense = async (req, res) => {
    try {
      const { license_key, hardware_code_id, expiry_date, invoice_id } = req.body;
      const newId = await createLicense({ license_key, hardware_code_id, expiry_date, invoice_id });
      res.status(201).json({ message: 'Licencia creada', licenseId: newId });
    } catch (err) {
      res.status(500).json({ message: 'Error al crear la licencia', error: err.message });
    }
  };
  
  // Actualizar una licencia
  const updateLicenseData = async (req, res) => {
    try {
      const { id } = req.params;
      const { license_key, hardware_code_id, expiry_date, invoice_id } = req.body;
      await updateLicense(id, { license_key, hardware_code_id, expiry_date, invoice_id });
      res.json({ message: 'Licencia actualizada' });
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar la licencia', error: err.message });
    }
  };
  
  // Eliminar una licencia
  const deleteLicenseById = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteLicense(id);
      res.json({ message: 'Licencia eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar la licencia', error: err.message });
    }
  };
  
  module.exports = {
    getAllLicenses,
    getLicenseById,
    createLicense,
    updateLicense,
    deleteLicense
  };
  