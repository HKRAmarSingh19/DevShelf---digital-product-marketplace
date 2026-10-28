import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@devshelf/shared';

const router = Router();

router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/logout', authenticate, (req, res, next) =>
  authController.logout(req, res, next)
);

router.get('/me', authenticate, (req, res, next) =>
  authController.getMe(req, res, next)
);

router.post('/forgot-password', validate(forgotPasswordSchema), (req, res, next) =>
  authController.forgotPassword(req, res, next)
);

router.post('/reset-password', validate(resetPasswordSchema), (req, res, next) =>
  authController.resetPassword(req, res, next)
);

export const authRoutes = router;
