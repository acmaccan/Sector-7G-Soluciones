import { Router } from "express";
import EmpleadoController from "../controllers/api/empleado.controller.js";
import EmpleadoViewController from "../controllers/view/empleado.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireBody, requireFields } from "../middlewares/validation.middleware.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

// Vistas
const viewRouter = Router();
viewRouter.use(requireRoles('admin', 'liquidador'));
viewRouter.get("/",         asyncHandler(EmpleadoViewController.getAll));
viewRouter.get("/form",     asyncHandler(EmpleadoViewController.getForm));
viewRouter.get("/form/:id", asyncHandler(EmpleadoViewController.getForm));
viewRouter.get("/:id",      asyncHandler(EmpleadoViewController.getById));

// API JSON
const apiRouter = Router();
apiRouter.use(requireRoles('admin', 'liquidador'));
apiRouter.get("/",    asyncHandler(EmpleadoController.list));
apiRouter.get("/:id", asyncHandler(EmpleadoController.show));
apiRouter.post("/",
  requireFields(["nombre", "apellido", "dni", "puesto", "email", "empresaId"]),
  asyncHandler(EmpleadoController.create)
);
apiRouter.put("/:id",    requireBody, asyncHandler(EmpleadoController.update));
apiRouter.delete("/:id", asyncHandler(EmpleadoController.delete));

export { viewRouter, apiRouter };
