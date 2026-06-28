import { Router } from "express";
import { asyncHandler } from "../libs/asyncHandler.js";
import usuarioViewController from "../controllers/view/usuario.controller.js";
import { requireRoles } from "../middlewares/auth.middleware.js";

export const viewRouter = Router();
viewRouter.get("/",         asyncHandler(usuarioViewController.getAll));
viewRouter.get("/form",     asyncHandler(usuarioViewController.getForm));
viewRouter.get("/form/:id", asyncHandler(usuarioViewController.getForm));
viewRouter.post("/form",    asyncHandler(usuarioViewController.getById));
viewRouter.post("/form/:id",      asyncHandler(usuarioViewController.getById));

