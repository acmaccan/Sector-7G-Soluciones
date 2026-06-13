import { Router } from "express";
import ReporteController from "../controllers/view/reporte.controller.js";
import { asyncHandler } from "../libs/asyncHandler.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",
  requireRoles('admin'),
  asyncHandler(ReporteController.getResumen));

export { router };
