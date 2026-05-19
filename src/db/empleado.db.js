import { Empleado } from "../models/empleado.js";

const toPlainEmpleado = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject({ virtuals: false });
  return { ...plain, id: String(plain._id) };
};

export const empleadoDb = {
  async getAll() {
    const rows = await Empleado.find().populate("empresaId").lean();
    return rows.map((row) => ({ ...row, id: String(row._id) }));
  },

  async getById(id) {
    const doc = await Empleado.findById(id).populate("empresaId");
    return toPlainEmpleado(doc);
  },

  async create(entity) {
    const doc = await Empleado.create(entity);
    const populated = await Empleado.findById(doc._id).populate("empresaId");
    return toPlainEmpleado(populated);
  },

  async update(id, changes) {
    const doc = await Empleado.findByIdAndUpdate(id, changes, { new: true }).populate(
      "empresaId",
    );
    return toPlainEmpleado(doc);
  },

  async remove(id) {
    const doc = await Empleado.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    ).populate("empresaId");
    return toPlainEmpleado(doc);
  },
};
