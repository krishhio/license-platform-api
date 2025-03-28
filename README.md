# License Platform Backend

Este proyecto es un backend construido con **Node.js**, **Express**, **MySQL** y **JWT** para manejar autenticación, gestión de usuarios, licencias y productos. Incluye funcionalidades como validación de sesiones, protección de rutas y envío de correos electrónicos para operaciones críticas.

## 📦 Requisitos

- Node.js (v16+)
- MySQL
- npm

## ⚙️ Instalación

1. Clona el repositorio o descomprime el proyecto.
2. Instala las dependencias:

```bash
npm install
```

3. Configura el archivo `.env` en la raíz del proyecto:

```env
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=license_platform
JWT_SECRET=una_clave_secreta_segura
MAIL_HOST=smtp.ejemplo.com
MAIL_PORT=587
MAIL_USER=tu_correo@example.com
MAIL_PASSWORD=tu_contraseña
```

4. Asegúrate de tener creada la base de datos con las siguientes tablas:
   - `user`
   - `license`
   - `product`

## 🚀 Ejecutar el servidor

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:5000`.

## 🔐 Autenticación

La autenticación se realiza por medio de tokens JWT. Debes incluir el header:

```http
Authorization: Bearer TU_TOKEN
```

en las rutas protegidas.

## 🔀 Rutas disponibles

### Auth
- `POST /api/auth/login`
- `POST /api/auth/reset-password` *(opcional a futuro)*

### Usuarios
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/users/change-password`

### Licencias
- `GET /api/licenses`
- `POST /api/licenses`
- `PUT /api/licenses/:id`
- `DELETE /api/licenses/:id`

### Productos
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## 🧪 Pruebas con `curl`

```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username": "admin", "password": "tu_password"}'
```

## 📝 Notas

- El sistema usa `bcrypt` para proteger contraseñas.
- Las rutas críticas requieren autenticación y rol admin.
- Nodemailer está configurado para notificaciones por correo, como el restablecimiento de contraseñas o cambios críticos.

---

Desarrollado  para una arquitectura escalable.
