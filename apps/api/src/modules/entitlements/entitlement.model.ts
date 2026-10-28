import mongoose, { Schema, Document } from 'mongoose';
import {
  ENTITLEMENT_STATUS,
  LICENSE_TYPES,
  EntitlementStatus,
  LicenseType,
} from '@devshelf/shared';

export interface IEntitlementDocument extends Document {
  buyerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  licenseType: LicenseType;
  status: EntitlementStatus;
  purchasedAt: Date;
  revokedAt?: Date;
  downloadCount: number;
  lastDownloadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EntitlementSchema = new Schema<IEntitlementDocument>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    licenseType: {
      type: String,
      enum: Object.values(LICENSE_TYPES),
      default: LICENSE_TYPES.STANDARD,
    },
    status: {
      type: String,
      enum: Object.values(ENTITLEMENT_STATUS),
      default: ENTITLEMENT_STATUS.ACTIVE,
      index: true,
    },
    purchasedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    downloadCount: { type: Number, default: 0 },
    lastDownloadedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find user entitlement for a product
EntitlementSchema.index({ buyerId: 1, productId: 1, status: 1 });

export const EntitlementModel = mongoose.model<IEntitlementDocument>(
  'Entitlement',
  EntitlementSchema
);

export interface IDownloadEventDocument extends Document {
  entitlementId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  version: string;
  ipAddress?: string;
  userAgent?: string;
  downloadedAt: Date;
}

const DownloadEventSchema = new Schema<IDownloadEventDocument>({
  entitlementId: { type: Schema.Types.ObjectId, ref: 'Entitlement', required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  version: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  downloadedAt: { type: Date, default: Date.now },
});

export const DownloadEventModel = mongoose.model<IDownloadEventDocument>(
  'DownloadEvent',
  DownloadEventSchema
);
