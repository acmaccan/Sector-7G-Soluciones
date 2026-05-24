import mongoose from "mongoose";

const auditoriaSchema = new mongoose.Schema(
  {
    entidad: { type: String, required: true, trim: true },
    entidadId: { type: mongoose.Schema.Types.Mixed, default: null },
    accion: { type: String, required: true, trim: true },
    detalle: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Auditoria =
  mongoose.models.Auditoria || mongoose.model("Auditoria", auditoriaSchema);

export const createAuditoria = (payload) => ({
  entidad: payload.entidad,
  entidadId: payload.entidadId,
  accion: payload.accion,
  detalle: payload.detalle || payload.descripcion,
});
