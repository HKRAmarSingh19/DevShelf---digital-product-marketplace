import mongoose from 'mongoose';
import { ProductModel } from '../products/product.model.js';
import { OrderModel, IOrderDocument } from '../orders/order.model.js';
import { PaymentModel } from '../payments/payment.model.js';
import { WebhookEventModel } from '../payments/payment.model.js';
import { EntitlementModel } from '../entitlements/entitlement.model.js';
import { CommissionModel } from '../reviews/review.model.js';
import { razorpayService } from '../../integrations/razorpay/razorpay.service.js';
import { AppError } from '../../common/errors/AppError.js';
import {
  PRODUCT_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  ENTITLEMENT_STATUS,
  DEFAULT_PLATFORM_FEE_PERCENTAGE,
  LicenseType,
} from '@devshelf/shared';

export class CheckoutService {
  async initiateCheckout(
    buyerId: string,
    productIds: string[],
    licenseType: LicenseType = 'STANDARD'
  ) {
    if (!productIds || productIds.length === 0) {
      throw AppError.badRequest('At least one product must be selected');
    }

    const objectIds = productIds.map((id) => new mongoose.Types.ObjectId(id));
    const products = await ProductModel.find({
      _id: { $in: objectIds },
      status: PRODUCT_STATUS.PUBLISHED,
    });

    if (products.length !== productIds.length) {
      throw AppError.badRequest('One or more selected products are invalid or no longer available');
    }

    // Check if buyer already owns any of these products
    const existingEntitlements = await EntitlementModel.find({
      buyerId: new mongoose.Types.ObjectId(buyerId),
      productId: { $in: objectIds },
      status: ENTITLEMENT_STATUS.ACTIVE,
    });

    if (existingEntitlements.length > 0) {
      throw AppError.conflict('You already own one or more of these products in your Library');
    }

    // Authoritative server-side price calculation
    let subtotalInPaise = 0;
    const items = products.map((product) => {
      subtotalInPaise += product.priceInPaise;
      return {
        productId: product._id,
        sellerId: product.sellerId,
        titleSnapshot: product.title,
        unitPriceInPaise: product.priceInPaise,
        quantity: 1,
        licenseType,
      };
    });

    const totalInPaise = subtotalInPaise;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create pending order
    const order = await OrderModel.create({
      orderNumber,
      buyerId: new mongoose.Types.ObjectId(buyerId),
      items,
      subtotalInPaise,
      discountInPaise: 0,
      totalInPaise,
      currency: 'INR',
      status: ORDER_STATUS.PENDING,
    });

    // Create Razorpay order
    const gatewayOrder = await razorpayService.createOrder(
      totalInPaise,
      'INR',
      orderNumber
    );

    order.gatewayOrderId = gatewayOrder.id;
    await order.save();

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      totalInPaise,
      totalInRupees: totalInPaise / 100,
      currency: 'INR',
      gatewayOrderId: gatewayOrder.id,
      razorpayKeyId: gatewayOrder.keyId,
    };
  }

  async verifyPayment(
    buyerId: string,
    data: {
      orderId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }
  ) {
    const order = await OrderModel.findById(data.orderId);
    if (!order) {
      throw AppError.notFound('Order not found');
    }

    if (order.buyerId.toString() !== buyerId) {
      throw AppError.forbidden('Unauthorized order verification');
    }

    if (order.status === ORDER_STATUS.PAID) {
      return { message: 'Order is already marked as paid', orderId: order._id.toString() };
    }

    // Signature check
    const isValid = razorpayService.verifyPaymentSignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature
    );

    if (!isValid) {
      throw AppError.badRequest('Invalid payment signature');
    }

    // Create Payment record
    const payment = await PaymentModel.create({
      orderId: order._id,
      buyerId: order.buyerId,
      provider: 'RAZORPAY',
      gatewayOrderId: data.razorpayOrderId,
      gatewayPaymentId: data.razorpayPaymentId,
      gatewaySignature: data.razorpaySignature,
      amountInPaise: order.totalInPaise,
      currency: order.currency,
      status: PAYMENT_STATUS.CAPTURED,
      verifiedAt: new Date(),
    });

    // Mark order PAID
    order.status = ORDER_STATUS.PAID;
    order.gatewayPaymentId = data.razorpayPaymentId;
    await order.save();

    // Idempotently create Entitlements and Seller Commissions
    await this.fulfillOrder(order);

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order._id.toString(),
      totalInPaise: order.totalInPaise,
    };
  }

  async fulfillOrder(order: IOrderDocument) {
    for (const item of order.items) {
      // 1. Create or ensure Entitlement
      const existing = await EntitlementModel.findOne({
        buyerId: order.buyerId,
        productId: item.productId,
      });

      if (!existing) {
        await EntitlementModel.create({
          buyerId: order.buyerId,
          productId: item.productId,
          orderId: order._id,
          licenseType: item.licenseType,
          status: ENTITLEMENT_STATUS.ACTIVE,
          purchasedAt: new Date(),
        });
      }

      // 2. Compute platform fee & net seller amount
      const platformFee = Math.round(
        (item.unitPriceInPaise * DEFAULT_PLATFORM_FEE_PERCENTAGE) / 100
      );
      const netSellerAmount = item.unitPriceInPaise - platformFee;

      // 3. Create commission ledger entry
      await CommissionModel.create({
        orderId: order._id,
        sellerId: item.sellerId,
        grossSaleInPaise: item.unitPriceInPaise,
        platformFeeInPaise: platformFee,
        netSellerAmountInPaise: netSellerAmount,
        currency: 'INR',
        status: 'AVAILABLE',
      });
    }
  }

  async handleWebhook(rawBody: string, signature: string) {
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw AppError.badRequest('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Deduplication check
    const existing = await WebhookEventModel.findOne({ eventId });
    if (existing) {
      return { status: 'already_processed' };
    }

    await WebhookEventModel.create({
      eventId,
      eventType,
      processed: true,
    });

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const gatewayOrderId = payload.payload?.payment?.entity?.order_id;
      if (gatewayOrderId) {
        const order = await OrderModel.findOne({ gatewayOrderId });
        if (order && order.status !== ORDER_STATUS.PAID) {
          order.status = ORDER_STATUS.PAID;
          order.gatewayPaymentId = payload.payload?.payment?.entity?.id;
          await order.save();
          await this.fulfillOrder(order);
        }
      }
    }

    return { status: 'success' };
  }
}

export const checkoutService = new CheckoutService();
