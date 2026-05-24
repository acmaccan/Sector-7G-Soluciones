import { Router } from 'express';
import { getLogin, postLogin, postLogout } from '../controllers/view/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

// Login / logout (públicas)
authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);
authRouter.post('/logout', requireAuth, postLogout);

// TODO: rutas de gestión de usuarios (GET /usuarios/nuevo, POST /usuarios) — a implementar por admin
