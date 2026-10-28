import { Router } from 'express';
import { libraryController } from './library.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Buyer: Get all owned products
router.get('/', authenticate, (req, res, next) =>
  libraryController.getMyLibrary(req, res, next)
);

// Buyer: Get details & versions of specific owned product
router.get('/:productId', authenticate, (req, res, next) =>
  libraryController.getLibraryItem(req, res, next)
);

// Buyer: Authorize & request signed download URL
router.get('/:productId/download', authenticate, (req, res, next) =>
  libraryController.download(req, res, next)
);

export const libraryRoutes = router;
