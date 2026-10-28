import { UserModel } from '../users/user.model.js';
import { ProductModel } from '../products/product.model.js';
import { OrderModel } from '../orders/order.model.js';
import { AuditLogModel } from '../reviews/review.model.js';
import { AppError } from '../../common/errors/AppError.js';
import {
  SELLER_STATUS,
  PRODUCT_STATUS,
  ORDER_STATUS,
  USER_STATUS,
  SellerStatus,
  ProductStatus,
  UserStatus,
} from '@devshelf/shared';
import mongoose from 'mongoose';

export class AdminService {
  async getOverview() {
    const [
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      pendingProducts,
      ordersAggregate,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ sellerStatus: SELLER_STATUS.APPROVED }),
      UserModel.countDocuments({ sellerStatus: SELLER_STATUS.PENDING }),
      ProductModel.countDocuments({ status: PRODUCT_STATUS.PUBLISHED }),
      ProductModel.countDocuments({ status: PRODUCT_STATUS.PENDING_REVIEW }),
      OrderModel.aggregate([
        { $match: { status: ORDER_STATUS.PAID } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalGmvInPaise: { $sum: '$totalInPaise' },
          },
        },
      ]),
    ]);

    const orderData = ordersAggregate[0] || { totalOrders: 0, totalGmvInPaise: 0 };

    return {
      users: {
        total: totalUsers,
        sellers: totalSellers,
        pendingSellerApplications: pendingSellers,
      },
      products: {
        published: totalProducts,
        pendingModeration: pendingProducts,
      },
      orders: {
        totalPaidOrders: orderData.totalOrders,
        gmvInPaise: orderData.totalGmvInPaise,
        gmvInRupees: orderData.totalGmvInPaise / 100,
      },
    };
  }

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find()
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(),
    ]);

    return {
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        sellerStatus: u.sellerStatus,
        status: u.status,
        createdAt: u.createdAt,
      })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserStatus(
    adminUser: { id: string; email: string },
    targetUserId: string,
    status: UserStatus,
    reason?: string
  ) {
    const user = await UserModel.findById(targetUserId);
    if (!user) throw AppError.notFound('User not found');

    if (user._id.toString() === adminUser.id) {
      throw AppError.badRequest('Administrators cannot suspend their own account');
    }

    const previousStatus = user.status;
    user.status = status;
    await user.save();

    await AuditLogModel.create({
      userId: new mongoose.Types.ObjectId(adminUser.id),
      userEmail: adminUser.email,
      action: 'UPDATE_USER_STATUS',
      resource: 'User',
      resourceId: user._id.toString(),
      details: { previousStatus, newStatus: status, reason },
    });

    return user;
  }

  async listSellerApplications() {
    const pending = await UserModel.find({
      sellerStatus: SELLER_STATUS.PENDING,
    })
      .select('name email sellerApplication createdAt')
      .sort({ 'sellerApplication.appliedAt': -1 })
      .lean();

    return pending.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      application: u.sellerApplication,
      createdAt: u.createdAt,
    }));
  }

  async decideSellerApplication(
    adminUser: { id: string; email: string },
    targetUserId: string,
    decision: SellerStatus,
    notes?: string
  ) {
    const user = await UserModel.findById(targetUserId);
    if (!user) throw AppError.notFound('User not found');

    user.sellerStatus = decision;
    if (user.sellerApplication) {
      user.sellerApplication.decisionAt = new Date();
      user.sellerApplication.decisionNotes = notes;
    }
    await user.save();

    await AuditLogModel.create({
      userId: new mongoose.Types.ObjectId(adminUser.id),
      userEmail: adminUser.email,
      action: `SELLER_APPLICATION_${decision}`,
      resource: 'User',
      resourceId: user._id.toString(),
      details: { decision, notes },
    });

    return user;
  }

  async listPendingProducts() {
    const products = await ProductModel.find({
      status: PRODUCT_STATUS.PENDING_REVIEW,
    })
      .populate('sellerId', 'name email')
      .populate('categoryId', 'name slug')
      .sort({ updatedAt: -1 })
      .lean();

    return products.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      description: p.description,
      productType: p.productType,
      priceInRupees: p.priceInPaise / 100,
      seller: p.sellerId,
      category: p.categoryId,
      thumbnailUrl: p.thumbnailUrl,
      currentVersion: p.currentVersion,
      createdAt: p.createdAt,
    }));
  }

  async moderateProduct(
    adminUser: { id: string; email: string },
    productId: string,
    decision: ProductStatus,
    notes?: string
  ) {
    const product = await ProductModel.findById(productId);
    if (!product) throw AppError.notFound('Product not found');

    const previousStatus = product.status;
    product.status = decision;
    product.moderationNotes = notes;
    await product.save();

    await AuditLogModel.create({
      userId: new mongoose.Types.ObjectId(adminUser.id),
      userEmail: adminUser.email,
      action: `PRODUCT_MODERATION_${decision}`,
      resource: 'Product',
      resourceId: product._id.toString(),
      details: { previousStatus, newStatus: decision, notes },
    });

    return product;
  }

  async listAuditLogs(limit = 50) {
    return AuditLogModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}

export const adminService = new AdminService();
