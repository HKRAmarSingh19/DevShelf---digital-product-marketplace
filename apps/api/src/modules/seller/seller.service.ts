import mongoose from 'mongoose';
import { UserModel } from '../users/user.model.js';
import { ProductModel } from '../products/product.model.js';
import { CommissionModel } from '../reviews/review.model.js';
import { AppError } from '../../common/errors/AppError.js';
import { SELLER_STATUS } from '@devshelf/shared';

export class SellerService {
  async apply(
    userId: string,
    data: {
      bio: string;
      portfolioUrl?: string;
      githubUrl?: string;
      categoriesInterested: string[];
    }
  ) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    if (user.sellerStatus === SELLER_STATUS.APPROVED) {
      throw AppError.badRequest('You are already an approved seller');
    }

    if (user.sellerStatus === SELLER_STATUS.PENDING) {
      throw AppError.badRequest('Your seller application is already pending review');
    }

    user.sellerStatus = SELLER_STATUS.PENDING;
    user.sellerApplication = {
      bio: data.bio,
      portfolioUrl: data.portfolioUrl,
      githubUrl: data.githubUrl,
      categoriesInterested: data.categoriesInterested,
      appliedAt: new Date(),
    };

    await user.save();
    return user;
  }

  async getDashboard(sellerId: string) {
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    // 1. Product stats
    const productStats = await ProductModel.aggregate([
      { $match: { sellerId: sellerObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    let totalProducts = 0;
    let publishedProducts = 0;
    let draftProducts = 0;
    let pendingProducts = 0;

    for (const item of productStats) {
      totalProducts += item.count;
      if (item._id === 'PUBLISHED') publishedProducts = item.count;
      if (item._id === 'DRAFT') draftProducts = item.count;
      if (item._id === 'PENDING_REVIEW') pendingProducts = item.count;
    }

    // 2. Financial Ledger aggregation
    const financialStats = await CommissionModel.aggregate([
      { $match: { sellerId: sellerObjectId } },
      {
        $group: {
          _id: null,
          totalSalesCount: { $sum: 1 },
          grossSalesInPaise: { $sum: '$grossSaleInPaise' },
          platformFeesInPaise: { $sum: '$platformFeeInPaise' },
          netEarningsInPaise: { $sum: '$netSellerAmountInPaise' },
        },
      },
    ]);

    const finance = financialStats[0] || {
      totalSalesCount: 0,
      grossSalesInPaise: 0,
      platformFeesInPaise: 0,
      netEarningsInPaise: 0,
    };

    // 3. Recent sales
    const recentSales = await CommissionModel.find({ sellerId: sellerObjectId })
      .populate({
        path: 'orderId',
        populate: { path: 'buyerId', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      products: {
        total: totalProducts,
        published: publishedProducts,
        draft: draftProducts,
        pending: pendingProducts,
      },
      earnings: {
        totalSalesCount: finance.totalSalesCount,
        grossSalesInPaise: finance.grossSalesInPaise,
        grossSalesInRupees: finance.grossSalesInPaise / 100,
        platformFeesInPaise: finance.platformFeesInPaise,
        platformFeesInRupees: finance.platformFeesInPaise / 100,
        netEarningsInPaise: finance.netEarningsInPaise,
        netEarningsInRupees: finance.netEarningsInPaise / 100,
      },
      recentSales: recentSales.map((s) => ({
        id: s._id.toString(),
        orderId: (s.orderId as any)?._id?.toString(),
        orderNumber: (s.orderId as any)?.orderNumber,
        buyerName: (s.orderId as any)?.buyerId?.name || 'Customer',
        grossSaleInRupees: s.grossSaleInPaise / 100,
        netEarningsInRupees: s.netSellerAmountInPaise / 100,
        createdAt: s.createdAt,
      })),
    };
  }

  async getSellerProducts(sellerId: string) {
    const products = await ProductModel.find({
      sellerId: new mongoose.Types.ObjectId(sellerId),
    })
      .populate('categoryId', 'name slug icon')
      .sort({ createdAt: -1 })
      .lean();

    return products.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      productType: p.productType,
      categoryName: (p.categoryId as any)?.name || 'Uncategorized',
      priceInRupees: p.priceInPaise / 100,
      status: p.status,
      averageRating: p.averageRating,
      reviewCount: p.reviewCount,
      currentVersion: p.currentVersion,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }
}

export const sellerService = new SellerService();
