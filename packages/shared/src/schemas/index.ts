import { z } from 'zod';
import {
  USER_ROLES,
  SELLER_STATUS,
  USER_STATUS,
  PRODUCT_TYPES,
  PRODUCT_STATUS,
  LICENSE_TYPES,
} from '../constants/index.js';

// Auth Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

// Seller Schemas
export const sellerApplicationSchema = z.object({
  bio: z.string().min(20, 'Please write at least 20 characters describing your work and experience'),
  portfolioUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categoriesInterested: z.array(z.string()).min(1, 'Select at least one category of interest'),
});

// Product Schemas
export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  productType: z.enum([
    PRODUCT_TYPES.SOURCE_CODE,
    PRODUCT_TYPES.EBOOK,
    PRODUCT_TYPES.COURSE,
    PRODUCT_TYPES.UI_KIT,
    PRODUCT_TYPES.TEMPLATE,
    PRODUCT_TYPES.DEVELOPER_TOOL,
    PRODUCT_TYPES.OTHER,
  ]),
  priceInRupees: z.number().min(0, 'Price cannot be negative').max(500000, 'Price exceeds limit'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  previewUrls: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial().extend({
  status: z
    .enum([
      PRODUCT_STATUS.DRAFT,
      PRODUCT_STATUS.PENDING_REVIEW,
      PRODUCT_STATUS.PUBLISHED,
      PRODUCT_STATUS.ARCHIVED,
    ])
    .optional(),
});

export const createProductVersionSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format (e.g. 1.0.0)'),
  changelog: z.string().min(5, 'Changelog must be at least 5 characters'),
  storageKey: z.string().min(1, 'Storage key is required'),
  originalFilename: z.string().min(1, 'Original filename is required'),
  fileSizeBytes: z.number().positive('File size must be positive'),
  checksum: z.string().optional(),
});

// Cart & Checkout Schemas
export const checkoutSchema = z.object({
  productIds: z.array(z.string()).min(1, 'At least one product is required'),
  licenseType: z.enum([
    LICENSE_TYPES.STANDARD,
    LICENSE_TYPES.COMMERCIAL,
    LICENSE_TYPES.EXTENDED,
  ]).default(LICENSE_TYPES.STANDARD),
  couponCode: z.string().optional(),
});

export const paymentVerifySchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
});

// Review Schemas
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters').max(1000),
});

// Admin Schemas
export const adminSellerDecisionSchema = z.object({
  decision: z.enum([SELLER_STATUS.APPROVED, SELLER_STATUS.REJECTED]),
  notes: z.string().optional(),
});

export const adminProductModerationSchema = z.object({
  decision: z.enum([PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.REJECTED, PRODUCT_STATUS.ARCHIVED]),
  notes: z.string().optional(),
});

export const adminUserStatusSchema = z.object({
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED]),
  reason: z.string().optional(),
});
