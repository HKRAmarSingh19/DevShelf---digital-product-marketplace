import { Router, Request, Response, NextFunction } from 'express';
import { CategoryModel } from './category.model.js';
import { sendSuccess } from '../../common/utils/response.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/authorize.js';

const router = Router();

// Public: Get all categories
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
});

// Admin: Create category
router.post(
  '/',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, slug, description, icon } = req.body;
      const category = await CategoryModel.create({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        icon: icon || 'Folder',
      });
      return sendSuccess(res, category, 'Category created', 201);
    } catch (error) {
      next(error);
    }
  }
);

export const categoryRoutes = router;
