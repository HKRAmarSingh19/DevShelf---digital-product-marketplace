import mongoose, { Schema, Document } from 'mongoose';
import {
  PAYMENT_STATUS,
  PaymentStatus,
} from '@devshelf/shared';

export interface IPaymentDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  provider: 'RAZORPAY';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  amountInPaise: number;
  currency: string;
  status: PaymentStatus;
  verifiedAt?: Date;
  rawPayload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: { type: String, default: 'RAZORPAY' },
    gatewayOrderId: { type: String, required: true, index: true },
    gatewayPaymentId: { type: String, index: true },
    gatewaySignature: { type: String },
    amountInPaise: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true,
    },
    verifiedAt: { type: Date },
    rawPayload: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);

export interface IWebhookEventDocument extends Document {
  eventId: string;
  eventType: string;
  processed: boolean;
  receivedAt: Date;
}

const WebhookEventSchema = new Schema<IWebhookEventDocument>({
  eventId: { type: String, required: true, unique: true, index: true },
  eventType: { type: String, required: true },
  processed: { type: Boolean, default: false },
  receivedAt: { type: Date, default: Date.now },
});

export const WebhookEventModel = mongoose.model<IWebhookEventDocument>(
  'WebhookEvent',
  WebhookEventSchema
);
