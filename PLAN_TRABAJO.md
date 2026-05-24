# PLAN DE TRABAJO - Sector 7G - CRUD Talento Evolutivo S.A.

## Consigna
Desarrollo de un CRUD con interacciones entre módulos.

**Contexto general**

Un CRUD (Create, Read, Update, Delete) permite gestionar datos de manera básica. En sistemas más completos, los diferentes módulos CRUD pueden interactuar entre sí, formando relaciones que reflejan procesos de negocio más complejos.

**Ejemplo de interacción genérica:**
  - Un pedido pertenece a un cliente y puede contener varios productos.
  - Una reserva se asocia a un usuario y a un servicio.
  - Un empleado puede estar asignado a varias tareas o proyectos.

**Requerimientos funcionales genéricos con interacciones**

- A. Crear registro
  - Cada módulo debe poder crear registros propios (Ej: cliente, producto, pedido, etc.).
  - Algunos registros pueden requerir referencias a otros módulos:
    - Al crear un pedido, se debe seleccionar un cliente existente y productos disponibles.
  - Validar que los datos obligatorios estén completos y que las referencias a otros módulos sean válidas.
- B. Leer registros
  - Se puede listar información de un módulo incluyendo datos relacionados de otros módulos:
    - Mostrar un pedido junto con el nombre del cliente y la lista de productos.
    - Mostrar una reserva con el usuario y el servicio asociado.
- C. Actualizar registro
  - Permitir modificar datos propios y referencias a otros módulos:
    - Cambiar productos de un pedido.
    - Reasignar una reserva/pago/servicio/otros a otro usuario.
  - Verificar que las referencias actualizadas existan.
- D. Eliminar registro
  - Al eliminar un registro, considerar dependencias entre módulos:
    - No eliminar un cliente que tenga pedidos activos. Tener en cuenta que a veces no es eliminar sino bloquear, desactivar, etc.
    - Permitir eliminar un producto solo si no está en ningún pedido activo.

**Flujo de trabajo genérico con interacciones**
1.	Alta de registro: Se crea un registro, con referencias a otros módulos si aplica.
2.	Consulta de registros: Se visualizan los registros y, opcionalmente, información relacionada de otros módulos.
3.	Modificación del registro: Se actualiza la información y relaciones con otros módulos.
4.	Baja del registro: Se elimina un registro, verificando que no existan dependencias críticas.

Este flujo refleja cómo un sistema real maneja múltiples entidades relacionadas, evitando inconsistencias y permitiendo un control integral de las operaciones del negocio.

**Se evaluará**
- Mantener cada módulo CRUD que sea mantenible
- Enseñar buenas prácticas:
  - Validación de datos.
  - Manejo de errores si las referencias no existen.
- Separación modular: cada CRUD en su propio archivo (modelo, controlador, rutas).
- Esta estructura prepara a los estudiantes para manejar bases de datos relacionales o NoSQL más adelante.
- Todo el equipo deberá hacer una breve grabación con el funcionamiento y explicación de 10 minutos.

---

### **Caso 1: Consultora HR "Talento Evolutivo S.A."**

Se propone desarrollar un sistema para la consultora Talento Evolutivo S.A., dedicada a la gestión de liquidación de haberes para más de 50 empresas clientes, que actualmente presenta problemas derivados de la dispersión de la información, el uso de planillas manuales y la falta de indicadores estratégicos para la toma de decisiones. 
El objetivo del trabajo es diseñar e implementar un sistema que permita registrar empresas, empleados, novedades laborales, liquidaciones y socios, organizar la información del proceso de novedades, detectar errores frecuentes del circuito administrativo y generar un resumen con información relevante para la toma de decisiones institucionales.
El sistema deberá registrar el estado de las novedades (pendiente, procesada o rechazada), permitir la consulta de información filtrada por empresa o por estado, simular el impacto organizacional e incorporar un módulo de auditoría. Además, deberá generarse un resumen que muestre indicadores básicos como la cantidad de empresas activas, novedades pendientes y carga operativa estimada.
El sistema deberá organizarse siguiendo una arquitectura modular, validar datos obligatorios evitando registros incompletos o inconsistentes, responder utilizando códigos HTTP adecuados y diseñarse con criterios de mantenibilidad y escalabilidad. **El sistema deberá contar con un frontend de vistas server-side utilizando Pug**, integrando los módulos mediante formularios y listados que consuman los servicios ya implementados. La implementación deberá reflejar buenas prácticas de desarrollo orientadas a la construcción de sistemas reales y sostenibles en entornos organizacionales complejos. 

---

### **Sebastián Sosa** (`Animas-Ss`):

- [x] Revisión del README principal (`README.md`)
- [x] Estructura base de autenticación: `auth.routes.js`, `auth.controllers.js`, `auth.services.js`, `auth.models.js` (esqueleto)
- [x] Simplificación de `index.js` (configuración básica sin middleware de errores)
- [x] Archivos placeholder (`index.txt`) en `config/`, `libs/`, `middlewares/`, `interfaces/`
- [x] Configurar Pug en Express (`app.set('view engine', 'pug')`, carpeta `views/`)

---

### **Florencia Marcazzo** (`Floh2023`):

- [x] Arquitectura completa del backend (primer commit en `dev`)
- [x] Módulo Empresa: modelo, controller, service, db, rutas con validaciones
- [x] Módulo Empleado: modelo, controller, service, db, rutas con validaciones cruzadas
- [x] Módulo Novedad: modelo, controller, service, db, rutas, validación de estados y relación empleado-empresa
- [x] Módulo Seguimiento: modelo, controller, service, db, rutas
- [x] Módulo Auditoría: model, service, controller, rutas (registra creación, modificación, baja lógica, cambio de estado)
- [x] Módulo Reporte: service, controller, rutas (`/resumen` con indicadores y simulación de impacto)
- [x] Capa de persistencia en JSON: `json.store.js` con `getAll`, `getById`, `create`, `update`, `remove` (soft delete)
- [x] Middlewares: `error.middleware.js` (manejo centralizado de errores) y `validation.middleware.js` (`requireFields`, `requireBody`)
- [x] Libs: `errors.js` (`AppError`, `badRequest`, `notFound`), `asyncHandler.js`, `time.js`
- [x] Configuración centralizada: `app.config.js` (`PORT`, `DATA_DIR`, `NOVEDAD_ESTADOS`)
- [x] Datos semilla: `empresas.json`, `empleados.json`, `novedades.json`, `seguimiento.json`, `auditoria.json`
- [x] Documentación del API en `backend/README.md` (endpoints, ejemplos curl, arquitectura)

---

### **Andrea Maccan** (`amaccan`):

- [x] Módulo Liquidaciones: modelo, controller, service, db, rutas con validaciones cruzadas (empresa y empleado activos y relacionados)
- [x] Registrar auditoría en creación, modificación y baja lógica de liquidaciones
- [x] Módulo Socios: modelo, controller, service, db, rutas con validaciones (DNI único, participación entre 1 y 100)
- [x] Registrar auditoría en creación, modificación y baja lógica de socios
- [x] Documentación OpenAPI 3.0: `docs/liquidaciones.yaml`, `docs/socios.yaml`, `docs/index.yaml` + bundle script (`npm run docs:bundle`)

---

### **Cecilia Gómez** (`cesugomez`):

- [x] Layout base (`views/layout.pug`): navbar con links a todos los módulos, bloque de contenido
- [x] Vista inicio (`views/index.pug`): bienvenida con links a cada sección
- [x] Vistas de Empresas: `views/empresas/index.pug`, `detalle.pug`, `form.pug`
- [x] Vistas de Empleados: `views/empleados/index.pug`, `detalle.pug`, `form.pug`
- [x] Vistas de Novedades: `views/novedades/index.pug` (con filtros), `detalle.pug` (con seguimientos), `form.pug`
- [x] Vistas de Seguimiento: `views/seguimiento/index.pug`, `form.pug`
- [x] Vistas de Liquidaciones: `views/liquidaciones/index.pug`, `detalle.pug`, `form.pug`
- [x] Vistas de Socios: `views/socios/index.pug`, `detalle.pug`, `form.pug`
- [x] Vista de Auditoría: `views/auditoria/index.pug` (con filtros)
- [x] Vista de Reporte/Resumen: `views/reporte/resumen.pug` (indicadores y tabla de impacto)
- [x] Actualizar todos los controllers para renderizar vistas Pug en lugar de responder JSON

---

### **Guillermo Aybar** (`GuilleGearts`):

- [x] QA: Probar todos los endpoints y vistas con casos válidos e inválidos (Happy/Sad Path)
- [x] QA: Verificar validaciones cruzadas (Empresa → Empleado → Novedad → Seguimiento)
- [x] **Documentación OpenAPI:** Generación de archivos YAML para todos los módulos (Empresas, Empleados, Novedades, Seguimientos, Reportes)
- [x] **Documentación OpenAPI:** Consolidación en `index.yaml` y esquema de errores estandarizado
- [x] **Coordinación de Entrega:** Creación de guion detallado por clips para la grabación del video
- [x] Coordinar y editar el video grupal de 10 minutos (En proceso)

---

## VIDEO - Responsabilidad Grupal (10 minutos)

- [x] Grabar demostración del flujo completo:
  - Crear empresa → Registrar empleados → Registrar novedades → Ver seguimiento → Ver reportes
- [x] Mostrar: Estados de novedades (Pendiente → Procesada → Rechazada)
- [x] Mostrar: Integración entre módulos (empresa-empleado-novedad-liquidación-socios)
- [x] Mostrar: Auditoría registrando todos los cambios
- [x] Explicar: Arquitectura modular y buenas prácticas
- [x] Explicar: Manejo de errores y validaciones
- [x] Editar video (máximo 10 minutos)
- [x] Publicar/compartir

---

## ACCIONABLES CLAVE POR MÓDULO — Primera Entrega

- [x] EMPRESA
- [x] EMPLEADO
- [x] NOVEDAD
- [x] SEGUIMIENTO
- [x] AUDITORÍA
- [x] REPORTE
- [x] LIQUIDACIÓN
- [x] SOCIOS
- [x] QA/VALIDACIÓN

---

## DISTRIBUCIÓN FINAL — Primera Entrega

| Integrante | Módulos | Estado |
|------------|---------|--------|
| Sebastián Sosa | Auth (base), README, Setup Pug | Completado |
| Florencia Marcazzo | Empresa, Empleado, Novedad, Seguimiento, Auditoría, Reporte | Completado |
| Andrea Maccan | Liquidaciones + Socios | Completado |
| Cecilia Gómez | Todas las vistas Pug (todos los módulos) | Completado |
| Guillermo Aybar | QA + Integración + Video | Completado |

---

---

---

# SEGUNDA ENTREGA — Integración con MongoDB y Mongoose

## Contexto de la segunda entrega

La segunda entrega profundiza los contenidos de la materia incorporando **persistencia real con MongoDB** mediante **Mongoose**. El proyecto mantiene la arquitectura modular existente (rutas → controladores → servicios → modelos), pero se reemplaza la capa de persistencia en JSON (`json.store.js` y archivos `*.db.js`) por **schemas y modelos de Mongoose** que interactúan con una base de datos MongoDB local o en la nube (MongoDB Atlas).

### Cambios principales respecto a la Primera Entrega

| Área | Primera Entrega | Segunda Entrega |
|------|-----------------|-----------------|
| Persistencia | Archivos JSON (`data/*.json`) | MongoDB con Mongoose |
| Capa de datos | `json.store.js` + `*.db.js` | Modelos Mongoose (`*.model.js`) |
| IDs | UUIDs manuales o índices | `ObjectId` de MongoDB |
| Relaciones | Referencias por ID en JSON | Referencias con `ref` y `populate()` |
| Conexión DB | — | `mongoose.connect()` en `app.config.js` |
| Variables de entorno | `PORT` | `PORT`, `MONGODB_URI` |

---

## Tareas de la Segunda Entrega por integrante

---

### **Florencia Marcazzo** (`Floh2023`) — Setup MongoDB + Schemas: Empresa, Empleado

#### Setup y configuración
- [X] Instalar dependencias: `mongoose`, `bcrypt`, `express-session` (`npm install mongoose bcrypt express-session`)
- [X] Crear archivo `.env` con las variables necesarias:
  ```
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017/talento-evolutivo
  SESSION_SECRET=una_clave_secreta_larga
  ```
- [X] Crear archivo `.env.example` con las mismas variables pero sin valores sensibles
- [X] Agregar `.env` al `.gitignore`
- [X] Actualizar `src/config/app.config.js`: leer variables de entorno, exportar función `connectDB()` con `mongoose.connect()`
- [X] Actualizar `src/index.js`: llamar a `connectDB()` al iniciar, registrar `express-session` como middleware global
- [X] Agregar script `"seed": "node src/db/seed.js"` en `package.json`
- [X] Actualizar `README.md` con instrucciones de instalación de MongoDB local y uso del seed
- [ ] Eliminar `src/db/json.store.js` (ya no se usa en ningún módulo)

> **Requisito previo para todo el equipo:** cada integrante debe tener instalado **MongoDB Community Server** ([mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)) con el servicio corriendo. Se recomienda **MongoDB Compass** para visualizar datos (útil para el video).

#### Schemas y persistencia
- [X] Crear `src/models/empresa.js`: `nombre`, `cuit`, `activa`, `convenio` (enum: `'general'`, `'docente'`, `'sanidad'`, `'comercio'`, `'otro'`), `fechaCierrePeriodo` (Number 1–28), `fechaAlta`, `timestamps`
- [X] Crear `src/models/empleado.js`: `nombre`, `apellido`, `dni`, `empresaId` (`ref: 'Empresa'`), `activo`, `timestamps`
- [X] Reescribir `src/db/empresa.db.js` con Mongoose (`find`, `findById`, `save`, `findByIdAndUpdate`)
- [X] Reescribir `src/db/empleado.db.js` con Mongoose, usando `populate('empresaId')`

#### Vistas
- [X] Actualizar `views/empresas/form.pug`: agregar selector de `convenio` y campo `fechaCierrePeriodo`
- [X] Actualizar `views/empresas/detalle.pug` e `index.pug`: mostrar `convenio` y `fechaCierrePeriodo`
- [X] Actualizar `views/empleados/`: usar `empleado._id`, mostrar `empleado.empresaId.nombre` (populate)

#### Seed (estructura base + sección propia)
- [X] Crear `src/db/seed.js` con la estructura base (conexión, limpieza, orden de carga)
- [X] Agregar datos de prueba: **empresas** (4–5 con distintos convenios) y **empleados** (6–8 distribuidos)

**Entregables clave:**
- `src/config/app.config.js` con `connectDB()`, `.env.example`, `.gitignore` actualizados
- 2 schemas Mongoose (`empresa`, `empleado`) + 2 `db.js` reescritos
- Vistas de empresas y empleados actualizadas
- `src/db/seed.js` con estructura base

---

### **Sebastián Sosa** (`Animas-Ss`) — Schemas: Novedad, Seguimiento + Vistas novedades/seguimientos

#### Schemas y persistencia
- [ ] Crear `src/models/novedad.js`: `empleadoId` (`ref: 'Empleado'`), `empresaId` (`ref: 'Empresa'`), `tipo`, `estado` (enum: `'pendiente'`, `'procesada'`, `'rechazada'`), `descripcion`, `timestamps`
- [ ] Crear `src/models/seguimiento.js`: `novedadId` (`ref: 'Novedad'`), `estado`, `observacion`, `timestamps`
- [ ] Reescribir `src/db/novedad.db.js` con Mongoose, usando `populate('empleadoId empresaId')`
- [ ] Reescribir `src/db/seguimiento.db.js` con Mongoose, usando `populate('novedadId')`

#### Vistas
- [ ] Actualizar `views/novedades/`: usar `._id`, mostrar nombre de empleado y empresa desde populate, verificar filtros por estado
- [ ] Actualizar `views/seguimientos/`: usar `._id`, mostrar datos de novedad desde populate

#### Seed (sección propia)
- [ ] Agregar al `seed.js` datos de prueba: **novedades** (5–6 en distintos estados) y **seguimientos** (3–4)

**Entregables clave:**
- 2 schemas Mongoose (`novedad`, `seguimiento`) + 2 `db.js` reescritos
- Vistas de novedades y seguimientos actualizadas
- Sección del seed completa

---

### **Andrea Maccan** (`amaccan`) — Autenticación completa (bcrypt + express-session)

#### Schema y persistencia
- [x] Crear `src/models/usuario.js`: `usuario` (único), `password` (hasheado con bcrypt), `rol` (enum: `'admin'`, `'operador'`, `'cliente'`), `timestamps`

#### Lógica de autenticación
- [x] Completar `src/services/auth.service.js`:
  - `login(usuario, password)`: busca en DB, compara con `bcrypt.compare()`, retorna el usuario o lanza error
  - `logout()`: destruye la sesión
- [x] Completar `src/controllers/view/auth.controller.js`:
  - `GET /login`: renderiza `views/auth/login.pug`
  - `POST /login`: llama al service, guarda `req.session.usuario`, redirige a `/`
  - `POST /logout`: destruye sesión, redirige a `/login`
- [x] Completar `src/routes/auth.routes.js`: montar rutas de login/logout
- [ ] Crear `src/controllers/view/usuario.controller.js`:
  - `GET /usuarios/nuevo`: renderiza formulario de alta (solo admin)
  - `POST /usuarios`: crea usuario con password hasheado con `bcrypt.hash()`

#### Middleware y protección de rutas
- [x] Crear `src/middlewares/auth.middleware.js`:
  - `requireAuth`: verifica `req.session.usuario`, redirige a `/login` si no hay sesión
  - `requireAdmin`: verifica `req.session.usuario.rol === 'admin'`, retorna 403 si no
- [x] Aplicar `requireAuth` en `src/routes/index.routes.js` para proteger todas las rutas
- [x] Pasar `req.session.usuario` como variable local a las vistas en un middleware global (para que Pug muestre/oculte opciones según rol)

#### Vistas de auth
- [x] Crear `views/auth/login.pug`: formulario usuario/password, mensaje de error si credenciales incorrectas
- [x] Agregar link de **Logout** en `views/layout.pug` (visible solo si hay sesión activa)
- [ ] Crear `views/usuarios/form.pug`: formulario de alta de usuario con selector de rol (solo accesible para admin)

#### Seed (sección propia)
- [x] Agregar al `seed.js`: usuario **admin** y usuario **operador** con passwords hasheados con `bcrypt`

**Entregables clave:**
- `src/models/usuario.js` + `auth.service.js`, `auth.controller.js`, `auth.routes.js` completos
- `auth.middleware.js` con `requireAuth` y `requireAdmin`
- Vistas `login.pug`, `layout.pug` (logout), `usuarios/form.pug`
- Sección del seed con usuarios

---

### **Cecilia Gómez** (`cesugomez`) — Schemas: Liquidación, Socio + Vistas liquidaciones/socios + ajuste ObjectId global

#### Schemas y persistencia
- [ ] Crear `src/models/liquidacion.js`: `empleadoId` (`ref: 'Empleado'`), `empresaId` (`ref: 'Empresa'`), `periodo`, `totalBruto`, `totalNeto`, `activa`, `timestamps`
- [ ] Crear `src/models/socio.js`: `nombre`, `apellido`, `dni` (único), `participacion` (1–100), `activo`, `timestamps`
- [ ] Reescribir `src/db/liquidacion.db.js` con Mongoose, validaciones cruzadas con `findById`
- [ ] Reescribir `src/db/socio.db.js` con Mongoose (índice único en `dni`)

#### Vistas
- [ ] Actualizar `views/liquidaciones/`: usar `._id`, mostrar referencias populadas de empleado y empresa
- [ ] Actualizar `views/socios/`: usar `._id`
- [ ] Revisar `views/auditoria/` y `views/reporte/resumen.pug`: verificar IDs y campos
- [ ] Probar el flujo visual completo en el navegador una vez que todos los `db.js` estén migrados

#### Seed (sección propia)
- [ ] Agregar al `seed.js` datos de prueba: **liquidaciones** (3–4) y **socios** (3–4)

**Entregables clave:**
- 2 schemas Mongoose (`liquidacion`, `socio`) + 2 `db.js` reescritos
- Vistas de liquidaciones y socios actualizadas
- Sección del seed completa

---

### **Guillermo Aybar** (`GuilleGearts`) — Schema: Auditoría + Middleware de errores + QA + Docs + Video

#### Schema y persistencia
- [x] Crear `src/models/auditoria.js`: `entidad`, `entidadId`, `accion`, `detalle`, `timestamps`
- [x] Reescribir `src/db/auditoria.db.js` con Mongoose (sin populate, solo escritura/lectura)
- [x] Actualizar `src/services/reporte.service.js`: reemplazar lecturas JSON por `countDocuments()` y queries Mongoose

#### Middleware de errores Mongoose
- [x] Actualizar `src/middlewares/error.middleware.js` para capturar y convertir:
  - `ValidationError` de Mongoose → HTTP 400 con mensaje legible
  - `CastError` (ObjectId inválido) → HTTP 400 con mensaje "ID inválido"
  - `MongoServerError` código 11000 (clave duplicada) → HTTP 409 "Ya existe un registro con ese valor"

#### QA
- [x] **Happy Path completo:** login → crear empresa → empleado → novedad → seguimiento → liquidación → logout
- [x] **Sad Path — auth:** login con credenciales incorrectas, acceso a ruta protegida sin sesión, acceso a ruta admin con rol operador
- [x] **Sad Path — datos:** `empresaId` inexistente, novedad con empleado de otra empresa, DNI duplicado en socio, `ObjectId` con formato inválido
- [x] Verificar que todos los errores retornan HTTP adecuado (nunca stack trace)

#### Documentación
- [x] Actualizar `docs/empresas.yaml`, `docs/empleados.yaml`, `docs/novedades.yaml`, `docs/seguimientos.yaml`, `docs/resumen.yaml`: IDs a `ObjectId`, agregar campo `convenio` en empresa
- [x] Actualizar `docs/index.yaml` con descripción de MongoDB y auth
- [x] Documentar en el README (sección **Requerimientos funcionales cubiertos**) las Mejoras 1, 2 y 3 del documento de propuestas
- [x] Documentar en el README (sección **Requerimientos futuros**) la Mejora 4 (alertas automáticas) con justificación técnica
- [x] Verificar bundle `npm run docs:bundle`

#### Video
- [ ] Coordinar grabación: cada integrante explica su parte (requisito de la consigna)
- [ ] Mostrar: conexión a MongoDB en Compass, login/logout, flujo completo, un error manejado correctamente
- [ ] Subir a YouTube/Drive con permisos de visualización habilitados

**Entregables clave:**
- Schema `auditoria` + `auditoria.db.js` reescrito + `reporte.service.js` funcional
- `error.middleware.js` actualizado para errores Mongoose
- Reporte de QA documentado (sección en el PDF de entrega)
- OpenAPI actualizado + README con requerimientos cubiertos/futuros
- Video grupal publicado y con enlace compartido

---

## Dependencias entre tareas (orden sugerido)

```
1. Florencia  →  Setup + connectDB + .env           (bloquea todo lo demás)
               + schemas empresa/empleado + db.js
               + seed base

2. Sebastián  →  schemas novedad/seguimiento +       (depende de empresa/empleado de Florencia)
               db.js + vistas novedades/seguimientos

3. Andrea    →  schema usuario + auth completo      (depende de connectDB de Florencia)
               (en paralelo con Sebastián)

4. Cecilia    →  schemas liquidacion/socio +         (depende de empresa/empleado de Florencia)
               db.js + vistas liquidaciones/socios

5. Guillermo  →  schema auditoria + db.js +          (puede arrancar en paralelo con Cecilia)
               error.middleware.js + QA + docs

6. TODOS      →  Video                              (última etapa)
```

---

## Checklist de entrega — Segunda Entrega

### Técnico
- [x] La app conecta a MongoDB al iniciar (log de confirmación en consola)
- [ ] Todos los módulos usan Mongoose (ninguno sigue usando `json.store.js`)
- [ ] Los endpoints de relaciones usan `populate()` correctamente
- [x] Los errores de Mongoose (`ValidationError`, `CastError`, clave duplicada) son manejados por el middleware
- [ ] El script `seed` carga datos de prueba correctamente (incluye usuarios admin y operador con passwords hasheados)
- [x] Las vistas Pug funcionan correctamente con `ObjectId`
- [x] Las rutas están protegidas por `requireAuth` (redirige a `/login` si no hay sesión)
- [x] El login con bcrypt funciona correctamente
- [x] El logout destruye la sesión y redirige a `/login`
- [x] La vista de login muestra mensaje de error ante credenciales incorrectas
- [ ] El alta de usuario solo es accesible para rol `admin`
- [x] Las empresas tienen campo `convenio` y `fechaCierrePeriodo`

### Documentación (PDF de entrega)
- [ ] Link al repositorio Git
- [ ] Diagrama de modelos/relaciones Mongoose (opcional pero valorado)
- [ ] Roles y responsabilidades actualizados para la segunda entrega
- [ ] Bibliografía utilizada (docs de Mongoose, MongoDB, tutoriales)
- [ ] Explicación del funcionamiento de la aplicación

### Video
- [ ] Cada integrante explica su participación
- [ ] Se muestra la conexión a MongoDB (Compass o log)
- [ ] Se muestra el flujo completo de la app
- [ ] Se muestra manejo de errores
- [ ] Enlace publicado con permisos de visualización

---

## Distribución Segunda Entrega

| Integrante | Tareas Segunda Entrega | Prioridad |
|------------|------------------------|-----------|
| Florencia Marcazzo | Setup MongoDB + schemas/db.js: `empresa`, `empleado` + vistas empresas/empleados + seed base | 🔴 Alta (bloquea todo) |
| Sebastián Sosa | Schemas/db.js: `novedad`, `seguimiento` + vistas novedades/seguimientos + seed | 🔴 Alta (depende del setup) |
| Andrea Maccan | Schema `usuario` + auth completo: bcrypt + session + middleware + controller + vistas login/usuario | 🔴 Alta (depende del setup) |
| Cecilia Gómez | Schemas/db.js: `liquidacion`, `socio` + vistas liquidaciones/socios + seed | 🟡 Media (depende de empresa/empleado) |
| Guillermo Aybar | Schema/db.js `auditoria` + reporte + `error.middleware.js` + QA + OpenAPI + docs + video | 🟡 Media (depende de todo) |

---

## TERCERA ENTREGA — Gestión de usuarios y control de acceso por roles

### Alcance propuesto (reservado para Entrega 3)

### Asignación

### **Responsable:** Andrea Maccan (`amaccan`) - Entregables esperados

- [ ] Pantalla y servicio de alta de usuarios.
- [ ] Acceso al alta de usuarios solo para roles `admin` u `operador`.
- [ ] Restringir todas las pantallas actuales para que solo puedan acceder `admin` u `operador`.
- [ ] Permitir acceso a la funcionalidad de novedades (crear, editar y detalle) para todos los roles. Especialmente para el rol `cliente`, que solo podrá ver sus propias novedades.

---

## ACUERDO DE EQUIPO - Uso de Ramas en Git

Cómo hacer que el trabajo en equipo sea fluido y sin conflictos con Git:

### ¿Cómo arranco?

Lo primero es traerte los últimos cambios para estar al día:

```bash
git checkout main
git pull origin main
```

Después, creás tu propia rama para trabajar tranquilo:

```bash
git checkout -b feature/lo-que-voy-a-hacer
```

### ¿Cómo guardo mi trabajo?

Cada vez que terminás algo (aunque sea pequeño), guardalo con un commit:

```bash
git add .
git commit -m "feat: descripción corta de lo que hice"
```

No hace falta que el mensaje sea perfecto, pero que se entienda qué hiciste

### ¿Cómo subo mis cambios?

Cuando ya terminaste y querés subir tu rama:

```bash
# Primero, traete los cambios nuevos de main por si alguien avanzó
git checkout main
git pull origin main
git checkout feature/lo-que-voy-a-hacer
git merge main   # si hay conflictos, se resuelven acá, en tu rama
# Después subís tu rama
git push origin feature/lo-que-voy-a-hacer
```

Y desde ahí abrís un Pull Request para que alguien revise antes de mergear a `main`.

### Nombres de ramas sugeridos

Usar esta nomenclatura ayuda a entender de qué trata cada rama:

| Prefijo | Cuándo usarlo |
|---------|---------------|
| `feature/` | Estás agregando algo nuevo |
| `fix/` | Estás corrigiendo algo que no andaba |
| `chore/` | Cambios de config, docs, limpieza |

### Mensajes de commit sugeridos

```
feat:   agregué algo nuevo
fix:    corregí un error
chore:  cambios de configuración o dependencias
docs:   cambios en documentación
style:  solo cambié formato, nada de lógica
```

### Consejos para no complicarse

- Hacé `git pull` antes de arrancar cada vez que te sentás a trabajar
- Tratá de no subir cambios directo a `main`, así todos pueden revisar antes
- Evitá el `git push --force` a menos que sepas bien lo que estás haciendo, puede pisar el trabajo de otros sin querer

