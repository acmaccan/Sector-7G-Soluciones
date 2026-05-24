import { Seguimiento } from "../models/seguimiento.js";

const toPlainSeguimiento = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject({ virtuals: false });
  return { ...plain, id: String(plain._id) };
};

export const seguimientoDb = {
  async getAll() {
    const rows = await Seguimiento.find()
      .populate({ path: "novedadId", populate: "empleadoId empresaId" })
      .lean();
    return rows.map((row) => ({ ...row, id: String(row._id) }));
  },

  async getById(id) {
    if (!id) return null;
    const doc = await Seguimiento.findById(id).populate({
      path: "novedadId",
      populate: "empleadoId empresaId",
    });
    return toPlainSeguimiento(doc);
  },

  async create(entity) {
    const doc = await Seguimiento.create(entity);
    const populated = await Seguimiento.findById(doc._id).populate({
      path: "novedadId",
      populate: "empleadoId empresaId",
    });
    return toPlainSeguimiento(populated);
  },

  async update(id, changes) {
    const doc = await Seguimiento.findByIdAndUpdate(id, changes, { new: true }).populate({
      path: "novedadId",
      populate: "empleadoId empresaId",
    });
    return toPlainSeguimiento(doc);
  },

  async remove(id) {
    const doc = await Seguimiento.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    ).populate({
      path: "novedadId",
      populate: "empleadoId empresaId",
    });
    return toPlainSeguimiento(doc);
  },
};
