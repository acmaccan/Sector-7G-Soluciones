import { empleadoDb } from "../db/empleado.db.js";
import { empresaDb } from "../db/empresa.db.js";
import { novedadDb } from "../db/novedad.db.js";
import { badRequest, notFound } from "../libs/errors.js";
import { createEmpresa, updateEmpresa } from "../models/empresa.js";
import { registrarAuditoria } from "./auditoria.service.js";

const buildEmpresaView = (empresa, empleados, novedades) => {
  const empleadosRelacionados = empleados
    .filter(
      (empleado) =>
        String(empleado.empresaId?._id ?? empleado.empresaId) === String(empresa.id),
    )
    .map((empleado) => ({
      id: empleado.id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      activo: empleado.activo,
    }));

  const novedadesRelacionadas = novedades
    .filter((novedad) => String(novedad.empresaId) === String(empresa.id))
    .map((novedad) => ({
      id: novedad.id,
      tipo: novedad.tipo,
      estado: novedad.estado,
      empleadoId: novedad.empleadoId,
      activo: novedad.activo,
    }));

  return {
    ...empresa,
    empleados: empleadosRelacionados,
    novedades: novedadesRelacionadas,
  };
};

export const listarEmpresas = async ({ activo } = {}) => {
  const [empresas, empleados, novedades] = await Promise.all([
    empresaDb.getAll(),
    empleadoDb.getAll(),
    novedadDb.getAll(),
  ]);

  return empresas
    .filter((empresa) => {
      if (activo === undefined) {
        return true;
      }

      return empresa.activo === (activo === "true");
    })
    .map((empresa) => buildEmpresaView(empresa, empleados, novedades));
};

export const obtenerEmpresa = async (id) => {
  const [empresa, empleados, novedades] = await Promise.all([
    empresaDb.getById(id),
    empleadoDb.getAll(),
    novedadDb.getAll(),
  ]);

  if (!empresa) {
    throw notFound("Empresa no encontrada.");
  }

  return buildEmpresaView(empresa, empleados, novedades);
};

export const crearEmpresa = async (payload) => {
  const empresas = await empresaDb.getAll();
  const cuit = payload.cuit.trim();

  if (empresas.some((empresa) => empresa.cuit === cuit)) {
    throw badRequest("Ya existe una empresa con ese CUIT.");
  }

  const empresa = await empresaDb.create(createEmpresa(payload));

  await registrarAuditoria({
    entidad: "empresa",
    entidadId: empresa.id,
    accion: "creacion",
    descripcion: `Se creo la empresa ${empresa.nombre}.`,
  });

  return empresa;
};

export const actualizarEmpresa = async (id, payload) => {
  const empresa = await empresaDb.getById(id);

  if (!empresa) {
    throw notFound("Empresa no encontrada.");
  }

  const empresas = await empresaDb.getAll();
  const nuevoCuit = payload.cuit?.trim();

  if (
    nuevoCuit &&
    empresas.some((item) => item.id !== empresa.id && item.cuit === nuevoCuit)
  ) {
    throw badRequest("Ya existe otra empresa con ese CUIT.");
  }

  const empresaActualizada = await empresaDb.update(id, updateEmpresa(empresa, payload));

  await registrarAuditoria({
    entidad: "empresa",
    entidadId: empresa.id,
    accion: "modificacion",
    descripcion: `Se actualizo la empresa ${empresa.nombre}.`,
  });

  return empresaActualizada;
};

export const eliminarEmpresa = async (id) => {
  const [empresa, empleados, novedades] = await Promise.all([
    empresaDb.getById(id),
    empleadoDb.getAll(),
    novedadDb.getAll(),
  ]);

  if (!empresa) {
    throw notFound("Empresa no encontrada.");
  }

  if (!empresa.activo) {
    throw badRequest("La empresa ya se encuentra inactiva.");
  }

  const tieneEmpleadosActivos = empleados.some(
    (empleado) => empleado.empresaId === empresa.id && empleado.activo,
  );
  const tieneNovedadesActivas = novedades.some(
    (novedad) => novedad.empresaId === empresa.id && novedad.activo,
  );

  if (tieneEmpleadosActivos || tieneNovedadesActivas) {
    throw badRequest(
      "No se puede dar de baja la empresa porque tiene dependencias activas.",
    );
  }

  const empresaEliminada = await empresaDb.remove(id);

  await registrarAuditoria({
    entidad: "empresa",
    entidadId: empresa.id,
    accion: "baja_logica",
    descripcion: `Se dio de baja la empresa ${empresa.nombre}.`,
  });

  return empresaEliminada;
};
