import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/errors/AppError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  logger.error({
    err,
    path: req.path,
    method: req.method,
  }, 'Unhandled Error Encountered');

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: formattedErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errors || null,
    });
  }

  // Generic fallback
  const responsePayload: Record<string, unknown> = {
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  };

  if (env.NODE_ENV !== 'production') {
    responsePayload.stack = err.stack;
  }

  return res.status(500).json(responsePayload);
}
