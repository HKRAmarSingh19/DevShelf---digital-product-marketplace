import mongoose from 'mongoose';
import { ReviewModel } from './review.model.js';
import { EntitlementModel } from '../entitlements/entitlement.model.js';
import { ProductModel } from '../products/product.model.js';
import { AppError } from '../../common/errors/AppError.js';
import { ENTITLEMENT_STATUS } from '@devshelf/shared';

export class ReviewService {
  async getReviewsForProduct(productId: string) {
    const reviews = await ReviewModel.find({
      productId: new mongoose.Types.ObjectId(productId),
    })
      .populate('buyerId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .lean();

    return reviews.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      buyer: {
        id: (r.buyerId as any)?._id?.toString(),
        name: (r.buyerId as any)?.name || 'Anonymous Buyer',
        avatarUrl: (r.buyerId as any)?.avatarUrl,
      },
      createdAt: r.createdAt,
    }));
  }

  async createReview(
    buyerId: string,
    productId: string,
    rating: number,
    comment: string
  ) {
    // 1. Verify buyer has active entitlement
    const entitlement = await EntitlementModel.findOne({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: new mongoose.Types.ObjectId(productId),
      status: ENTITLEMENT_STATUS.ACTIVE,
    });

    if (!entitlement) {
      throw AppError.forbidden(
        'Only verified buyers who purchased this product can leave a review'
      );
    }

    // 2. Prevent duplicate reviews
    const existing = await ReviewModel.findOne({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: new mongoose.Types.ObjectId(productId),
    });

    if (existing) {
      throw AppError.conflict('You have already submitted a review for this product');
    }

    // 3. Create review
    const review = await ReviewModel.create({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: new mongoose.Types.ObjectId(productId),
      rating,
      comment,
      isVerifiedPurchase: true,
    });

    // 4. Recalculate average rating
    const aggregate = await ReviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (aggregate.length > 0) {
      await ProductModel.findByIdAndUpdate(productId, {
        averageRating: Math.round(aggregate[0].avgRating * 10) / 10,
        reviewCount: aggregate[0].count,
      });
    }

    return review;
  }
}

export const reviewService = new ReviewService();
