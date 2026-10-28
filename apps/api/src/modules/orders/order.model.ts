import mongoose, { Schema, Document } from 'mongoose';
import {
  ORDER_STATUS,
  LICENSE_TYPES,
  OrderStatus,
  LicenseType,
} from '@devshelf/shared';

export interface IOrderItemDocument {
  productId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  titleSnapshot: string;
  unitPriceInPaise: number;
  quantity: number;
  licenseType: LicenseType;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  buyerId: mongoose.Types.ObjectId;
  items: IOrderItemDocument[];
  subtotalInPaise: number;
  discountInPaise: number;
  totalInPaise: number;
  currency: 'INR';
  status: OrderStatus;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    titleSnapshot: { type: String, required: true },
    unitPriceInPaise: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    licenseType: {
      type: String,
      enum: Object.values(LICENSE_TYPES),
      default: LICENSE_TYPES.STANDARD,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    subtotalInPaise: { type: Number, required: true },
    discountInPaise: { type: Number, default: 0 },
    totalInPaise: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    gatewayOrderId: { type: String, index: true },
    gatewayPaymentId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model<IOrderDocument>('Order', OrderSchema);
