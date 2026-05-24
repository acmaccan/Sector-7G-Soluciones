import { Auditoria } from "../models/auditoria.js";

const toPlainAuditoria = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject({ virtuals: false }) : doc;

  const fecha = plain.createdAt
    ? new Date(plain.createdAt).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })
    : new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

  return {
    ...plain,
    id: String(plain._id),
    fecha,
    usuario: plain.usuario || "Sistema",
    modulo: plain.entidad ? plain.entidad.toUpperCase() : "SISTEMA",
  };
};

export const auditoriaDb = {
  async getAll() {
    const docs = await Auditoria.find().sort({ createdAt: -1 }).lean();
    return docs.map(toPlainAuditoria);
  },

  async create(entity) {
    const payload = {
      entidad: entity.entidad,
      entidadId: entity.entidadId,
      accion: entity.accion,
      detalle: entity.detalle || entity.descripcion,
      usuario: entity.usuario || "Sistema",
    };
    const doc = await Auditoria.create(payload);
    return toPlainAuditoria(doc);
  },
};
