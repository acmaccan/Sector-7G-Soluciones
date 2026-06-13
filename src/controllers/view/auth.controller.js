import { login, logout } from '../../services/auth.service.js';

/**
 * GET /login
 * Renderiza el formulario de login.
 * Si ya hay sesión activa, redirige al inicio.
 */
export const getLogin = (req, res) => {
  if (req.session?.usuario) return res.redirect('/');
  res.render('auth/login', { titulo: 'Iniciar sesión', error: null });
};

/**
 * POST /login
 * Valida credenciales. Si son correctas, guarda el usuario en sesión y redirige.
 * Si no, vuelve a renderizar el formulario con mensaje de error.
 */
export const postLogin = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.render('auth/login', {
        titulo: 'Iniciar sesión',
        error: 'Completá todos los campos.',
      });
    }

    const usuarioDoc = await login(usuario, password);

    req.session.usuario = {
      _id: usuarioDoc._id,
      usuario: usuarioDoc.usuario,
      rol: usuarioDoc.rol,
      empresaId: usuarioDoc.empresaId ?? null,
    };

    res.redirect('/');
  } catch (err) {
    console.log(err)
    res.render('auth/login', {
      titulo: 'Iniciar sesión',
      error: 'Usuario o contraseña incorrectos.',
    });
  }
};

/**
 * POST /logout
 * Destruye la sesión y redirige al login.
 */
export const postLogout = async (req, res, next) => {
  try {
    await logout(req);
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};
