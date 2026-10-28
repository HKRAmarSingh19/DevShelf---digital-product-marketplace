import { Router, Request, Response, NextFunction } from 'express';
import { reviewService } from './review.service.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createReviewSchema } from '@devshelf/shared';
import { sendSuccess } from '../../common/utils/response.js';

const router = Router({ mergeParams: true });

// Public: Get reviews for a product
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsForProduct(productId);
    return sendSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
});

// Buyer: Leave verified purchase review
router.post(
  '/',
  authenticate,
  validate(createReviewSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buyerId = req.user!._id.toString();
      const { productId } = req.params;
      const { rating, comment } = req.body;

      const review = await reviewService.createReview(
        buyerId,
        productId,
        rating,
        comment
      );

      return sendSuccess(res, review, 'Review submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }
);

export const reviewRoutes = router;
