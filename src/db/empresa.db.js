import { Empresa } from "../models/empresa.js";

const toPlainEmpresa = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject({ virtuals: false });
  return {
    ...plain,
    id: String(plain._id),
    activo: plain.activa,
  };
};

export const empresaDb = {
  async getAll() {
    const rows = await Empresa.find().lean();
    return rows.map((row) => ({ ...row, id: String(row._id), activo: row.activa }));
  },

  async getById(id) {
    const doc = await Empresa.findById(id);
    return toPlainEmpresa(doc);
  },

  async create(entity) {
    const doc = await Empresa.create(entity);
    return toPlainEmpresa(doc);
  },

  async update(id, changes) {
    const doc = await Empresa.findByIdAndUpdate(id, changes, { new: true });
    return toPlainEmpresa(doc);
  },

  async remove(id) {
    const doc = await Empresa.findByIdAndUpdate(
      id,
      { activa: false },
      { new: true },
    );
    return toPlainEmpresa(doc);
  },
};
