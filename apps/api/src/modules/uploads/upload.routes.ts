import { Router } from 'express';
import { uploadController, uploadMiddleware } from './upload.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireSeller } from '../../middleware/authorize.js';

const router = Router();

// Seller: Upload private product file asset
router.post(
  '/file',
  authenticate,
  requireSeller,
  uploadMiddleware,
  (req, res, next) => uploadController.uploadProductFile(req, res, next)
);

// Seller: Upload public thumbnail / preview image
router.post(
  '/preview',
  authenticate,
  requireSeller,
  uploadMiddleware,
  (req, res, next) => uploadController.uploadPreview(req, res, next)
);

// Public stream for preview images
router.get('/raw-preview/*', (req, res, next) =>
  uploadController.serveRawPreview(req, res, next)
);

// Secure Signed Download Stream (verifies HMAC and expiry)
router.get('/download-file', (req, res, next) =>
  uploadController.downloadSignedFile(req, res, next)
);

export const uploadRoutes = router;
