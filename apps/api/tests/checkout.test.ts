import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { CategoryModel } from '../src/modules/categories/category.model.js';
import { UserModel } from '../src/modules/users/user.model.js';
import { ProductModel } from '../src/modules/products/product.model.js';
import { hashPassword } from '../src/common/utils/password.js';

const app = createApp();

describe('Checkout & Entitlements API', () => {
  it('calculates server-authoritative prices, processes payment, and grants entitlement', async () => {
    // 1. Setup seller, category, and published product
    const category = await CategoryModel.create({
      name: 'E-Books',
      slug: 'ebooks',
    });

    const seller = await UserModel.create({
      name: 'Author Alex',
      email: 'alex@example.com',
      passwordHash: await hashPassword('Password123!'),
      role: 'USER',
      sellerStatus: 'APPROVED',
      status: 'ACTIVE',
    });

    const product = await ProductModel.create({
      sellerId: seller._id,
      title: 'Distributed Systems Guide',
      slug: 'distributed-systems-guide',
      description: 'In-depth guide to modern distributed consensus and storage.',
      categoryId: category._id,
      productType: 'EBOOK',
      priceInPaise: 49900, // Rs. 499
      status: 'PUBLISHED',
      averageRating: 5.0,
      reviewCount: 1,
      currentVersion: '1.0.0',
    });

    // 2. Setup Buyer
    const buyer = await UserModel.create({
      name: 'Bob Buyer',
      email: 'bob@example.com',
      passwordHash: await hashPassword('Password123!'),
      role: 'USER',
      sellerStatus: 'NOT_APPLIED',
      status: 'ACTIVE',
    });

    const buyerLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'bob@example.com',
      password: 'Password123!',
    });
    const buyerCookie = buyerLogin.headers['set-cookie'];

    // 3. Initiate Checkout
    const checkoutRes = await request(app)
      .post('/api/v1/checkout')
      .set('Cookie', buyerCookie)
      .send({
        productIds: [product._id.toString()],
        licenseType: 'STANDARD',
      });

    expect(checkoutRes.status).toBe(201);
    expect(checkoutRes.body.data.totalInPaise).toBe(49900);
    const orderId = checkoutRes.body.data.orderId;
    const gatewayOrderId = checkoutRes.body.data.gatewayOrderId;

    // 4. Verify Payment (using test signature simulator)
    const paymentId = 'pay_test_12345';
    const verifyRes = await request(app)
      .post('/api/v1/checkout/verify')
      .set('Cookie', buyerCookie)
      .send({
        orderId,
        razorpayOrderId: gatewayOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: `sig_${gatewayOrderId}_${paymentId}`,
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);

    // 5. Verify Entitlement exists in Buyer Library
    const libraryRes = await request(app)
      .get('/api/v1/library')
      .set('Cookie', buyerCookie);

    expect(libraryRes.status).toBe(200);
    expect(libraryRes.body.data.length).toBe(1);
    expect(libraryRes.body.data[0].productId).toBe(product._id.toString());
  });
});
