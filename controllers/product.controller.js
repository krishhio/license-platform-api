const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  } = require('../models/product.model');
  
  // Obtener todos los productos
  const getAll = async (req, res) => {
    try {
      const products = await getAllProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener productos', error: err.message });
    }
  };
  
  // Obtener un producto por ID
  const getById = async (req, res) => {
    try {
      const product = await getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener producto', error: err.message });
    }
  };
  
  // Crear un nuevo producto
  const create = async (req, res) => {
    try {
      const id = await createProduct(req.body);
      res.status(201).json({ message: 'Producto creado', id });
    } catch (err) {
      res.status(500).json({ message: 'Error al crear producto', error: err.message });
    }
  };
  
  // Actualizar un producto
  const update = async (req, res) => {
    try {
      await updateProduct(req.params.id, req.body);
      res.json({ message: 'Producto actualizado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
    }
  };
  
  // Eliminar un producto
  const remove = async (req, res) => {
    try {
      await deleteProduct(req.params.id);
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar producto', error: err.message });
    }
  };
  
  module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
  };
  