import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      // Establish session
      req.session.userId = user._id.toString();
      return sendSuccess(
        res,
        authService.sanitizeUser(user),
        'Registration successful',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.login(req.body);
      req.session.userId = user._id.toString();
      return sendSuccess(res, authService.sanitizeUser(user), 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('connect.sid');
        return sendSuccess(res, null, 'Logged out successfully');
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendSuccess(res, null);
      }
      return sendSuccess(res, authService.sanitizeUser(req.user));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await authService.forgotPassword(req.body.email);
      return sendSuccess(res, null, message);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      return sendSuccess(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
