import { AppError } from "../libs/errors.js";

export const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};

export const errorMiddleware = (error, req, res, next) => {
  console.error("[Error Handler]:", error);

  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode = error.statusCode || 500;
  let message = error.message;

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
  }
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "ID inválido";
  }
  else if (error.code === 11000 || (error.name === "MongoServerError" && error.code === 11000)) {
    statusCode = 409;
    message = "Ya existe un registro con ese valor";
  }

  const responseMessage = statusCode === 500 ? "Error interno del servidor" : message;

  res.status(statusCode).json({
    error: true,
    statusCode,
    message: responseMessage,
  });
};
