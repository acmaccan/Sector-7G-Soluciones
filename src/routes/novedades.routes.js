import { Router } from "express";
import NovedadController from "../controllers/api/novedad.controller.js";
import NovedadViewController from "../controllers/view/novedad.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireBody, requireFields } from "../middlewares/validation.middleware.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

// Vistas
const viewRouter = Router();
viewRouter.get("/",         asyncHandler(NovedadViewController.getAll));
viewRouter.get("/form",     requireRoles('admin', 'liquidador'), asyncHandler(NovedadViewController.getForm));
viewRouter.get("/form/:id", requireRoles('admin', 'liquidador'), asyncHandler(NovedadViewController.getForm));
viewRouter.get("/:id",      asyncHandler(NovedadViewController.getById));

// API JSON
const apiRouter = Router();
apiRouter.get("/",    asyncHandler(NovedadController.list));
apiRouter.get("/:id", asyncHandler(NovedadController.show));
apiRouter.post("/",
  requireRoles('admin', 'liquidador'),
  requireFields(["tipo", "descripcion", "fecha", "empresaId", "empleadoId"]),
  asyncHandler(NovedadController.create)
);
apiRouter.put("/:id",    requireRoles('admin', 'liquidador'), requireBody, asyncHandler(NovedadController.update));
apiRouter.delete("/:id", requireRoles('admin', 'liquidador'), asyncHandler(NovedadController.delete));

export { viewRouter, apiRouter };
