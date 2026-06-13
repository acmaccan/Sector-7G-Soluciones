export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export const badRequest  = (message) => new AppError(message, 400);
export const notFound   = (message) => new AppError(message, 404);
export const forbidden  = (message) => new AppError(message, 403);
