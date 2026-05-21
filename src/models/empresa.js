import mongoose from "mongoose";

const EMPRESA_CONVENIOS = ["general", "docente", "sanidad", "comercio", "otro"];

const empresaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cuit: { type: String, required: true, trim: true },
    rubro: { type: String, trim: true },
    contacto: { type: String, trim: true },
    activa: { type: Boolean, default: true },
    convenio: { type: String, enum: EMPRESA_CONVENIOS, default: "general" },
    fechaCierrePeriodo: { type: Number, min: 1, max: 28 },
    fechaAlta: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

empresaSchema.index({ cuit: 1 }, { unique: true });

export const Empresa =
  mongoose.models.Empresa || mongoose.model("Empresa", empresaSchema);

// Compat helpers used by existing services (kept minimal)
export const createEmpresa = (payload) => ({
  nombre: payload.nombre?.trim(),
  cuit: payload.cuit?.trim(),
  rubro: payload.rubro?.trim(),
  contacto: payload.contacto?.trim(),
  activa: true,
  convenio: payload.convenio,
  fechaCierrePeriodo:
    payload.fechaCierrePeriodo !== undefined && payload.fechaCierrePeriodo !== ""
      ? Number(payload.fechaCierrePeriodo)
      : undefined,
  fechaAlta: payload.fechaAlta ? new Date(payload.fechaAlta) : undefined,
});

export const updateEmpresa = (_currentEmpresa, payload) => ({
  ...(payload.nombre !== undefined ? { nombre: payload.nombre.trim() } : {}),
  ...(payload.cuit !== undefined ? { cuit: payload.cuit.trim() } : {}),
  ...(payload.rubro !== undefined ? { rubro: payload.rubro.trim() } : {}),
  ...(payload.contacto !== undefined ? { contacto: payload.contacto.trim() } : {}),
  ...(payload.activa !== undefined ? { activa: Boolean(payload.activa) } : {}),
  ...(payload.convenio !== undefined ? { convenio: payload.convenio } : {}),
  ...(payload.fechaCierrePeriodo !== undefined
    ? {
        fechaCierrePeriodo:
          payload.fechaCierrePeriodo === ""
            ? undefined
            : Number(payload.fechaCierrePeriodo),
      }
    : {}),
  ...(payload.fechaAlta !== undefined
    ? { fechaAlta: payload.fechaAlta ? new Date(payload.fechaAlta) : undefined }
    : {}),
});
