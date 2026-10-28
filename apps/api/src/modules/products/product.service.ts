import { ProductModel, IProductDocument } from './product.model.js';
import { ProductVersionModel, IProductVersionDocument } from './productVersion.model.js';
import { AppError } from '../../common/errors/AppError.js';
import { PRODUCT_STATUS, ProductType, ProductStatus } from '@devshelf/shared';
import mongoose from 'mongoose';

export interface ProductFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  categoryId?: string;
  productType?: ProductType;
  minPricePaise?: number;
  maxPricePaise?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  sellerId?: string;
}

export class ProductService {
  async listPublicProducts(filter: ProductFilterQuery) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filter.limit) || 12));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      status: PRODUCT_STATUS.PUBLISHED,
    };

    if (filter.categoryId) {
      query.categoryId = new mongoose.Types.ObjectId(filter.categoryId);
    }

    if (filter.productType) {
      query.productType = filter.productType;
    }

    if (filter.sellerId) {
      query.sellerId = new mongoose.Types.ObjectId(filter.sellerId);
    }

    if (filter.minPricePaise !== undefined || filter.maxPricePaise !== undefined) {
      query.priceInPaise = {};
      if (filter.minPricePaise !== undefined) query.priceInPaise.$gte = filter.minPricePaise;
      if (filter.maxPricePaise !== undefined) query.priceInPaise.$lte = filter.maxPricePaise;
    }

    if (filter.search && filter.search.trim()) {
      const term = filter.search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { tags: { $in: [new RegExp(term, 'i')] } },
      ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sort: any = { createdAt: -1 };
    if (filter.sortBy === 'price-asc') sort = { priceInPaise: 1 };
    else if (filter.sortBy === 'price-desc') sort = { priceInPaise: -1 };
    else if (filter.sortBy === 'rating') sort = { averageRating: -1, reviewCount: -1 };

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .populate('sellerId', 'name avatarUrl bio')
        .populate('categoryId', 'name slug icon')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return {
      products: products.map((p) => this.formatProduct(p)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductBySlug(slug: string, userId?: string, isAdmin = false) {
    const product = await ProductModel.findOne({ slug })
      .populate('sellerId', 'name avatarUrl bio')
      .populate('categoryId', 'name slug icon')
      .lean();

    if (!product) {
      throw AppError.notFound('Product not found');
    }

    // If not published, only the seller owner or admin may view
    if (product.status !== PRODUCT_STATUS.PUBLISHED) {
      const isOwner = userId && product.sellerId?._id?.toString() === userId;
      if (!isOwner && !isAdmin) {
        throw AppError.notFound('Product not found or not published yet');
      }
    }

    return this.formatProduct(product);
  }

  async createProduct(
    sellerId: string,
    data: {
      title: string;
      description: string;
      categoryId: string;
      productType: ProductType;
      priceInRupees: number;
      thumbnailUrl?: string;
      previewUrls?: string[];
      tags?: string[];
    }
  ) {
    // Generate unique slug
    let baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (!baseSlug) baseSlug = 'product';

    let slug = baseSlug;
    let counter = 1;
    while (await ProductModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Convert Rupees to minor integer paise
    const priceInPaise = Math.round(data.priceInRupees * 100);

    const product = await ProductModel.create({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      title: data.title,
      slug,
      description: data.description,
      categoryId: new mongoose.Types.ObjectId(data.categoryId),
      productType: data.productType,
      priceInPaise,
      currency: 'INR',
      thumbnailUrl: data.thumbnailUrl || '',
      previewUrls: data.previewUrls || [],
      tags: data.tags || [],
      status: PRODUCT_STATUS.DRAFT,
      averageRating: 0,
      reviewCount: 0,
      currentVersion: '1.0.0',
    });

    return product;
  }

  async updateProduct(
    productId: string,
    sellerId: string,
    isAdmin: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw AppError.notFound('Product not found');
    }

    // Enforce IDOR protection: only owner or admin can update
    if (product.sellerId.toString() !== sellerId && !isAdmin) {
      throw AppError.forbidden('You do not have permission to modify this product');
    }

    if (data.title) product.title = data.title;
    if (data.description) product.description = data.description;
    if (data.categoryId) product.categoryId = new mongoose.Types.ObjectId(data.categoryId);
    if (data.productType) product.productType = data.productType;
    if (data.priceInRupees !== undefined) {
      product.priceInPaise = Math.round(data.priceInRupees * 100);
    }
    if (data.thumbnailUrl !== undefined) product.thumbnailUrl = data.thumbnailUrl;
    if (data.previewUrls) product.previewUrls = data.previewUrls;
    if (data.tags) product.tags = data.tags;

    if (data.status) {
      // Sellers can set to DRAFT or PENDING_REVIEW; only Admins can set to PUBLISHED or REJECTED
      if (!isAdmin && (data.status === PRODUCT_STATUS.PUBLISHED || data.status === PRODUCT_STATUS.REJECTED)) {
        throw AppError.forbidden('Only administrators can approve or reject products');
      }
      product.status = data.status;
    }

    await product.save();
    return product;
  }

  async submitForReview(productId: string, sellerId: string) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw AppError.notFound('Product not found');
    }
    if (product.sellerId.toString() !== sellerId) {
      throw AppError.forbidden('Only product owner can submit for review');
    }

    product.status = PRODUCT_STATUS.PENDING_REVIEW;
    await product.save();
    return product;
  }

  async addVersion(
    productId: string,
    sellerId: string,
    isAdmin: boolean,
    data: {
      version: string;
      changelog: string;
      storageKey: string;
      originalFilename: string;
      fileSizeBytes: number;
      checksum?: string;
    }
  ) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw AppError.notFound('Product not found');
    }
    if (product.sellerId.toString() !== sellerId && !isAdmin) {
      throw AppError.forbidden('Only product owner can publish versions');
    }

    const versionDoc = await ProductVersionModel.create({
      productId: product._id,
      version: data.version,
      changelog: data.changelog,
      storageKey: data.storageKey,
      originalFilename: data.originalFilename,
      fileSizeBytes: data.fileSizeBytes,
      checksum: data.checksum,
    });

    product.currentVersion = data.version;
    await product.save();

    return versionDoc;
  }

  async getVersions(productId: string): Promise<IProductVersionDocument[]> {
    return ProductVersionModel.find({ productId: new mongoose.Types.ObjectId(productId) })
      .sort({ createdAt: -1 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatProduct(p: any) {
    return {
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId?._id ? p.categoryId._id.toString() : p.categoryId?.toString(),
      category: p.categoryId?.name
        ? {
            id: p.categoryId._id.toString(),
            name: p.categoryId.name,
            slug: p.categoryId.slug,
            icon: p.categoryId.icon,
          }
        : undefined,
      productType: p.productType,
      priceInPaise: p.priceInPaise,
      priceInRupees: p.priceInPaise / 100,
      currency: p.currency,
      thumbnailUrl: p.thumbnailUrl,
      previewUrls: p.previewUrls || [],
      status: p.status,
      averageRating: p.averageRating,
      reviewCount: p.reviewCount,
      tags: p.tags || [],
      currentVersion: p.currentVersion,
      sellerId: p.sellerId?._id ? p.sellerId._id.toString() : p.sellerId?.toString(),
      seller: p.sellerId?.name
        ? {
            id: p.sellerId._id.toString(),
            name: p.sellerId.name,
            avatarUrl: p.sellerId.avatarUrl,
            bio: p.sellerId.bio,
          }
        : undefined,
      createdAt: p.createdAt?.toISOString ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt?.toISOString ? p.updatedAt.toISOString() : p.updatedAt,
    };
  }
}

export const productService = new ProductService();
