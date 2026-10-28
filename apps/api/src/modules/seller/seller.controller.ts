import { Request, Response, NextFunction } from 'express';
import { sellerService } from './seller.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export class SellerController {
  async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const user = await sellerService.apply(userId, req.body);
      return sendSuccess(
        res,
        { sellerStatus: user.sellerStatus },
        'Seller application submitted for review'
      );
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.user!._id.toString();
      const dashboard = await sellerService.getDashboard(sellerId);
      return sendSuccess(res, dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.user!._id.toString();
      const products = await sellerService.getSellerProducts(sellerId);
      return sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }
}

export const sellerController = new SellerController();
