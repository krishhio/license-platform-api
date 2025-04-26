const db = require("../models/hardwarecode.model");
const HardwareCode = db.hardware_code;

// Crear nuevo hardware code
exports.createHardwareCode = async (req, res) => {
  try {
    const { license_id, code, description } = req.body;
    const newCode = await HardwareCode.create({ license_id, code, description });
    res.status(201).json(newCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos los hardware codes
exports.getHardwareCodes = async (req, res) => {
  try {
    const codes = await HardwareCode.findAll();
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un hardware code
exports.updateHardwareCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const code = await HardwareCode.findByPk(id);
    if (!code) {
      return res.status(404).json({ message: "Hardware code not found" });
    }

    code.description = description || code.description;
    await code.save();

    res.status(200).json(code);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un hardware code
exports.deleteHardwareCode = async (req, res) => {
  try {
    const { id } = req.params;

    const code = await HardwareCode.findByPk(id);
    if (!code) {
      return res.status(404).json({ message: "Hardware code not found" });
    }

    await code.destroy();
    res.status(200).json({ message: "Hardware code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
