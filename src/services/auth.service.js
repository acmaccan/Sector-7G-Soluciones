import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';

/**
 * Servicio de autenticación
 * Lógica de login/logout.
 */

/**
 * Busca el usuario en la DB y compara la contraseña.
 * @param {string} usuario - nombre de usuario
 * @param {string} password - contraseña en texto plano
 * @returns {Promise<Object>} el documento de usuario si las credenciales son válidas
 * @throws {Error} si el usuario no existe o la contraseña es incorrecta
 */
export const login = async (usuario, password) => {
  const usuarioDoc = await Usuario.findOne({ usuario });
  if (!usuarioDoc) throw new Error('Credenciales inválidas');

  const passwordOk = await bcrypt.compare(password, usuarioDoc.password);
  if (!passwordOk) throw new Error('Credenciales inválidas');

  return usuarioDoc;
};

/**
 * Destruye la sesión activa.
 * @param {import('express').Request} req
 * @returns {Promise<void>}
 */
export const logout = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
