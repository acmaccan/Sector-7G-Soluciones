import { Router } from "express";
import EmpresaController from "../controllers/api/empresa.controller.js";
import EmpresaViewController from "../controllers/view/empresa.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireBody, requireFields } from "../middlewares/validation.middleware.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

// Vistas
const viewRouter = Router();
viewRouter.use(requireRoles('admin', 'liquidador'));
viewRouter.get("/",         asyncHandler(EmpresaViewController.getAll));
viewRouter.get("/form",     asyncHandler(EmpresaViewController.getForm));
viewRouter.get("/form/:id", asyncHandler(EmpresaViewController.getForm));
viewRouter.get("/:id",      asyncHandler(EmpresaViewController.getById));

// API JSON
const apiRouter = Router();
apiRouter.use(requireRoles('admin', 'liquidador'));
apiRouter.get("/",    asyncHandler(EmpresaController.list));
apiRouter.get("/:id", asyncHandler(EmpresaController.show));
apiRouter.post("/",
  requireFields(["nombre", "cuit", "rubro", "contacto"]),
  asyncHandler(EmpresaController.create)
);
apiRouter.put("/:id",    requireBody, asyncHandler(EmpresaController.update));
apiRouter.delete("/:id", asyncHandler(EmpresaController.delete));

export { viewRouter, apiRouter };
