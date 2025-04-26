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


# 📋 API de Hardware Codes - License Platform

Esta sección documenta los endpoints de la API para administrar los **Hardware Codes** en la plataforma de licenciamiento.

## 🔹 Endpoints disponibles

### 1. Crear Hardware Code
- **Método:** POST
- **URL:** `/api/hardware-codes`
- **Descripción:** Crea un nuevo código de hardware con su licencia asociada y descripción opcional.
- **Body (JSON):**
```json
{
  "license_id": 1,
  "code": "PC-00123",
  "description": "Laptop de ventas 01"
}
```
- **Respuesta Exitosa (201):**
```json
{
  "id": 7,
  "license_id": 1,
  "code": "PC-00123",
  "description": "Laptop de ventas 01"
}
```

---

### 2. Listar Hardware Codes
- **Método:** GET
- **URL:** `/api/hardware-codes`
- **Descripción:** Obtiene la lista completa de hardware codes registrados.
- **Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "license_id": 1,
    "code": "PC-00123",
    "description": "Laptop de ventas 01"
  },
  {
    "id": 2,
    "license_id": 2,
    "code": "PC-00124",
    "description": "Servidor de Oficina"
  }
]
```

---

### 3. Actualizar Descripción de Hardware Code
- **Método:** PUT
- **URL:** `/api/hardware-codes/{id}`
- **Descripción:** Actualiza únicamente la descripción de un código de hardware.
- **Body (JSON):**
```json
{
  "description": "Laptop Gerencia Actualizada"
}
```
- **Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "license_id": 1,
  "code": "PC-00123",
  "description": "Laptop Gerencia Actualizada"
}
```

---

### 4. Eliminar Hardware Code
- **Método:** DELETE
- **URL:** `/api/hardware-codes/{id}`
- **Descripción:** Elimina un código de hardware por ID.
- **Respuesta Exitosa (200):**
```json
{
  "message": "Hardware code deleted successfully"
}
```

---

## 🔹 Notas Importantes
- El campo `code` es **único** en la base de datos.
- `license_id` puede ser nulo si el hardware no ha sido asignado a una licencia todavía.
- Todos los endpoints requieren autenticación previa mediante JWT.

---

## 📋 Postman Collection
Pruebas disponibles:
1. Crear hardware code.
2. Listar hardware codes.
3. Actualizar descripción.
4. Eliminar hardware code.

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
