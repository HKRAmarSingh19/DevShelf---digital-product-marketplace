import { Router } from 'express';
import { productController } from './product.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { requireSeller } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  createProductVersionSchema,
} from '@devshelf/shared';

const router = Router();

// Public: List products with filters & pagination
router.get('/', (req, res, next) => productController.listPublic(req, res, next));

// Public or Owner/Admin: Get product by slug
router.get('/:slug', optionalAuthenticate, (req, res, next) =>
  productController.getBySlug(req, res, next)
);

// Seller: Create draft product
router.post(
  '/',
  authenticate,
  requireSeller,
  validate(createProductSchema),
  (req, res, next) => productController.create(req, res, next)
);

// Seller/Admin: Update product
router.patch(
  '/:id',
  authenticate,
  validate(updateProductSchema),
  (req, res, next) => productController.update(req, res, next)
);

// Seller: Submit product for moderation review
router.post(
  '/:id/submit-for-review',
  authenticate,
  requireSeller,
  (req, res, next) => productController.submitForReview(req, res, next)
);

// Seller: Publish new version
router.post(
  '/:id/versions',
  authenticate,
  requireSeller,
  validate(createProductVersionSchema),
  (req, res, next) => productController.addVersion(req, res, next)
);

// Get product version history
router.get('/:id/versions', (req, res, next) =>
  productController.getVersions(req, res, next)
);

export const productRoutes = router;
