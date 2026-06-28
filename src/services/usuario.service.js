import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';
import { usuarioDb } from "../db/usuario.db.js";


export const getAllUsuarios = async () => await usuarioDb.getAll();
export const getUsuarioById = async (id) => await usuarioDb.getById(id);


/* Crear nuevo usuario  */
export const createUsuario = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  userData.password = hashedPassword;
  
  return await usuarioDb.create(userData);
};

/* Actualizar datos de usuario */

export const updateUsuario = async (id, userData) => {
  if (userData.password && userData.password.trim() !== '') {
    userData.password = await bcrypt.hash(userData.password, 10);
  } else {
    delete userData.password; 
  }

  return await usuarioDb.update(id, userData);
};