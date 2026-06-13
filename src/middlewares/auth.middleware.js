export const MODULES_BY_ROLE = {
  admin: [
    { nombre: 'Empresas',      ruta: '/empresas',      desc: 'Gestión de clientes, rubros y estado de cuentas.' },
    { nombre: 'Empleados',     ruta: '/empleados',     desc: 'Directorio de personal, datos de contacto y asignaciones.' },
    { nombre: 'Novedades',     ruta: '/novedades',     desc: 'Carga de novedades con filtros y seguimientos detallados.' },
    { nombre: 'Seguimientos',  ruta: '/seguimientos',  desc: 'Control y bitácora de estados de trámites y procesos.' },
    { nombre: 'Liquidaciones', ruta: '/liquidaciones', desc: 'Cálculo de haberes, recibos y detalles de liquidación.' },
    { nombre: 'Socios',        ruta: '/socios',        desc: 'Administración del directorio de socios y participaciones.' },
    { nombre: 'Reportes',      ruta: '/resumen',       desc: 'Indicadores clave, resúmenes y tablas de impacto visual.' },
    { nombre: 'Auditoría',     ruta: '/auditoria',     desc: 'Registro histórico de acciones y trazabilidad del sistema.' },
  ],
  liquidador: [
    { nombre: 'Empresas',      ruta: '/empresas',      desc: 'Gestión de clientes, rubros y estado de cuentas.' },
    { nombre: 'Empleados',     ruta: '/empleados',     desc: 'Directorio de personal, datos de contacto y asignaciones.' },
    { nombre: 'Novedades',     ruta: '/novedades',     desc: 'Carga de novedades con filtros y seguimientos detallados.' },
    { nombre: 'Seguimientos',  ruta: '/seguimientos',  desc: 'Control y bitácora de estados de trámites y procesos.' },
    { nombre: 'Liquidaciones', ruta: '/liquidaciones', desc: 'Cálculo de haberes, recibos y detalles de liquidación.' },
  ],
  cliente: [],
};

/**
 * Expone el usuario de sesión como variable local en todas las vistas.
 * Permite que Pug muestre/oculte opciones según el rol.
 */
export const setLocals = (req, res, next) => {
  const usuario = req.session?.usuario ?? null;
  res.locals.usuarioSesion = usuario;
  res.locals.modulesByRole = MODULES_BY_ROLE[usuario?.rol] ?? MODULES_BY_ROLE.admin;
  next();
};

/**
 * Middleware de autenticación
 * Protege rutas verificando que exista una sesión activa.
 */
export const requireAuth = (req, res, next) => {
  if (!req.session?.usuario) {
    return res.redirect('/login');
  }
  next();
};

/**
 * Middleware de autorización por rol.
 * Acepta uno o más roles permitidos.
 * Si el usuario no tiene ninguno de los roles indicados, responde con 403.
 */
export const requireRoles = (...roles) => (req, res, next) => {
  const rol = req.session?.usuario?.rol;
  if (!roles.includes(rol)) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(403).json({
        error: true,
        statusCode: 403,
        message: 'No tenés permisos para acceder a esta sección.',
      });
    }
    return res.redirect('/');
  }
  next();
};


