import { Router } from "express";
import { viewRouter as empleadosView, apiRouter as empleadosApi } from "./empleados.routes.js";
import { viewRouter as empresasView,       apiRouter as empresasApi       } from "./empresas.routes.js";
import { viewRouter as sociosView,         apiRouter as sociosApi         } from "./socios.routes.js";
import { viewRouter as novedadesView,      apiRouter as novedadesApi      } from "./novedades.routes.js";
import { viewRouter as seguimientosView,   apiRouter as seguimientosApi   } from "./seguimientos.routes.js";
import { viewRouter as liquidacionesView,  apiRouter as liquidacionesApi  } from "./liquidaciones.routes.js";
import { viewRouter as auditoriaView,      apiRouter as auditoriaApi      } from "./auditoria.routes.js";
import { viewRouter as usuariosView } from "./usuarios.routes.js";
import { router as resumenRouter } from "./resumen.routes.js";
import { obtenerResumen } from "../services/reporte.service.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { MODULES_BY_ROLE } from "../middlewares/auth.middleware.js";


const router = Router();

// ── Vistas (HTML) ─────────────────────────────────────────────────────────────
router.get("/", (req, res) => {
  const rol = req.session?.usuario?.rol;
  if (rol === 'cliente') return res.redirect('/novedades');
  const modules = MODULES_BY_ROLE[rol] ?? MODULES_BY_ROLE.admin;
  res.render("index", { titulo: "Panel de Control", modules });
});

router.get("/index", (req, res) => res.redirect("/"));

router.use("/empleados",     empleadosView);
router.use("/empresas",      empresasView);
router.use("/socios",        sociosView);
router.use("/novedades",     novedadesView);
router.use("/seguimientos",  seguimientosView);
router.use("/liquidaciones", liquidacionesView);
router.use("/auditoria",     auditoriaView);
router.use("/resumen",       resumenRouter);
router.use("/usuarios",      usuariosView);


// ── API JSON ──────────────────────────────────────────────────────────────────
router.get("/api", (req, res) => {
  res.json({
    sistema: "Talento Evolutivo S.A.",
    descripcion: "API REST para seguimiento administrativo de liquidacion de haberes.",
    endpoints: [
      "GET    /api/empleados",        "GET    /api/empleados/:id",
      "POST   /api/empleados",        "PUT    /api/empleados/:id",      "DELETE /api/empleados/:id",
      "GET    /api/empresas",         "GET    /api/empresas/:id",
      "POST   /api/empresas",         "PUT    /api/empresas/:id",       "DELETE /api/empresas/:id",
      "GET    /api/socios",           "GET    /api/socios/:id",
      "POST   /api/socios",           "PUT    /api/socios/:id",         "DELETE /api/socios/:id",
      "GET    /api/novedades",        "GET    /api/novedades/:id",
      "POST   /api/novedades",        "PUT    /api/novedades/:id",      "DELETE /api/novedades/:id",
      "GET    /api/seguimientos",     "GET    /api/seguimientos/:id",
      "POST   /api/seguimientos",     "PUT    /api/seguimientos/:id",   "DELETE /api/seguimientos/:id",
      "GET    /api/liquidaciones",    "GET    /api/liquidaciones/:id",
      "POST   /api/liquidaciones",    "PUT    /api/liquidaciones/:id",  "DELETE /api/liquidaciones/:id",
      "GET    /api/auditoria",
    ].sort(),
  });
});

router.use("/api/empleados",     empleadosApi);
router.use("/api/empresas",      empresasApi);
router.use("/api/socios",        sociosApi);
router.use("/api/novedades",     novedadesApi);
router.use("/api/seguimientos",  seguimientosApi);
router.use("/api/liquidaciones", liquidacionesApi);
router.use("/api/auditoria",     auditoriaApi);
router.get("/api/resumen",       asyncHandler(async (req, res) => {
  res.json(await obtenerResumen());
}));

export { router };
