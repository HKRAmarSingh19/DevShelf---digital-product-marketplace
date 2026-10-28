import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service.js';
import { sendSuccess } from '../../common/utils/response.js';
import { USER_ROLES } from '@devshelf/shared';

export class ProductController {
  async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.listPublicProducts(req.query);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const userId = req.user?._id.toString();
      const isAdmin = req.user?.role === USER_ROLES.ADMIN;
      const product = await productService.getProductBySlug(slug, userId, isAdmin);
      return sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.user!._id.toString();
      const product = await productService.createProduct(sellerId, req.body);
      return sendSuccess(res, product, 'Product created as draft', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sellerId = req.user!._id.toString();
      const isAdmin = req.user?.role === USER_ROLES.ADMIN;
      const product = await productService.updateProduct(id, sellerId, isAdmin, req.body);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async submitForReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sellerId = req.user!._id.toString();
      const product = await productService.submitForReview(id, sellerId);
      return sendSuccess(res, product, 'Product submitted for review');
    } catch (error) {
      next(error);
    }
  }

  async addVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sellerId = req.user!._id.toString();
      const isAdmin = req.user?.role === USER_ROLES.ADMIN;
      const version = await productService.addVersion(id, sellerId, isAdmin, req.body);
      return sendSuccess(res, version, 'Product version published', 201);
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const versions = await productService.getVersions(id);
      return sendSuccess(res, versions);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
