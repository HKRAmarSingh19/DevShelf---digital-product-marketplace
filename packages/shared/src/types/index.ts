import {
  UserRole,
  SellerStatus,
  UserStatus,
  ProductType,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  EntitlementStatus,
  LicenseType,
} from '../constants/index.js';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sellerStatus: SellerStatus;
  avatarUrl?: string;
  bio?: string;
  emailVerifiedAt?: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: string;
}

export interface IProductVersion {
  id: string;
  productId: string;
  version: string;
  changelog: string;
  storageKey: string;
  originalFilename: string;
  fileSizeBytes: number;
  checksum?: string;
  createdAt: string;
}

export interface IProduct {
  id: string;
  sellerId: string;
  seller?: {
    id: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: ICategory;
  productType: ProductType;
  priceInPaise: number;
  currency: 'INR';
  thumbnailUrl?: string;
  previewUrls: string[];
  status: ProductStatus;
  averageRating: number;
  reviewCount: number;
  tags?: string[];
  currentVersion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  productId: string;
  sellerId: string;
  titleSnapshot: string;
  unitPriceInPaise: number;
  quantity: number;
  licenseType: LicenseType;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  items: IOrderItem[];
  subtotalInPaise: number;
  discountInPaise: number;
  totalInPaise: number;
  currency: 'INR';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  id: string;
  orderId: string;
  buyerId: string;
  provider: 'RAZORPAY';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amountInPaise: number;
  currency: string;
  status: PaymentStatus;
  verifiedAt?: string;
  createdAt: string;
}

export interface IEntitlement {
  id: string;
  buyerId: string;
  productId: string;
  product?: IProduct;
  orderId: string;
  licenseType: LicenseType;
  status: EntitlementStatus;
  purchasedAt: string;
  revokedAt?: string;
}

export interface IReview {
  id: string;
  productId: string;
  buyerId: string;
  buyerName?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICommission {
  id: string;
  orderId: string;
  sellerId: string;
  grossSaleInPaise: number;
  platformFeeInPaise: number;
  netSellerAmountInPaise: number;
  currency: 'INR';
  status: 'PENDING' | 'AVAILABLE' | 'PAID_OUT' | 'REFUNDED';
  createdAt: string;
}

export interface IPayout {
  id: string;
  sellerId: string;
  amountInPaise: number;
  currency: 'INR';
  status: 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface IAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
