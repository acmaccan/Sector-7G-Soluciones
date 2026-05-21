import { empleadoDb } from "../db/empleado.db.js";
import { empresaDb } from "../db/empresa.db.js";
import { novedadDb } from "../db/novedad.db.js";
import { badRequest, notFound } from "../libs/errors.js";
import { createEmpleado, updateEmpleado } from "../models/empleado.js";
import { registrarAuditoria } from "./auditoria.service.js";

const buildEmpleadoView = (empleado, empresa, novedades) => ({
  ...empleado,
  empresa: empresa
    ? {
        id: empresa.id,
        nombre: empresa.nombre,
        cuit: empresa.cuit,
        activo: empresa.activo,
      }
    : null,
  novedades: novedades
    .filter((novedad) => String(novedad.empleadoId) === String(empleado.id))
    .map((novedad) => ({
      id: novedad.id,
      tipo: novedad.tipo,
      estado: novedad.estado,
      activo: novedad.activo,
    })),
});

const validarEmpresaActiva = async (empresaId) => {
  const empresa = await empresaDb.getById(empresaId);

  if (!empresa) {
    throw badRequest("La empresa indicada no existe.");
  }

  if (!empresa.activo) {
    throw badRequest("La empresa indicada se encuentra inactiva.");
  }

  return empresa;
};

export const listarEmpleados = async ({ empresaId, activo } = {}) => {
  const [empleados, novedades] = await Promise.all([empleadoDb.getAll(), novedadDb.getAll()]);

  return empleados
    .filter((empleado) => {
      const coincideEmpresa = empresaId
        ? String(empleado.empresaId?._id ?? empleado.empresaId) === String(empresaId)
        : true;
      const coincideActivo =
        activo === undefined ? true : empleado.activo === (activo === "true");

      return coincideEmpresa && coincideActivo;
    })
    .map((empleado) =>
      buildEmpleadoView(
        empleado,
        empleado.empresaId && typeof empleado.empresaId === "object"
          ? {
              id: String(empleado.empresaId._id),
              nombre: empleado.empresaId.nombre,
              cuit: empleado.empresaId.cuit,
              activo: empleado.empresaId.activa,
            }
          : null,
        novedades,
      ),
    );
};

export const obtenerEmpleado = async (id) => {
  const [empleado, novedades] = await Promise.all([empleadoDb.getById(id), novedadDb.getAll()]);

  if (!empleado) {
    throw notFound("Empleado no encontrado.");
  }

  return buildEmpleadoView(
    empleado,
    empleado.empresaId && typeof empleado.empresaId === "object"
      ? {
          id: String(empleado.empresaId._id),
          nombre: empleado.empresaId.nombre,
          cuit: empleado.empresaId.cuit,
          activo: empleado.empresaId.activa,
        }
      : null,
    novedades,
  );
};

export const crearEmpleado = async (payload) => {
  await validarEmpresaActiva(payload.empresaId);

  const empleados = await empleadoDb.getAll();
  const dni = String(payload.dni).trim();

  if (empleados.some((empleado) => empleado.dni === dni)) {
    throw badRequest("Ya existe un empleado con ese DNI.");
  }

  const empleado = await empleadoDb.create(createEmpleado(payload));

  await registrarAuditoria({
    entidad: "empleado",
    entidadId: empleado.id,
    accion: "creacion",
    descripcion: `Se creo el empleado ${empleado.nombre} ${empleado.apellido}.`,
  });

  return empleado;
};

export const actualizarEmpleado = async (id, payload) => {
  const empleado = await empleadoDb.getById(id);

  if (!empleado) {
    throw notFound("Empleado no encontrado.");
  }

  const [empleados, novedades] = await Promise.all([empleadoDb.getAll(), novedadDb.getAll()]);
  const nuevoDni = payload.dni !== undefined ? String(payload.dni).trim() : null;

  if (
    nuevoDni &&
    empleados.some((item) => item.id !== empleado.id && item.dni === nuevoDni)
  ) {
    throw badRequest("Ya existe otro empleado con ese DNI.");
  }

  if (payload.empresaId !== undefined) {
    await validarEmpresaActiva(payload.empresaId);

    const tieneNovedadesActivas = novedades.some(
      (novedad) => novedad.empleadoId === empleado.id && novedad.activo,
    );

    if (
      tieneNovedadesActivas &&
      String(payload.empresaId) !== String(empleado.empresaId?._id ?? empleado.empresaId)
    ) {
      throw badRequest(
        "No se puede cambiar la empresa del empleado mientras tenga novedades activas.",
      );
    }
  }

  const empleadoActualizado = await empleadoDb.update(
    id,
    updateEmpleado(empleado, payload),
  );

  await registrarAuditoria({
    entidad: "empleado",
    entidadId: empleado.id,
    accion: "modificacion",
    descripcion: `Se actualizo el empleado ${empleado.nombre} ${empleado.apellido}.`,
  });

  return empleadoActualizado;
};

export const eliminarEmpleado = async (id) => {
  const [empleado, novedades] = await Promise.all([empleadoDb.getById(id), novedadDb.getAll()]);

  if (!empleado) {
    throw notFound("Empleado no encontrado.");
  }

  if (!empleado.activo) {
    throw badRequest("El empleado ya se encuentra inactivo.");
  }

  const tieneNovedadesActivas = novedades.some(
    (novedad) => novedad.empleadoId === empleado.id && novedad.activo,
  );

  if (tieneNovedadesActivas) {
    throw badRequest(
      "No se puede dar de baja el empleado porque tiene novedades activas.",
    );
  }

  const empleadoEliminado = await empleadoDb.remove(id);

  await registrarAuditoria({
    entidad: "empleado",
    entidadId: empleado.id,
    accion: "baja_logica",
    descripcion: `Se dio de baja el empleado ${empleado.nombre} ${empleado.apellido}.`,
  });

  return empleadoEliminado;
};
