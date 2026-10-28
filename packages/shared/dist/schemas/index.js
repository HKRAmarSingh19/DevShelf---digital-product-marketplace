"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserStatusSchema = exports.adminProductModerationSchema = exports.adminSellerDecisionSchema = exports.createReviewSchema = exports.paymentVerifySchema = exports.checkoutSchema = exports.createProductVersionSchema = exports.updateProductSchema = exports.createProductSchema = exports.sellerApplicationSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const index_js_1 = require("../constants/index.js");
// Auth Schemas
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: zod_1.z.string().email('Invalid email address').toLowerCase(),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').toLowerCase(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').toLowerCase(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50).optional(),
    bio: zod_1.z.string().max(500).optional(),
    avatarUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
// Seller Schemas
exports.sellerApplicationSchema = zod_1.z.object({
    bio: zod_1.z.string().min(20, 'Please write at least 20 characters describing your work and experience'),
    portfolioUrl: zod_1.z.string().url('Must be a valid URL').optional().or(zod_1.z.literal('')),
    githubUrl: zod_1.z.string().url('Must be a valid URL').optional().or(zod_1.z.literal('')),
    categoriesInterested: zod_1.z.array(zod_1.z.string()).min(1, 'Select at least one category of interest'),
});
// Product Schemas
exports.createProductSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(120),
    description: zod_1.z.string().min(20, 'Description must be at least 20 characters'),
    categoryId: zod_1.z.string().min(1, 'Category is required'),
    productType: zod_1.z.enum([
        index_js_1.PRODUCT_TYPES.SOURCE_CODE,
        index_js_1.PRODUCT_TYPES.EBOOK,
        index_js_1.PRODUCT_TYPES.COURSE,
        index_js_1.PRODUCT_TYPES.UI_KIT,
        index_js_1.PRODUCT_TYPES.TEMPLATE,
        index_js_1.PRODUCT_TYPES.DEVELOPER_TOOL,
        index_js_1.PRODUCT_TYPES.OTHER,
    ]),
    priceInRupees: zod_1.z.number().min(0, 'Price cannot be negative').max(500000, 'Price exceeds limit'),
    thumbnailUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    previewUrls: zod_1.z.array(zod_1.z.string().url()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.updateProductSchema = exports.createProductSchema.partial().extend({
    status: zod_1.z
        .enum([
        index_js_1.PRODUCT_STATUS.DRAFT,
        index_js_1.PRODUCT_STATUS.PENDING_REVIEW,
        index_js_1.PRODUCT_STATUS.PUBLISHED,
        index_js_1.PRODUCT_STATUS.ARCHIVED,
    ])
        .optional(),
});
exports.createProductVersionSchema = zod_1.z.object({
    version: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format (e.g. 1.0.0)'),
    changelog: zod_1.z.string().min(5, 'Changelog must be at least 5 characters'),
    storageKey: zod_1.z.string().min(1, 'Storage key is required'),
    originalFilename: zod_1.z.string().min(1, 'Original filename is required'),
    fileSizeBytes: zod_1.z.number().positive('File size must be positive'),
    checksum: zod_1.z.string().optional(),
});
// Cart & Checkout Schemas
exports.checkoutSchema = zod_1.z.object({
    productIds: zod_1.z.array(zod_1.z.string()).min(1, 'At least one product is required'),
    licenseType: zod_1.z.enum([
        index_js_1.LICENSE_TYPES.STANDARD,
        index_js_1.LICENSE_TYPES.COMMERCIAL,
        index_js_1.LICENSE_TYPES.EXTENDED,
    ]).default(index_js_1.LICENSE_TYPES.STANDARD),
    couponCode: zod_1.z.string().optional(),
});
exports.paymentVerifySchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1, 'Order ID is required'),
    razorpayOrderId: zod_1.z.string().min(1, 'Razorpay order ID is required'),
    razorpayPaymentId: zod_1.z.string().min(1, 'Razorpay payment ID is required'),
    razorpaySignature: zod_1.z.string().min(1, 'Razorpay signature is required'),
});
// Review Schemas
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().min(5, 'Review must be at least 5 characters').max(1000),
});
// Admin Schemas
exports.adminSellerDecisionSchema = zod_1.z.object({
    decision: zod_1.z.enum([index_js_1.SELLER_STATUS.APPROVED, index_js_1.SELLER_STATUS.REJECTED]),
    notes: zod_1.z.string().optional(),
});
exports.adminProductModerationSchema = zod_1.z.object({
    decision: zod_1.z.enum([index_js_1.PRODUCT_STATUS.PUBLISHED, index_js_1.PRODUCT_STATUS.REJECTED, index_js_1.PRODUCT_STATUS.ARCHIVED]),
    notes: zod_1.z.string().optional(),
});
exports.adminUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([index_js_1.USER_STATUS.ACTIVE, index_js_1.USER_STATUS.SUSPENDED]),
    reason: zod_1.z.string().optional(),
});
//# sourceMappingURL=index.js.map