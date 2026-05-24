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

  if (!empleado.activo || !empresa.activo) {
    throw badRequest("Empleado o empresa inactivos.");
  }

  const empId = empleado.empresaId?._id ? String(empleado.empresaId._id) : String(empleado.empresaId);
  if (empId !== String(empresa.id)) {
    throw badRequest("El empleado no pertenece a la empresa indicada.");
  }

  return { empleado, empresa };
};

const buildNovedadView = (novedad, empleado, empresa, seguimientos) => ({
  ...novedad,
  empresa: empresa
    ? {
        id: empresa.id,
        nombre: empresa.nombre,
        cuit: empresa.cuit,
      }
    : null,
  empleado: empleado
    ? {
        id: empleado.id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
      }
    : null,
  seguimientos: seguimientos
    .filter((seguimiento) => seguimiento.novedadId === novedad.id)
    .map((seguimiento) => ({
      id: seguimiento.id,
      fecha: seguimiento.fecha,
      responsable: seguimiento.responsable,
      activo: seguimiento.activo,
    })),
});

export const listarNovedades = async ({ empresaId, estado, activo } = {}) => {
  validarEstado(estado);

  const [novedades, empresas, empleados, seguimientos] = await Promise.all([
    novedadDb.getAll(),
    empresaDb.getAll(),
    empleadoDb.getAll(),
    seguimientoDb.getAll(),
  ]);

  return novedades
    .filter((novedad) => {
      const coincideEmpresa = empresaId
        ? novedad.empresaId === Number(empresaId)
        : true;
      const coincideEstado = estado ? novedad.estado === estado : true;
      const coincideActivo =
        activo === undefined ? true : novedad.activo === (activo === "true");

      return coincideEmpresa && coincideEstado && coincideActivo;
    })
    .map((novedad) =>
      buildNovedadView(
        novedad,
        empleados.find((empleado) => String(empleado.id) === String(novedad.empleadoId)),
        empresas.find((empresa) => String(empresa.id) === String(novedad.empresaId)),
        seguimientos,
      ),
    );
};

export const obtenerNovedad = async (id) => {
  const [novedad, empresas, empleados, seguimientos] = await Promise.all([
    novedadDb.getById(id),
    empresaDb.getAll(),
    empleadoDb.getAll(),
    seguimientoDb.getAll(),
  ]);

  if (!novedad) {
    throw notFound("Novedad no encontrada.");
  }

  return buildNovedadView(
    novedad,
    empleados.find((empleado) => String(empleado.id) === String(novedad.empleadoId)),
    empresas.find((empresa) => String(empresa.id) === String(novedad.empresaId)),
    seguimientos,
  );
};

export const crearNovedad = async (payload) => {
  validarEstado(payload.estado);
  await validarRelacionEmpleadoEmpresa(payload.empleadoId, payload.empresaId);

  const novedad = await novedadDb.create(createNovedad(payload));

  await registrarAuditoria({
    entidad: "novedad",
    entidadId: novedad.id,
    accion: "creacion",
    descripcion: `Se creo la novedad ${novedad.tipo} para el empleado ${novedad.empleadoId}.`,
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
    payload.empresaId !== undefined ? Number(payload.empresaId) : novedad.empresaId;
  const empleadoId =
    payload.empleadoId !== undefined ? Number(payload.empleadoId) : novedad.empleadoId;

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
    (seguimiento) => seguimiento.novedadId === novedad.id && seguimiento.activo,
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
