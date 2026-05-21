import express from 'express';
import morgan from 'morgan';
import session from "express-session";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, MONGODB_URI, PORT, SESSION_SECRET } from './config/app.config.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';
import { setLocals } from './middlewares/auth.middleware.js';
import { router } from './routes/index.routes.js';
import { authRouter } from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (process.env.DEBUG_REQUESTS === "true") {
    console.log(`[req] ${req.method} ${req.originalUrl}`);
  }
  next();
});
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(setLocals);

app.use((req, res, next) => {
  res.locals.usuario = req.session?.usuario ?? null;
  next();
});

app.use(authRouter);
app.use(router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

const HOST = process.env.HOST || "127.0.0.1";
const server = app.listen(PORT, HOST);

server.on("listening", () => {
  console.log(`Server is running on link http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  console.error("HTTP server error:", err);
  process.exitCode = 1;
});

try {
  await connectDB();
} catch (err) {
  console.error(
    `MongoDB connection failed. Server still running without DB. URI: ${process.env.MONGODB_URI ?? MONGODB_URI ?? "(default)"}`
  );
  console.error(err);
}
