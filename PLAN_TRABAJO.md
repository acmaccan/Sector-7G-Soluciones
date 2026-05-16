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

### **Sebastián Sosa** (`Animas-Ss`) — Setup, conexión y migración de configuración

- [ ] Instalar dependencias: `mongoose`, `dotenv` (verificar versión)
- [ ] Crear archivo `.env` con `PORT` y `MONGODB_URI` (local y Atlas)
- [ ] Crear archivo `.env.example` para documentar las variables necesarias
- [ ] Actualizar `src/config/app.config.js`: leer `MONGODB_URI` desde `process.env`, exportar función `connectDB()`
- [ ] Actualizar `src/index.js`: llamar a `connectDB()` al iniciar la app con manejo de error (proceso termina si no conecta)
- [ ] Agregar script `"seed"` en `package.json` para poblar la base de datos con datos de prueba
- [ ] Actualizar el `README.md` principal con instrucciones de instalación y configuración de MongoDB

**Entregables clave:**
- `src/config/app.config.js` con `connectDB()`
- `.env.example`
- `src/index.js` actualizado
- `README.md` actualizado con sección de MongoDB

---

### **Florencia Marcazzo** (`Floh2023`) — Modelos Mongoose: Empresa, Empleado, Novedad, Seguimiento, Auditoría

- [ ] Crear `src/models/empresa.js` con schema Mongoose: `nombre`, `cuit`, `activa`, `fechaAlta`, `timestamps`
- [ ] Crear `src/models/empleado.js` con schema Mongoose: `nombre`, `apellido`, `dni`, `empresaId` (`ref: 'Empresa'`), `activo`, `timestamps`
- [ ] Crear `src/models/novedad.js` con schema Mongoose: `empleadoId` (`ref: 'Empleado'`), `empresaId` (`ref: 'Empresa'`), `tipo`, `estado` (enum), `descripcion`, `timestamps`
- [ ] Crear `src/models/seguimiento.js` con schema Mongoose: `novedadId` (`ref: 'Novedad'`), `estado`, `observacion`, `timestamps`
- [ ] Crear `src/models/auditoria.js` con schema Mongoose: `entidad`, `entidadId`, `accion`, `detalle`, `timestamps`
- [ ] Reescribir `src/db/empresa.db.js`: reemplazar operaciones JSON por métodos Mongoose (`find`, `findById`, `save`, `findByIdAndUpdate`)
- [ ] Reescribir `src/db/empleado.db.js` con Mongoose, usando `populate('empresaId')`
- [ ] Reescribir `src/db/novedad.db.js` con Mongoose, usando `populate('empleadoId empresaId')`
- [ ] Reescribir `src/db/seguimiento.db.js` con Mongoose, usando `populate('novedadId')`
- [ ] Reescribir `src/db/auditoria.db.js` con Mongoose
- [ ] Actualizar `src/services/reporte.service.js`: reemplazar lecturas de JSON por queries de agregación o `countDocuments()` de Mongoose
- [ ] Eliminar o deprecar `src/db/json.store.js` (ya no se usa)

**Entregables clave:**
- 5 modelos Mongoose actualizados
- 5 archivos `*.db.js` reescritos con Mongoose
- `reporte.service.js` funcional con MongoDB

---

### **Andrea Maccan** (`amaccan`) — Modelos Mongoose: Liquidaciones y Socios + Seed + Docs

- [ ] Crear `src/models/liquidacion.js` con schema Mongoose: `empleadoId` (`ref: 'Empleado'`), `empresaId` (`ref: 'Empresa'`), `periodo`, `totalBruto`, `totalNeto`, `activa`, `timestamps`
- [ ] Crear `src/models/socio.js` con schema Mongoose: `nombre`, `apellido`, `dni` (único), `participacion` (1–100), `activo`, `timestamps`
- [ ] Reescribir `src/db/liquidacion.db.js` con Mongoose, validaciones cruzadas con `findById`
- [ ] Reescribir `src/db/socio.db.js` con Mongoose (usar índice único en `dni`)
- [ ] Crear `src/db/seed.js`: script que inserta datos de prueba en todas las colecciones (orden: empresas → empleados → novedades → seguimientos → liquidaciones → socios)
- [ ] Actualizar `docs/liquidaciones.yaml`: ajustar tipos de ID a formato MongoDB (`ObjectId`) y ejemplos
- [ ] Actualizar `docs/socios.yaml`: idem
- [ ] Verificar que el bundle `docs/index.yaml` siga siendo válido con `npm run docs:bundle`

**Entregables clave:**
- 2 modelos Mongoose actualizados
- 2 archivos `*.db.js` reescritos
- `src/db/seed.js` funcional
- Documentación OpenAPI actualizada

---

### **Cecilia Gómez** (`cesugomez`) — Vistas Pug: ajustes para MongoDB + flujo completo

> Los IDs en MongoDB son `ObjectId` (cadenas de 24 caracteres hex). Los formularios y rutas que usan IDs deben ser revisados para este formato.

- [ ] Revisar todos los formularios Pug que usan IDs en `action` de `<form>`: cambiar cualquier ID numérico hardcodeado a referencias dinámicas con `item._id`
- [ ] Actualizar `views/empresas/`: asegurarse de que `detalle.pug` y `form.pug` usen `empresa._id` (no `empresa.id`)
- [ ] Actualizar `views/empleados/`: idem con `empleado._id`, mostrar nombre de empresa usando `empleado.empresaId.nombre` (populate)
- [ ] Actualizar `views/novedades/`: mostrar nombre de empleado y empresa desde los campos populados
- [ ] Actualizar `views/liquidaciones/`: mostrar referencias populadas de empleado y empresa
- [ ] Actualizar `views/socios/`, `views/seguimientos/`, `views/auditoria/`: revisar IDs y campos
- [ ] Verificar que los filtros en `views/novedades/index.pug` y `views/auditoria/index.pug` sigan funcionando con los nuevos queries Mongoose
- [ ] Verificar vista `views/reporte/resumen.pug`: adaptar si cambian los campos de `reporte.service.js`
- [ ] Probar el flujo visual completo: Crear empresa → Empleado → Novedad → Seguimiento → Liquidación en el navegador

**Entregables clave:**
- Todas las vistas actualizadas para `ObjectId`
- Flujo visual completo funcional contra MongoDB

---

### **Guillermo Aybar** (`GuilleGearts`) — QA, integración, documentación y video

- [ ] **QA — Happy Path con MongoDB:**
  - Crear empresa → empleado → novedad → seguimiento → liquidación → socio (flujo completo)
  - Verificar respuestas HTTP correctas (201, 200, 400, 404, etc.)
  - Verificar que `populate()` retorna datos correctos en los endpoints de listado y detalle
- [ ] **QA — Sad Path con MongoDB:**
  - Intentar crear empleado con `empresaId` inexistente (debe retornar 404)
  - Intentar crear novedad con empleado de otra empresa (debe retornar 400)
  - Crear socio con DNI duplicado (debe retornar error de validación Mongoose)
  - Enviar `ObjectId` con formato inválido (debe retornar 400, no 500)
- [ ] **QA — Manejo de errores Mongoose:** Verificar que `error.middleware.js` capture errores de tipo `ValidationError` y `CastError` de Mongoose y los convierta en respuestas HTTP legibles (no stack traces)
- [ ] Actualizar `docs/empleados.yaml`, `docs/empresas.yaml`, `docs/novedades.yaml`, `docs/seguimientos.yaml`, `docs/resumen.yaml`: ajustar IDs a formato `ObjectId`
- [ ] Actualizar `docs/index.yaml` con la nueva referencia a MongoDB en la descripción general
- [ ] **Video (responsabilidad compartida, coordinación a cargo de Guillermo):**
  - Mostrar la conexión a MongoDB en el código y en MongoDB Compass
  - Demostrar el flujo completo desde las vistas Pug
  - Mostrar un ejemplo de error Mongoose manejado correctamente
  - Cada integrante explica su parte (requisito de la consigna)
  - Subir a YouTube/Drive con permisos de visualización habilitados

**Entregables clave:**
- Reporte de QA documentado (puede ser sección en el PDF de entrega)
- Documentación OpenAPI actualizada
- Video grupal publicado y con enlace compartido

---

## Dependencias entre tareas (orden sugerido)

```
1. Sebastián  →  connectDB() + .env       (base para todo lo demás)
2. Florencia  →  Modelos Mongoose core    (empresa, empleado, novedad)
3. Andrea     →  Modelos Mongoose rest    (liquidacion, socio) + seed
4. Florencia  →  *.db.js reescritos       (depende de los modelos)
5. Andrea     →  *.db.js reescritos       (depende de los modelos)
6. Cecilia    →  Ajuste de vistas         (depende de db.js funcionales)
7. Guillermo  →  QA                       (depende de todo lo anterior)
8. TODOS      →  Video                    (última etapa)
```

---

## Checklist de entrega — Segunda Entrega

### Técnico
- [ ] La app conecta a MongoDB al iniciar (log de confirmación en consola)
- [ ] Todos los módulos usan Mongoose (ninguno sigue usando `json.store.js`)
- [ ] Los endpoints de relaciones usan `populate()` correctamente
- [ ] Los errores de Mongoose (ValidationError, CastError) son manejados por el middleware
- [ ] El script `seed` carga datos de prueba correctamente
- [ ] Las vistas Pug funcionan correctamente con `ObjectId`

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
| Sebastián Sosa | Setup MongoDB, connectDB, .env, README | 🔴 Alta (bloquea todo) |
| Florencia Marcazzo | Modelos + db.js: Empresa, Empleado, Novedad, Seguimiento, Auditoría, Reporte | 🔴 Alta |
| Andrea Maccan | Modelos + db.js: Liquidacion, Socio + Seed + Docs | 🔴 Alta |
| Cecilia Gómez | Ajuste vistas Pug para ObjectId + prueba flujo visual | 🟡 Media (depende de db.js) |
| Guillermo Aybar | QA MongoDB + Docs OpenAPI + coordinación video | 🟡 Media (depende de todo) |

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

---

## ACCIONABLES CLAVE POR MÓDULO

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

## DISTRIBUCIÓN FINAL

| Integrante | Módulos | % Completado | Accionables Pendientes |
|------------|---------|--------------|------------------------|
| Sebastián Sosa | Auth (base), README, Setup Pug | 80% | Configurar Pug en Express (prerrequisito para Cecilia) |
| Florencia Marcazzo | Empresa, Empleado, Novedad, Seguimiento, Auditoría, Reporte | 100% | — |
| Andrea Maccan | Liquidaciones + Socios | 100% | — |
| Cecilia Gómez | Todas las vistas Pug (todos los módulos) | 0% | Layout + inicio + 10 módulos de vistas + actualizar controllers |
| Guillermo Aybar | QA + Integración + Video | 0% | Testing endpoints y vistas + merge + video |
| **TODOS** | **VIDEO** | **0%** | Grabar y editar demostración |


