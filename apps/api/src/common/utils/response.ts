import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  error?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || null,
  });
}
