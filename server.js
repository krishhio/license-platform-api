require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const logger = require('./config/logger');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const licenseRoutes = require('./routes/license.routes');
const hardwareCodeRoutes = require("./routes/hardware_code.routes");
const productRoutes = require('./routes/product.routes'); // ✅ Ruta nueva

const app = express();
app.use(cors());
app.use(express.json());

// Probar conexión a la base de datos al iniciar
(async () => {
  try {
    const connection = await db.getConnection();
    logger.info('Conexión a la base de datos establecida');
    connection.release(); // Liberar conexión
  } catch (err) {
    logger.error(`Error al conectar a la base de datos: ${err.message}`);
  }
})();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/products', productRoutes); // ✅ Activamos el módulo de productos
app.use("/api/hardware-codes", hardwareCodeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});
