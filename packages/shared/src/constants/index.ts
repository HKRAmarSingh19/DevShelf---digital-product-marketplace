export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const SELLER_STATUS = {
  NOT_APPLIED: 'NOT_APPLIED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type SellerStatus = (typeof SELLER_STATUS)[keyof typeof SELLER_STATUS];

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const PRODUCT_TYPES = {
  SOURCE_CODE: 'SOURCE_CODE',
  EBOOK: 'EBOOK',
  COURSE: 'COURSE',
  UI_KIT: 'UI_KIT',
  TEMPLATE: 'TEMPLATE',
  DEVELOPER_TOOL: 'DEVELOPER_TOOL',
  OTHER: 'OTHER',
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const ENTITLEMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED',
} as const;

export type EntitlementStatus = (typeof ENTITLEMENT_STATUS)[keyof typeof ENTITLEMENT_STATUS];

export const LICENSE_TYPES = {
  STANDARD: 'STANDARD',
  COMMERCIAL: 'COMMERCIAL',
  EXTENDED: 'EXTENDED',
} as const;

export type LicenseType = (typeof LICENSE_TYPES)[keyof typeof LICENSE_TYPES];

export const CURRENCY = {
  INR: 'INR',
} as const;

export const DEFAULT_PLATFORM_FEE_PERCENTAGE = 10; // 10% platform fee
