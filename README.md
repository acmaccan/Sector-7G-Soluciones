# Talento Evolutivo S.A. - Backend API

API REST empresarial para gestión integral del proceso de liquidación de haberes. Sistema modular construido con arquitectura **MVC** que integra seguimiento administrativo de empresas, empleados, novedades, auditoría e indicadores operativos.

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Entidades del Sistema](#entidades-del-sistema)
- [Endpoints API](#endpoints-api)
- [Base de Datos](#base-de-datos)
- [Ejemplos de Uso](#ejemplos-de-uso)

## Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Runtime** | Node.js |
| **Framework Web** | Express.js |
| **Base de Datos** | MongoDB (Mongoose ODM) |
| **Autenticación** | bcrypt + express-session |
| **Control de Acceso** | Role-Based Access Control (RBAC) |
| **Serialización** | JSON |

## Arquitectura

Implementamos el patrón **MVC (Model-View-Controller)**:

```
├── routes/          → Definición de endpoints y ruteo
├── controllers/     → Manejo de requests/responses
├── services/        → Lógica de negocio y validaciones
├── models/          → Esquemas Mongoose (MongoDB)
├── db/              → Persistencia (MongoDB)
└── middleware/      → Autenticación, autorización, validaciones
```

### Flujo de Solicitud

```
Request → Route → Middleware (Auth/Validation) → Controller → Service → Model/DB → Response
```

## Requisitos Previos

- **Node.js**: v16+
- **npm** o **yarn**
- **MongoDB**: Instalado localmente para desarrollo
- **Variables de entorno**: `.env` configurado (ver `.env.example`)

## Instalación y Configuración

### 1. Clonar y navegar al proyecto

```bash
cd Sector-7G-Soluciones/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto `backend/`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB Local (Desarrollo)
MONGODB_URI=mongodb://localhost:27017/talento-evolutivo

# MongoDB Atlas (Producción) - Descomenta cuando sea necesario
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/talento-evolutivo?retryWrites=true&w=majority

# Sesión
SESSION_SECRET=tu_clave_secreta_aqui
```

### 4. MongoDB Local

**macOS (Homebrew):**
```bash
brew install mongodb-community@7
brew services start mongodb-community@7
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

**Windows:**
- Descargar [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Ejecutar el instalador
- MongoDB se levantará como servicio automáticamente

### 5. Seed inicial de datos

```bash
npm run seed
```

### 6. Iniciar el servidor

```bash
npm start
```

Base URL: `http://localhost:3000`

Health check:
```bash
curl http://localhost:3000/
```

## Entidades del Sistema

### 1. Empresa
- Representa la organización cliente
- **Campos clave**: `nombre`, `cuit` (único), `rubro`, `contacto`
- **Relaciones**: Múltiples `Empleados`, `Novedades`
- **Estado**: Baja lógica (`activo: boolean`)

### 2. Empleado
- Personal de la empresa
- **Campos clave**: `nombre`, `apellido`, `dni`, `puesto`, `email`, `empresaId`
- **Relaciones**: Pertenece a `Empresa`, múltiples `Novedades`
- **Estado**: Baja lógica

### 3. Novedad
- Eventos administrativos (licencias, cambios, etc.)
- **Campos clave**: `tipo`, `descripcion`, `fecha`, `estado`, `empresaId`, `empleadoId`
- **Estados válidos**: `pendiente`, `procesada`, `rechazada`
- **Relaciones**: Pertenece a `Empresa` y `Empleado`, múltiples `Seguimientos`

### 4. Seguimiento
- Trazabilidad de novedades
- **Campos clave**: `novedadId`, `fecha`, `responsable`, `comentario`
- **Relaciones**: Pertenece a `Novedad`

### 5. Auditoría
- Registro de cambios y eventos del sistema
- **Campos clave**: `entidad`, `accion`, `usuarioId`, `cambios`, `timestamp`
- **Acciones registradas**: `creacion`, `modificacion`, `baja_logica`, `cambio_estado`

### 6. Usuario
- Usuarios del sistema con roles diferenciados
- **Roles**: `admin`, `liquidador`, `cliente`
- **Seguridad**: Contraseñas hasheadas con bcrypt

## Endpoints API

### Empresas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/empresas` | Listar empresas (con filtro `?activo=true\|false`) |
| **GET** | `/api/empresas/:id` | Obtener empresa con empleados y novedades |
| **POST** | `/api/empresas` | Crear nueva empresa |
| **PUT** | `/api/empresas/:id` | Actualizar empresa |
| **DELETE** | `/api/empresas/:id` | Baja lógica |

**Body POST:**
```json
{
  "nombre": "Orion Software SA",
  "cuit": "30-70123456-7",
  "rubro": "Desarrollo de software",
  "contacto": "contacto@orionsoftware.com"
}
```

### Empleados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/empleados` | Listar empleados (filtros: `empresaId`, `activo`) |
| **GET** | `/api/empleados/:id` | Obtener empleado |
| **POST** | `/api/empleados` | Crear empleado |
| **PUT** | `/api/empleados/:id` | Actualizar empleado |
| **DELETE** | `/api/empleados/:id` | Baja lógica |

**Body POST:**
```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "dni": "40111222",
  "puesto": "Dev",
  "email": "juan@empresa.com",
  "empresaId": "ObjectId"
}
```

### Novedades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/novedades` | Listar novedades (filtros: `empresaId`, `estado`, `activo`) |
| **GET** | `/api/novedades/:id` | Obtener novedad con seguimientos |
| **POST** | `/api/novedades` | Crear novedad |
| **PUT** | `/api/novedades/:id` | Actualizar novedad |
| **DELETE** | `/api/novedades/:id` | Baja lógica |

**Body POST:**
```json
{
  "tipo": "Licencia",
  "descripcion": "Licencia por estudio",
  "fecha": "2026-04-15",
  "estado": "pendiente",
  "empresaId": "ObjectId",
  "empleadoId": "ObjectId"
}
```

### Seguimientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/seguimientos` | Listar seguimientos (filtros: `novedadId`, `empresaId`, `activo`) |
| **GET** | `/api/seguimientos/:id` | Obtener seguimiento |
| **POST** | `/api/seguimientos` | Crear seguimiento |
| **PUT** | `/api/seguimientos/:id` | Actualizar seguimiento |
| **DELETE** | `/api/seguimientos/:id` | Baja lógica |

### Auditoría

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/auditoria` | Listar registros de auditoría (filtros: `entidad`, `accion`) |

### Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/resumen` | Indicadores operativos (empresas, empleados, pendientes) |

## Base de Datos

### MongoDB - Desarrollo Local

Verificar que el servicio está activo:

```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
Get-Service MongoDB
```

Conectar con MongoDB Compass o shell:
```bash
mongosh mongodb://localhost:27017
```

### MongoDB - Producción (Atlas)

Cuando estés listo para desplegar:

1. Actualizar `.env`:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/talento-evolutivo?retryWrites=true&w=majority
```

2. El código se conectará automáticamente a MongoDB Atlas sin cambios adicionales.

### Modelos Mongoose

Todas las entidades usan Mongoose con validaciones nativas:
- Campos únicos (`CUIT`)
- Enumeraciones (`estado: enum`)
- Referencias entre colecciones (`populate`)
- Índices para optimización de queries

## Ejemplos de Uso

### Health Check
```bash
curl http://localhost:3000/
```

### Listar empresas activas
```bash
curl "http://localhost:3000/api/empresas?activo=true"
```

### Crear empresa
```bash
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tech Solutions",
    "cuit": "30-12345678-9",
    "rubro": "Consultoría IT",
    "contacto": "info@techsol.com"
  }'
```

### Obtener novedades pendientes
```bash
curl "http://localhost:3000/api/novedades?estado=pendiente&empresaId=<ObjectId>"
```

### Listar auditoría por entidad
```bash
curl "http://localhost:3000/api/auditoria?entidad=novedad&accion=cambio_estado"
```

### Obtener resumen operativo
```bash
curl http://localhost:3000/api/resumen
```

## Control de Acceso (RBAC)

El sistema implementa tres roles de usuario:

| Rol | Permisos |
|-----|----------|
| **admin** | Administración total, gestión de usuarios, auditoría |
| **liquidador** | CRUD completo en empresas, empleados, novedades, liquidaciones |
| **cliente** | Visualización restringida y enfocada |

Los permisos se validan en middleware antes de cada operación sensible.

## Convenciones del Proyecto

- **IDs MongoDB**: String `ObjectId` (automático)
- **Baja lógica**: Campo booleano `activo` o `activa`
- **Timestamps**: ISO 8601 (UTC)
- **Respuestas**: JSON estándar con `message` en errores
- **Status HTTP**: `200`, `201`, `400`, `404`, `500`

## Próximas Mejoras

- [ ] Sistema de alertas automáticas (Email con Nodemailer)
- [ ] Notificaciones por SMS/WhatsApp (Twilio)
- [ ] Colas de procesamiento asíncrono (BullMQ + Redis)
- [ ] Documentación OpenAPI/Swagger
- [ ] Tests automatizados (Jest/Mocha)

---

**Desarrollado para Talento Evolutivo S.A. - 2026**