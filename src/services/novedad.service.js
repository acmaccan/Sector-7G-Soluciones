import { empleadoDb } from "../db/empleado.db.js";
import { empresaDb } from "../db/empresa.db.js";
import { novedadDb } from "../db/novedad.db.js";
import { seguimientoDb } from "../db/seguimiento.db.js";
import { NOVEDAD_ESTADOS } from "../config/app.config.js";
import { badRequest, notFound } from "../libs/errors.js";
import { createNovedad, updateNovedad } from "../models/novedad.js";
import { registrarAuditoria } from "./auditoria.service.js";

const validarEstado = (estado) => {
  if (estado && !NOVEDAD_ESTADOS.includes(estado)) {
    throw badRequest(
      `Estado invalido. Valores permitidos: ${NOVEDAD_ESTADOS.join(", ")}.`,
    );
  }
};

const validarRelacionEmpleadoEmpresa = async (empleadoId, empresaId) => {
  const [empleado, empresa] = await Promise.all([
    empleadoDb.getById(empleadoId),
    empresaDb.getById(empresaId),
  ]);

  if (!empleado) {
    throw badRequest("El empleado indicado no existe.");
  }

  if (!empresa) {
    throw badRequest("La empresa indicada no existe.");
  }

  if (!empleado.activo || !empresa.activa) {
    throw badRequest("Empleado o empresa inactivos.");
  }

  const empIdInEmpleado = String(empleado.empresaId?._id ?? empleado.empresaId);
  const targetEmpresaId = String(empresa.id ?? empresa._id);
  if (empIdInEmpleado !== targetEmpresaId) {
    throw badRequest("El empleado no pertenece a la empresa indicada.");
  }

  return { empleado, empresa };
};

const buildNovedadView = (novedad, empleado, empresa, seguimientos) => ({
  ...novedad,
  empresa: empresa
    ? {
        id: String(empresa._id ?? empresa.id),
        nombre: empresa.nombre,
        cuit: empresa.cuit,
      }
    : null,
  empleado: empleado
    ? {
        id: String(empleado._id ?? empleado.id),
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
      }
    : null,
  seguimientos: seguimientos
    .filter((seguimiento) => String(seguimiento.novedadId?._id ?? seguimiento.novedadId) === String(novedad.id))
    .map((seguimiento) => ({
      id: String(seguimiento._id ?? seguimiento.id),
      fecha: seguimiento.fecha,
      responsable: seguimiento.responsable,
      activo: seguimiento.activo,
    })),
});

export const listarNovedades = async ({ empresaId, estado, activo } = {}) => {
  validarEstado(estado);

  const [novedades, seguimientos] = await Promise.all([
    novedadDb.getAll(),
    seguimientoDb.getAll(),
  ]);

  return novedades
    .filter((novedad) => {
      const coincideEmpresa = empresaId
        ? String(novedad.empresaId?._id ?? novedad.empresaId) === String(empresaId)
        : true;
      const coincideEstado = estado ? novedad.estado === estado : true;
      const coincideActivo =
        activo === undefined ? true : novedad.activo === (activo === "true");

      return coincideEmpresa && coincideEstado && coincideActivo;
    })
    .map((novedad) =>
      buildNovedadView(
        novedad,
        novedad.empleadoId,
        novedad.empresaId,
        seguimientos,
      ),
    );
};

export const obtenerNovedad = async (id) => {
  const [novedad, seguimientos] = await Promise.all([
    novedadDb.getById(id),
    seguimientoDb.getAll(),
  ]);

  if (!novedad) {
    throw notFound("Novedad no encontrada.");
  }

  return buildNovedadView(
    novedad,
    novedad.empleadoId,
    novedad.empresaId,
    seguimientos,
  );
};

export const crearNovedad = async (payload) => {
  validarEstado(payload.estado);
  await validarRelacionEmpleadoEmpresa(payload.empleadoId, payload.empresaId);

  const novedad = await novedadDb.create(createNovedad(payload));

  const empleadoInfo = novedad.empleadoId && novedad.empleadoId.nombre
    ? `${novedad.empleadoId.nombre} ${novedad.empleadoId.apellido}`
    : String(novedad.empleadoId);

  await registrarAuditoria({
    entidad: "novedad",
    entidadId: novedad.id,
    accion: "creacion",
    descripcion: `Se creo la novedad ${novedad.tipo} para el empleado ${empleadoInfo}.`,
  });

  return novedad;
};

export const actualizarNovedad = async (id, payload) => {
  const novedad = await novedadDb.getById(id);

  if (!novedad) {
    throw notFound("Novedad no encontrada.");
  }

  validarEstado(payload.estado);

  const empresaId =
    payload.empresaId !== undefined ? payload.empresaId : String(novedad.empresaId?._id ?? novedad.empresaId);
  const empleadoId =
    payload.empleadoId !== undefined ? payload.empleadoId : String(novedad.empleadoId?._id ?? novedad.empleadoId);

  await validarRelacionEmpleadoEmpresa(empleadoId, empresaId);

  const estadoAnterior = novedad.estado;
  const novedadActualizada = await novedadDb.update(id, updateNovedad(novedad, payload));

  if (payload.estado && payload.estado !== estadoAnterior) {
    await registrarAuditoria({
      entidad: "novedad",
      entidadId: novedad.id,
      accion: "cambio_estado",
      descripcion: `La novedad ${novedad.id} cambio de ${estadoAnterior} a ${payload.estado}.`,
    });
  }

  await registrarAuditoria({
    entidad: "novedad",
    entidadId: novedad.id,
    accion: "modificacion",
    descripcion: `Se actualizo la novedad ${novedad.id}.`,
  });

  return novedadActualizada;
};

export const eliminarNovedad = async (id) => {
  const [novedad, seguimientos] = await Promise.all([novedadDb.getById(id), seguimientoDb.getAll()]);

  if (!novedad) {
    throw notFound("Novedad no encontrada.");
  }

  if (!novedad.activo) {
    throw badRequest("La novedad ya se encuentra inactiva.");
  }

  const tieneSeguimientosActivos = seguimientos.some(
    (seguimiento) => String(seguimiento.novedadId?._id ?? seguimiento.novedadId) === String(novedad.id) && seguimiento.activo,
  );

  if (tieneSeguimientosActivos) {
    throw badRequest(
      "No se puede dar de baja la novedad porque tiene seguimientos activos.",
    );
  }

  const novedadEliminada = await novedadDb.remove(id);

  await registrarAuditoria({
    entidad: "novedad",
    entidadId: novedad.id,
    accion: "baja_logica",
    descripcion: `Se dio de baja la novedad ${novedad.id}.`,
  });

  return novedadEliminada;
};
