import { Usuario } from "../models/usuario.js";

const toPlainUsuario = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject({ virtuals: false });
  return { ...plain, id: String(plain._id) };
};

export const usuarioDb = {
  async getAll() {
    const rows = await Usuario.find().lean();
    return rows.map((row) => ({ ...row, id: String(row._id) }));
  },

  async getById(id) {
    const doc = await Usuario.findById(id);
    return toPlainUsuario(doc);
  },

  async create(entity) {
    const doc = await Usuario.create(entity);
    return toPlainUsuario(doc);
  },

  async update(id, changes) {
    const doc = await Usuario.findByIdAndUpdate(id, changes, { new: true });
    return toPlainUsuario(doc);
  }
};