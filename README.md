# 📘 API Documentation – License Platform

## 🧾 Índice
- [Autenticación](#🔐-autenticación)
- [Usuarios](#👤-usuarios)
- [Licencias](#🎫-licencias)
- [Productos](#📦-productos)

---

## 🔐 Autenticación

### 🔹 Login
- **POST** `/api/auth/login`
- **Body JSON:**
```json
{
  "username": "admin",
  "password": "123456"
}
```
- **Respuesta:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 👤 Usuarios

> Todas las rutas requieren Token (verificado por middleware `verifyToken`). Algunas requieren rol `admin`.

### 🔹 Obtener todos los usuarios
- **GET** `/api/users`
- **Requiere rol:** `admin`

### 🔹 Crear nuevo usuario
- **POST** `/api/users`
- **Requiere rol:** `admin`
- **Body:**
```json
{
  "username": "nuevo",
  "email": "nuevo@ejemplo.com",
  "password": "123456",
  "role": "user"
}
```

### 🔹 Cambiar contraseña
- **POST** `/api/users/change-password`
- **Requiere Token (usuario autenticado)**
- **Body:**
```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

### 🔹 Actualizar usuario
- **PUT** `/api/users/:id`
- **Requiere rol:** `admin`

### 🔹 Eliminar usuario
- **DELETE** `/api/users/:id`
- **Requiere rol:** `admin`

---

## 📦 Licenses API

La API de licencias permite crear, actualizar y consultar licencias que están asociadas a múltiples productos y múltiples códigos de hardware. Esto es útil para validar licencias en diferentes dispositivos.

### 🔐 Autenticación
Algunas rutas requieren token JWT (roles admin). Las rutas públicas como `/search` permiten verificación desde dispositivos externos.

---

### 🔹 Obtener todas las licencias
- **GET** `/api/licenses/`
- **Headers:** `Authorization: Bearer <token>`
- **Rol requerido:** `admin`
- **Respuesta:** Lista de licencias con productos y hardware asociados.

---

### 🔹 Buscar licencia (pública)
- **GET** `/api/licenses/search?license_key=LIC123`
- **GET** `/api/licenses/search?hardware_code=HW-ABC-456`
- **Rol requerido:** ninguno
- **Respuesta:** Información de la licencia si se encuentra.

---

### 🔹 Obtener licencia por ID
- **GET** `/api/licenses/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Rol requerido:** `admin`

---

### 🔹 Crear nueva licencia
- **POST** `/api/licenses/`
- **Headers:** `Authorization: Bearer <token>`
- **Rol requerido:** `admin`
- **Body (JSON):**
```json
{
  "license_key": "LIC-123-XYZ",
  "expiration_date": "2025-12-31",
  "products": [1, 2],
  "hardware_codes": ["HW-001", "HW-002"]
}
```

---

### 🔹 Editar licencia
- **PUT** `/api/licenses/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Rol requerido:** `admin`
- **Body (JSON):** Igual que en la creación.

---

### 🔹 Eliminar licencia
- **DELETE** `/api/licenses/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Rol requerido:** `admin`

---

### 🧪 Pruebas recomendadas (Postman o similar)
1. ✅ Crear una nueva licencia con productos y hardware.
2. ✅ Buscar licencia por `license_key` o `hardware_code` sin JWT.
3. ✅ Obtener lista de licencias (requiere token).
4. ✅ Editar licencia existente y verificar cambios.
5. ✅ Eliminar licencia y verificar que no se encuentre.

---

## 📦 Productos

> Todas las rutas requieren token. Solo `admin` puede crear, editar o eliminar.

### 🔹 Obtener todos los productos
- **GET** `/api/products`
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer TU_TOKEN"
```

### 🔹 Crear un producto
- **POST** `/api/products`
- **Requiere rol:** `admin`
```json
{
  "name": "Cámara FullHD",
  "description": "Cámara de vigilancia con visión nocturna",
  "price": 199.99
}
```

### 🔹 Actualizar producto
- **PUT** `/api/products/:id`
- **Requiere rol:** `admin`

### 🔹 Eliminar producto
- **DELETE** `/api/products/:id`
- **Requiere rol:** `admin`
