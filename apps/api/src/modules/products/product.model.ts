import mongoose, { Schema, Document } from 'mongoose';
import {
  PRODUCT_TYPES,
  PRODUCT_STATUS,
  ProductType,
  ProductStatus,
} from '@devshelf/shared';

export interface IProductDocument extends Document {
  sellerId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  productType: ProductType;
  priceInPaise: number;
  currency: 'INR';
  thumbnailUrl?: string;
  previewUrls: string[];
  status: ProductStatus;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  currentVersion: string;
  moderationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    productType: {
      type: String,
      enum: Object.values(PRODUCT_TYPES),
      required: true,
      index: true,
    },
    priceInPaise: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    thumbnailUrl: { type: String, default: '' },
    previewUrls: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.DRAFT,
      index: true,
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    tags: [{ type: String }],
    currentVersion: { type: String, default: '1.0.0' },
    moderationNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
