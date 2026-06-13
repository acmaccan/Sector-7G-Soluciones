import { Router } from "express";
import LiquidacionController from "../controllers/api/liquidacion.controller.js";
import LiquidacionViewController from "../controllers/view/liquidacion.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireBody, requireFields } from "../middlewares/validation.middleware.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

// Vistas
const viewRouter = Router();
viewRouter.use(requireRoles('admin', 'liquidador'));
viewRouter.get("/",         asyncHandler(LiquidacionViewController.getAll));
viewRouter.get("/form",     asyncHandler(LiquidacionViewController.getForm));
viewRouter.get("/form/:id", asyncHandler(LiquidacionViewController.getForm));
viewRouter.get("/:id",      asyncHandler(LiquidacionViewController.getById));

// API JSON
const apiRouter = Router();
apiRouter.use(requireRoles('admin', 'liquidador'));
apiRouter.get("/",    asyncHandler(LiquidacionController.list));
apiRouter.get("/:id", asyncHandler(LiquidacionController.show));
apiRouter.post("/",
  requireFields(["empresaId", "empleadoId", "periodo", "concepto", "monto"]),
  asyncHandler(LiquidacionController.create)
);
apiRouter.put("/:id",    requireBody, asyncHandler(LiquidacionController.update));
apiRouter.delete("/:id", asyncHandler(LiquidacionController.delete));

export { viewRouter, apiRouter };
