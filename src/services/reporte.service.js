import { Empresa } from "../models/empresa.js";
import { Empleado } from "../models/empleado.js";
import { novedadDb } from "../db/novedad.db.js";

const calcularImpacto = (cantidad) => {
  if (cantidad >= 6) {
    return "alto";
  }

  if (cantidad >= 3) {
    return "medio";
  }

  return "bajo";
};

export const obtenerResumen = async () => {
  const [empresasActivas, empleadosActivosCount, novedades] = await Promise.all([
    Empresa.find({ activa: true }).lean(),
    Empleado.countDocuments({ activo: true }),
    novedadDb.getAll(),
  ]);

  const novedadesActivas = novedades.filter((novedad) => novedad.activo !== false);
  const novedadesPendientes = novedadesActivas.filter(
    (novedad) => novedad.estado === "pendiente",
  );

  return {
    indicadores: {
      empresasActivas: empresasActivas.length,
      empleadosActivos: empleadosActivosCount,
      novedadesPendientes: novedadesPendientes.length,
      cargaOperativaEstimada: {
        totalNovedadesActivas: novedadesActivas.length,
        nivel: calcularImpacto(novedadesActivas.length),
      },
    },
    simulacion: {
      criterio: "impacto calculado por cantidad de novedades activas",
      impactoGeneral: calcularImpacto(novedadesActivas.length),
      detallePorEmpresa: empresasActivas.map((empresa) => {
        const novedadesEmpresa = novedadesActivas.filter(
          (novedad) => String(novedad.empresaId) === String(empresa._id),
        );

        return {
          empresaId: String(empresa._id),
          empresa: empresa.nombre,
          totalNovedades: novedadesEmpresa.length,
          pendientes: novedadesEmpresa.filter(
            (novedad) => novedad.estado === "pendiente",
          ).length,
          impactoEstimado: calcularImpacto(novedadesEmpresa.length),
        };
      }),
    },
  };
};
