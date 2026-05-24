# Talento Evolutivo S.A. API (Backend)

API REST en Node.js + Express para seguimiento administrativo del proceso de liquidacion de haberes: empresas, empleados, novedades, seguimientos, auditoria e indicadores.

- Módulos base (`Empresa`, `Empleado`) persisten en MongoDB (Mongoose).
- El resto de módulos continúa con persistencia local JSON.

## Quickstart

Desde `Sector-7G-Soluciones/backend/`:

```bash
npm install
npm start
```

Base URL:

```text
http://localhost:3000
```

Health / root:

```bash
curl http://localhost:3000/
```

## MongoDB (local)

Requisitos:
- MongoDB corriendo en `mongodb://localhost:27017`

Instalación rápida:
- macOS (Homebrew): `brew install mongodb-community@7` y luego `brew services start mongodb-community@7`
- Linux: instalar `mongod` desde el repositorio oficial de MongoDB y levantar el servicio
- Windows: descargar (MongoDB Community Server) https://www.mongodb.com/try/download/community, instalar y ejecutar `mongod`

Variables de entorno:
- Crear `.env` (ver `.env.example`)

Seed (datos iniciales):

```bash
npm run seed
```

## Datos y persistencia

- MongoDB (Empresa/Empleado): IDs tipo `ObjectId` (string) y baja lógica (`activo=false` o `activa=false`)
- JSON (otros módulos): `src/db/data/*.json`

## Respuestas y errores

- Respuesta: JSON
- Codigos comunes: `200`, `201`, `400`, `404`, `500`
- Error tipico:

```json
{
  "message": "Detalle del error"
}
```

## Endpoints

### Empresas

**GET** `/api/empresas`

- Query params opcionales: `activo=true|false`
- Devuelve una vista enriquecida con `empleados` y `novedades` relacionadas.

**GET** `/api/empresas/:id`

- Devuelve una empresa por id, incluyendo `empleados` y `novedades`.

**POST** `/api/empresas`

- Body requerido:

```json
{
  "nombre": "Orion Software SA",
  "cuit": "30-70123456-7",
  "rubro": "Desarrollo de software",
  "contacto": "contacto@orionsoftware.com"
}
```

- Notas:
  - `cuit` debe ser unico (si existe devuelve `400`).

**PUT** `/api/empresas/:id`

- Body: al menos 1 campo.
- Campos aceptados: `nombre`, `cuit`, `rubro`, `contacto`

**DELETE** `/api/empresas/:id`

- Baja logica (marca `activo=false`).
- Restriccion: no permite baja si tiene empleados o novedades activas.

### Empleados

**GET** `/api/empleados`

- Query params opcionales: `empresaId=<number>`, `activo=true|false`

**GET** `/api/empleados/:id`

**POST** `/api/empleados`

- Body requerido:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "dni": "40111222",
  "puesto": "Dev",
  "email": "juan@empresa.com",
  "empresaId": 1
}
```

- Restriccion: `empresaId` debe existir y estar activa.

**PUT** `/api/empleados/:id`

- Body: al menos 1 campo.
- Campos aceptados: `nombre`, `apellido`, `dni`, `puesto`, `email`, `empresaId`

**DELETE** `/api/empleados/:id`

- Baja logica.
- Restriccion: no permite baja si tiene novedades activas asociadas.

### Novedades

**GET** `/api/novedades`

- Query params opcionales:
  - `empresaId=<number>`
  - `estado=pendiente|procesada|rechazada`
  - `activo=true|false`
- Devuelve una vista enriquecida con `empresa`, `empleado` y `seguimientos`.

**GET** `/api/novedades/:id`

**POST** `/api/novedades`

- Body requerido:

```json
{
  "tipo": "Licencia",
  "descripcion": "Licencia por estudio",
  "fecha": "2026-04-15",
  "empresaId": 1,
  "empleadoId": 1
}
```

- Notas:
  - `estado` opcional (si se envia, debe ser `pendiente|procesada|rechazada`).
  - Validacion cruzada: el empleado debe pertenecer a la empresa y ambos deben estar activos.

**PUT** `/api/novedades/:id`

- Body: al menos 1 campo.
- Campos aceptados: `tipo`, `descripcion`, `fecha`, `estado`, `empresaId`, `empleadoId`
- Si cambia `estado`, se registra auditoria de cambio de estado.

**DELETE** `/api/novedades/:id`

- Baja logica.
- Restriccion: no permite baja si tiene seguimientos activos.

### Seguimientos

**GET** `/api/seguimientos`

- Query params opcionales:
  - `empresaId=<number>` (filtra por empresa a traves de la novedad)
  - `novedadId=<number>`
  - `activo=true|false`
- Devuelve una vista enriquecida con `novedad`, `empleado` y `empresa`.

**GET** `/api/seguimientos/:id`

**POST** `/api/seguimientos`

- Body requerido:

```json
{
  "novedadId": 1,
  "fecha": "2026-04-15",
  "responsable": "Mesa operativa",
  "comentario": "Seguimiento inicial"
}
```

- Restriccion: `novedadId` debe existir y estar activa.

**PUT** `/api/seguimientos/:id`

- Body: al menos 1 campo.
- Campos aceptados: `novedadId`, `fecha`, `responsable`, `comentario`

**DELETE** `/api/seguimientos/:id`

- Baja logica.

### Reportes

**GET** `/resumen` o `/api/resumen`

- Devuelve indicadores operativos (empresas activas, empleados activos, pendientes, etc.).

### Auditoria

**GET** `/auditoria` o `/api/auditoria`

- Query params opcionales: `entidad=<string>`, `accion=<string>`
- Entidades comunes: `empresa`, `empleado`, `novedad`, `seguimiento`
- Acciones comunes: `creacion`, `modificacion`, `baja_logica`, `cambio_estado`

## Pruebas rapidas (curl)

```bash
curl http://localhost:3000/api/empresas/1
curl http://localhost:3000/api/novedades/1
curl "http://localhost:3000/api/novedades?empresaId=1&estado=pendiente"
curl "http://localhost:3000/api/auditoria?entidad=novedad"
```

## Arquitectura (breve)

- `routes`: endpoints
- `controllers`: request/response
- `services`: reglas de negocio y validaciones cruzadas
- `db`: acceso a MongoDB (Mongoose) y persistencia JSON híbrida

---

## Requerimientos Funcionales Cubiertos (Mejoras de la Segunda Entrega)

El sistema ha sido mejorado e integrado con persistencia robusta y mecanismos de seguridad avanzados:

1. **Uso de Bases de Datos en la Nube y Locales (MongoDB + Mongoose):**
   - Migración de las entidades principales (`Empresa`, `Empleado`, `Socio`, `Liquidación` y `Auditoría`) a MongoDB.
   - Definición de esquemas rigurosos mediante Mongoose, permitiendo validaciones nativas de campos (enums, valores mínimos/máximos, valores únicos) e integridad referencial (`ref` y `populate`).
   - Preparado para desplegarse fácilmente en **MongoDB Atlas** configurando la variable `MONGODB_URI` en el archivo `.env`.

2. **Soporte para Múltiples Roles de Usuarios (Control de Acceso):**
   - Implementación de tres roles de usuarios diferenciados:
     - `admin`: Permisos de administración total (incluyendo creación de usuarios y acceso a todas las secciones).
     - `operador`: Acceso a operaciones normales (empresas, empleados, novedades, liquidaciones).
     - `cliente`: Visualización restringida y enfocada.
   - Vistas dinámicas en Pug que adaptan la barra de navegación y las opciones del panel de control de acuerdo con el rol guardado en la sesión.

3. **Encriptación de Datos Sensibles y Seguridad:**
   - **Hasheo de Contraseñas:** Las contraseñas se almacenan de forma segura en la base de datos utilizando hasheo criptográfico unidireccional con **bcrypt** (factor de costo 10).
   - **Protección de Sesión:** Manejo de sesiones mediante cookies seguras y firmadas usando **express-session** para restringir el acceso a rutas protegidas (`requireAuth`).

---

## Requerimientos Futuros (Justificación Técnica)

### Mejora 4: Sistema de Alertas Automáticas (Email y SMS)
Como propuesta de expansión para la optimización de procesos de la consultora, se plantea el desarrollo de un **módulo de notificaciones en tiempo real** cuando se detecten eventos críticos (por ejemplo, novedades marcadas en estado "rechazada" o de prioridad "urgente").

* **Justificación de Negocio:**
  - Evita retrasos en el flujo administrativo de liquidaciones, notificando de inmediato al responsable o al empleado cuando una documentación es rechazada o requiere atención inmediata.
* **Implementación Técnica Propuesta:**
  - **Servicios de Terceros:**
    - **Nodemailer:** Utilizando un servicio SMTP (como Gmail, SendGrid o AWS SES) para el envío de notificaciones detalladas por correo electrónico con formatos HTML y adjuntos.
    - **Twilio (SMS/WhatsApp):** Para notificaciones de prioridad crítica enviadas directamente a los teléfonos móviles de los involucrados.
  - **Patrón de Eventos (Event-Driven Architecture):**
    - Se propone usar un emisor de eventos (`EventEmitter` nativo de Node.js) o colas de mensajería (como BullMQ con Redis) para procesar las notificaciones de forma asíncrona. Esto evita ralentizar el hilo principal de peticiones del servidor web cuando se realiza la inserción de registros.
