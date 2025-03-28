const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  create,
  update,
  remove
} = require('../controllers/product.controller');

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Rutas protegidas
router.get('/', verifyToken, getAll);
router.get('/:id', verifyToken, getById);
router.post('/', verifyToken, isAdmin, create);
router.put('/:id', verifyToken, isAdmin, update);
router.delete('/:id', verifyToken, isAdmin, remove);

module.exports = router;
