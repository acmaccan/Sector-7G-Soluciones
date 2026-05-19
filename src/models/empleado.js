import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    dni: { type: String, required: true, trim: true },
    puesto: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    empresaId: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

empleadoSchema.index({ dni: 1 }, { unique: true });

export const Empleado =
  mongoose.models.Empleado || mongoose.model("Empleado", empleadoSchema);

// Compat helpers used by existing services (kept minimal)
export const createEmpleado = (payload) => ({
  nombre: payload.nombre?.trim(),
  apellido: payload.apellido?.trim(),
  dni: String(payload.dni ?? "").trim(),
  puesto: payload.puesto?.trim(),
  email: payload.email?.trim()?.toLowerCase(),
  empresaId: payload.empresaId,
  activo: true,
});

export const updateEmpleado = (_currentEmpleado, payload) => ({
  ...(payload.nombre !== undefined ? { nombre: payload.nombre.trim() } : {}),
  ...(payload.apellido !== undefined
    ? { apellido: payload.apellido.trim() }
    : {}),
  ...(payload.dni !== undefined ? { dni: String(payload.dni).trim() } : {}),
  ...(payload.puesto !== undefined ? { puesto: payload.puesto.trim() } : {}),
  ...(payload.email !== undefined
    ? { email: String(payload.email).trim().toLowerCase() }
    : {}),
  ...(payload.empresaId !== undefined ? { empresaId: payload.empresaId } : {}),
  ...(payload.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
});
