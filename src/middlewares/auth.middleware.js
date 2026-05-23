/**
 * Middleware de autenticación
 * Protege rutas verificando que exista una sesión activa.
 */

/**
 * Verifica que el usuario haya iniciado sesión.
 * Si no hay sesión, redirige a /login.
 */
export const requireAuth = (req, res, next) => {
  if (!req.session?.usuario) {
    return res.redirect('/login');
  }
  next();
};

/**
 * Verifica que el usuario autenticado tenga rol 'admin'.
 * Si no, responde con 403.
 */
export const requireAdmin = (req, res, next) => {
  if (req.session?.usuario?.rol !== 'admin') {
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

/**
 * Expone el usuario de sesión como variable local en todas las vistas.
 * Permite que Pug muestre/oculte opciones según el rol.
 * Registrar este middleware de forma global en index.js.
 */
export const setLocals = (req, res, next) => {
  res.locals.usuarioSesion = req.session?.usuario || null;
  next();
};
