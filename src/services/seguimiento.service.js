import { empleadoDb } from "../db/empleado.db.js";
import { empresaDb } from "../db/empresa.db.js";
import { novedadDb } from "../db/novedad.db.js";
import { seguimientoDb } from "../db/seguimiento.db.js";
import { badRequest, notFound } from "../libs/errors.js";
import { createSeguimiento, updateSeguimiento } from "../models/seguimiento.js";
import { registrarAuditoria } from "./auditoria.service.js";

const validarNovedadActiva = async (novedadId) => {
  const novedad = await novedadDb.getById(novedadId);

  if (!novedad) {
    throw badRequest("La novedad indicada no existe.");
  }

  if (!novedad.activo) {
    throw badRequest("La novedad indicada se encuentra inactiva.");
  }

  return novedad;
};

const buildSeguimientoView = (seguimiento, novedad, empleado, empresa) => ({
  ...seguimiento,
  novedad: novedad
    ? {
        id: String(novedad._id ?? novedad.id),
        tipo: novedad.tipo,
        estado: novedad.estado,
      }
    : null,
  empleado: empleado
    ? {
        id: String(empleado._id ?? empleado.id),
        nombre: empleado.nombre,
        apellido: empleado.apellido,
      }
    : null,
  empresa: empresa
    ? {
        id: String(empresa._id ?? empresa.id),
        nombre: empresa.nombre,
      }
    : null,
});

export const listarSeguimientos = async ({ empresaId, novedadId, activo } = {}) => {
  const [seguimientos, empleados, empresas] = await Promise.all([
    seguimientoDb.getAll(),
    empleadoDb.getAll(),
    empresaDb.getAll(),
  ]);

  return seguimientos
    .filter((seguimiento) => {
      const novedad = seguimiento.novedadId;
      const coincideEmpresa = empresaId
        ? String(novedad?.empresaId?._id ?? novedad?.empresaId) === String(empresaId)
        : true;
      const coincideNovedad = novedadId
        ? String(novedad?._id ?? seguimiento.novedadId) === String(novedadId)
        : true;
      const coincideActivo =
        activo === undefined ? true : seguimiento.activo === (activo === "true");

      return coincideEmpresa && coincideNovedad && coincideActivo;
    })
    .map((seguimiento) => {
      const novedad = seguimiento.novedadId;
      const empleado = novedad
        ? (novedad.empleadoId && novedad.empleadoId.nombre ? novedad.empleadoId : empleados.find((item) => String(item.id) === String(novedad.empleadoId)))
        : null;
      const empresa = novedad
        ? (novedad.empresaId && novedad.empresaId.nombre ? novedad.empresaId : empresas.find((item) => String(item.id) === String(novedad.empresaId)))
        : null;

      return buildSeguimientoView(seguimiento, novedad, empleado, empresa);
    });
};

export const obtenerSeguimiento = async (id) => {
  const [seguimiento, empleados, empresas] = await Promise.all([
    seguimientoDb.getById(id),
    empleadoDb.getAll(),
    empresaDb.getAll(),
  ]);

  if (!seguimiento) {
    throw notFound("Seguimiento no encontrado.");
  }

  const novedad = seguimiento.novedadId;
  const empleado = novedad
    ? (novedad.empleadoId && novedad.empleadoId.nombre ? novedad.empleadoId : empleados.find((item) => String(item.id) === String(novedad.empleadoId)))
    : null;
  const empresa = novedad
    ? (novedad.empresaId && novedad.empresaId.nombre ? novedad.empresaId : empresas.find((item) => String(item.id) === String(novedad.empresaId)))
    : null;

  return buildSeguimientoView(seguimiento, novedad, empleado, empresa);
};

export const crearSeguimiento = async (payload) => {
  await validarNovedadActiva(payload.novedadId);

  const seguimiento = await seguimientoDb.create(createSeguimiento(payload));

  await registrarAuditoria({
    entidad: "seguimiento",
    entidadId: seguimiento.id,
    accion: "creacion",
    descripcion: `Se creo el seguimiento ${seguimiento.id} para la novedad ${seguimiento.novedadId}.`,
  });

  return seguimiento;
};

export const actualizarSeguimiento = async (id, payload) => {
  const seguimiento = await seguimientoDb.getById(id);

  if (!seguimiento) {
    throw notFound("Seguimiento no encontrado.");
  }

  if (payload.novedadId !== undefined) {
    await validarNovedadActiva(payload.novedadId);
  }

  const seguimientoActualizado = await seguimientoDb.update(
    id,
    updateSeguimiento(seguimiento, payload),
  );

  await registrarAuditoria({
    entidad: "seguimiento",
    entidadId: seguimiento.id,
    accion: "modificacion",
    descripcion: `Se actualizo el seguimiento ${seguimiento.id}.`,
  });

  return seguimientoActualizado;
};

export const eliminarSeguimiento = async (id) => {
  const seguimiento = await seguimientoDb.getById(id);

  if (!seguimiento) {
    throw notFound("Seguimiento no encontrado.");
  }

  if (!seguimiento.activo) {
    throw badRequest("El seguimiento ya se encuentra inactivo.");
  }

  const seguimientoEliminado = await seguimientoDb.remove(id);

  await registrarAuditoria({
    entidad: "seguimiento",
    entidadId: seguimiento.id,
    accion: "baja_logica",
    descripcion: `Se dio de baja el seguimiento ${seguimiento.id}.`,
  });

  return seguimientoEliminado;
};
