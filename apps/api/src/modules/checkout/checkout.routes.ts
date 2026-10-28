import { Router } from 'express';
import { checkoutController } from './checkout.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { checkoutSchema, paymentVerifySchema } from '@devshelf/shared';

const router = Router();

// Buyer: Initiate checkout
router.post(
  '/',
  authenticate,
  validate(checkoutSchema),
  (req, res, next) => checkoutController.initiate(req, res, next)
);

// Buyer: Verify payment result
router.post(
  '/verify',
  authenticate,
  validate(paymentVerifySchema),
  (req, res, next) => checkoutController.verify(req, res, next)
);

// Razorpay Webhook listener (idempotent, server-to-server)
router.post('/webhook', (req, res, next) =>
  checkoutController.webhook(req, res, next)
);

export const checkoutRoutes = router;
