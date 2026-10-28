import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service.js';
import { sendSuccess } from '../../common/utils/response.js';

export class AdminController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await adminService.getOverview();
      return sendSuccess(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await adminService.listUsers(page, limit);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = { id: req.user!._id.toString(), email: req.user!.email };
      const { id } = req.params;
      const { status, reason } = req.body;
      const user = await adminService.updateUserStatus(adminUser, id, status, reason);
      return sendSuccess(res, user, 'User status updated');
    } catch (error) {
      next(error);
    }
  }

  async listSellerApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await adminService.listSellerApplications();
      return sendSuccess(res, applications);
    } catch (error) {
      next(error);
    }
  }

  async decideSellerApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = { id: req.user!._id.toString(), email: req.user!.email };
      const { id } = req.params;
      const { decision, notes } = req.body;
      const user = await adminService.decideSellerApplication(adminUser, id, decision, notes);
      return sendSuccess(res, user, `Seller application ${decision.toLowerCase()}`);
    } catch (error) {
      next(error);
    }
  }

  async listPendingProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await adminService.listPendingProducts();
      return sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }

  async moderateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = { id: req.user!._id.toString(), email: req.user!.email };
      const { id } = req.params;
      const { decision, notes } = req.body;
      const product = await adminService.moderateProduct(adminUser, id, decision, notes);
      return sendSuccess(res, product, `Product ${decision.toLowerCase()}`);
    } catch (error) {
      next(error);
    }
  }

  async listAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await adminService.listAuditLogs();
      return sendSuccess(res, logs);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
