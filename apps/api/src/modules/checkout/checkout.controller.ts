import { Request, Response, NextFunction } from 'express';
import { checkoutService } from './checkout.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export class CheckoutController {
  async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!._id.toString();
      const { productIds, licenseType } = req.body;
      const result = await checkoutService.initiateCheckout(buyerId, productIds, licenseType);
      return sendSuccess(res, result, 'Order initiated successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!._id.toString();
      const result = await checkoutService.verifyPayment(buyerId, req.body);
      return sendSuccess(res, result, 'Payment verified and access granted');
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const result = await checkoutService.handleWebhook(rawBody, signature);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const checkoutController = new CheckoutController();
