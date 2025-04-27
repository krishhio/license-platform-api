const {
  createHardwareCode,
  getAllHardwareCodes,
  updateHardwareCodeDescription,
  deleteHardwareCode
} = require('../models/hardware_code.model');

// Crear hardware code
const createNewHardwareCode = async (req, res) => {
  try {
    const { license_id, code, description } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Hardware code (code) is required' });
    }

    const hardwareCode = await createHardwareCode({ license_id, code, description });

    res.status(201).json(hardwareCode);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar hardware codes
const listHardwareCodes = async (req, res) => {
  try {
    const codes = await getAllHardwareCodes();
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar descripción
const updateHardwareCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const updated = await updateHardwareCodeDescription(id, description);

    if (!updated) {
      return res.status(404).json({ message: 'Hardware code not found' });
    }

    res.status(200).json({ message: 'Hardware code updated successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar hardware code
const deleteHardwareCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteHardwareCode(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Hardware code not found' });
    }

    res.status(200).json({ message: 'Hardware code deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNewHardwareCode,
  listHardwareCodes,
  updateHardwareCode,
  deleteHardwareCodeById
};
