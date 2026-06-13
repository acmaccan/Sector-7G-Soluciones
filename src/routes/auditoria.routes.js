import { Router } from "express";
import AuditoriaController from "../controllers/api/auditoria.controller.js";
import AuditoriaViewController from "../controllers/view/auditoria.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

// Vista
const viewRouter = Router();
viewRouter.use(requireRoles('admin'));
viewRouter.get("/", asyncHandler(AuditoriaViewController.getAll));

// API JSON
const apiRouter = Router();
apiRouter.use(requireRoles('admin'));
apiRouter.get("/", asyncHandler(AuditoriaController.list));

export { viewRouter, apiRouter };
