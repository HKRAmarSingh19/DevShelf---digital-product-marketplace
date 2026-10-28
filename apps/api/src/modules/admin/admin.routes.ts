import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  adminSellerDecisionSchema,
  adminProductModerationSchema,
  adminUserStatusSchema,
} from '@devshelf/shared';

const router = Router();

// All routes here strictly require authentication + ADMIN role
router.use(authenticate, requireAdmin);

router.get('/overview', (req, res, next) => adminController.getOverview(req, res, next));

router.get('/users', (req, res, next) => adminController.listUsers(req, res, next));
router.patch('/users/:id/status', validate(adminUserStatusSchema), (req, res, next) =>
  adminController.updateUserStatus(req, res, next)
);

router.get('/sellers', (req, res, next) =>
  adminController.listSellerApplications(req, res, next)
);
router.patch(
  '/sellers/:id/decision',
  validate(adminSellerDecisionSchema),
  (req, res, next) => adminController.decideSellerApplication(req, res, next)
);

router.get('/products/pending', (req, res, next) =>
  adminController.listPendingProducts(req, res, next)
);
router.patch(
  '/products/:id/moderation',
  validate(adminProductModerationSchema),
  (req, res, next) => adminController.moderateProduct(req, res, next)
);

router.get('/audit-logs', (req, res, next) =>
  adminController.listAuditLogs(req, res, next)
);

export const adminRoutes = router;
