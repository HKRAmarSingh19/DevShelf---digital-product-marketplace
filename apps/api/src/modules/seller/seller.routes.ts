import { Router } from 'express';
import { sellerController } from './seller.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireSeller } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { sellerApplicationSchema } from '@devshelf/shared';

const router = Router();

// User: Apply to become a seller
router.post(
  '/apply',
  authenticate,
  validate(sellerApplicationSchema),
  (req, res, next) => sellerController.apply(req, res, next)
);

// Approved Seller: Get seller metrics & overview
router.get(
  '/dashboard',
  authenticate,
  requireSeller,
  (req, res, next) => sellerController.getDashboard(req, res, next)
);

// Approved Seller: Get products managed by seller
router.get(
  '/products',
  authenticate,
  requireSeller,
  (req, res, next) => sellerController.getProducts(req, res, next)
);

export const sellerRoutes = router;
