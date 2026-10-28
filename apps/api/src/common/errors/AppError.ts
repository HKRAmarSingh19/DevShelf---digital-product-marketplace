export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(message: string, statusCode = 500, isOperational = true, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: unknown) {
    return new AppError(message, 400, true, errors);
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Access forbidden: Insufficient permissions') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }

  static unprocessable(message: string, errors?: unknown) {
    return new AppError(message, 422, true, errors);
  }

  static tooManyRequests(message = 'Too many requests, please try again later') {
    return new AppError(message, 429);
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500, false);
  }
}
