import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/AppError.js';
import { USER_ROLES, SELLER_STATUS, UserRole } from '@devshelf/shared';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Access restricted to roles: ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(USER_ROLES.ADMIN)(req, res, next);
}

export function requireSeller(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(AppError.unauthorized());
  }

  // Admins always have seller privileges, or approved sellers
  if (req.user.role === USER_ROLES.ADMIN) {
    return next();
  }

  if (req.user.sellerStatus !== SELLER_STATUS.APPROVED) {
    return next(
      AppError.forbidden(
        'You must have an approved seller account to perform this action'
      )
    );
  }

  next();
}
