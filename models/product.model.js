const db = require('../config/db');

async function getAllProducts() {
  const [rows] = await db.query('SELECT * FROM products');
  return rows;
}

async function getProductById(id) {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

async function createProduct(product) {
  const { name, description, price, stock } = product;
  const [result] = await db.query(
    'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
    [name, description, price, stock]
  );
  return result.insertId;
}

async function updateProduct(id, product) {
  const { name, description, price, stock } = product;
  await db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
    [name, description, price, stock, id]
  );
}

async function deleteProduct(id) {
  await db.query('DELETE FROM products WHERE id = ?', [id]);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
