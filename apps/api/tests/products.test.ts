import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { CategoryModel } from '../src/modules/categories/category.model.js';
import { UserModel } from '../src/modules/users/user.model.js';
import { hashPassword } from '../src/common/utils/password.js';

const app = createApp();

describe('Products & Seller API', () => {
  it('enforces seller status and IDOR authorization for products', async () => {
    // 1. Create a category
    const category = await CategoryModel.create({
      name: 'Starter Kits',
      slug: 'starter-kits',
    });

    // 2. Create an approved seller
    const seller = await UserModel.create({
      name: 'Seller One',
      email: 'seller1@example.com',
      passwordHash: await hashPassword('Password123!'),
      role: 'USER',
      sellerStatus: 'APPROVED',
      status: 'ACTIVE',
    });

    // Login as seller
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'seller1@example.com',
      password: 'Password123!',
    });
    const sellerCookie = loginRes.headers['set-cookie'];

    // 3. Create product
    const createRes = await request(app)
      .post('/api/v1/products')
      .set('Cookie', sellerCookie)
      .send({
        title: 'MERN SaaS Starter',
        description: 'Comprehensive boilerplate for modern web apps.',
        categoryId: category._id.toString(),
        productType: 'SOURCE_CODE',
        priceInRupees: 999,
        tags: ['React', 'Express'],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.status).toBe('DRAFT');
    const productId = createRes.body.data._id;

    // 4. Create another seller
    const otherSeller = await UserModel.create({
      name: 'Seller Two',
      email: 'seller2@example.com',
      passwordHash: await hashPassword('Password123!'),
      role: 'USER',
      sellerStatus: 'APPROVED',
      status: 'ACTIVE',
    });

    const otherLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'seller2@example.com',
      password: 'Password123!',
    });
    const otherCookie = otherLogin.headers['set-cookie'];

    // 5. Verify IDOR protection: other seller CANNOT modify product 1
    const idorRes = await request(app)
      .patch(`/api/v1/products/${productId}`)
      .set('Cookie', otherCookie)
      .send({ title: 'Hacked Title' });

    expect(idorRes.status).toBe(403);
  });
});
