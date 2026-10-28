import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  productId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isVerifiedPurchase: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// One review per buyer per product
ReviewSchema.index({ productId: 1, buyerId: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReviewDocument>('Review', ReviewSchema);

export interface ICommissionDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  grossSaleInPaise: number;
  platformFeeInPaise: number;
  netSellerAmountInPaise: number;
  currency: 'INR';
  status: 'PENDING' | 'AVAILABLE' | 'PAID_OUT' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSchema = new Schema<ICommissionDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    grossSaleInPaise: { type: Number, required: true },
    platformFeeInPaise: { type: Number, required: true },
    netSellerAmountInPaise: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['PENDING', 'AVAILABLE', 'PAID_OUT', 'REFUNDED'],
      default: 'AVAILABLE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CommissionModel = mongoose.model<ICommissionDocument>(
  'Commission',
  CommissionSchema
);

export interface IAuditLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
