import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/AppError.js';
import { UserModel, IUserDocument } from '../modules/users/user.model.js';
import { USER_STATUS } from '@devshelf/shared';

// Extend Express Request type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return next(AppError.unauthorized('Please log in to continue'));
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      req.session.destroy(() => {});
      return next(AppError.unauthorized('User not found. Session expired'));
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      return next(AppError.forbidden('Your account has been suspended by marketplace moderation'));
    }

    if (user.status === USER_STATUS.DELETED) {
      return next(AppError.unauthorized('Account no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session?.userId;
    if (userId) {
      const user = await UserModel.findById(userId);
      if (user && user.status === USER_STATUS.ACTIVE) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
}
