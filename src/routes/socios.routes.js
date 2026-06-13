import { Router } from "express";
import SocioController from "../controllers/api/socio.controller.js";
import SocioViewController from "../controllers/view/socio.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireBody, requireFields } from "../middlewares/validation.middleware.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

// Vistas
const viewRouter = Router();
viewRouter.use(requireRoles('admin'));
viewRouter.get("/",         asyncHandler(SocioViewController.getAll));
viewRouter.get("/form",     asyncHandler(SocioViewController.getForm));
viewRouter.get("/form/:id", asyncHandler(SocioViewController.getForm));
viewRouter.get("/:id",      asyncHandler(SocioViewController.getById));

// API JSON
const apiRouter = Router();
apiRouter.use(requireRoles('admin'));
apiRouter.get("/",    asyncHandler(SocioController.list));
apiRouter.get("/:id", asyncHandler(SocioController.show));
apiRouter.post("/",
  requireFields(["nombre", "apellido", "dni", "email", "participacion", "fechaIngreso"]),
  asyncHandler(SocioController.create)
);
apiRouter.put("/:id",    requireBody, asyncHandler(SocioController.update));
apiRouter.delete("/:id", asyncHandler(SocioController.delete));

export { viewRouter, apiRouter };
