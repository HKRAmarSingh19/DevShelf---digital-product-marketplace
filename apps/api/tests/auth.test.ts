import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Authentication API', () => {
  const testUser = {
    name: 'Jane Developer',
    email: 'jane@example.com',
    password: 'Password123!',
  };

  it('registers a new user successfully with encrypted password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.name).toBe(testUser.name);
    // Plaintext password and password hash must never be exposed
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.passwordHash).toBeUndefined();
    // Default role must be USER
    expect(res.body.data.role).toBe('USER');
    expect(res.body.data.sellerStatus).toBe('NOT_APPLIED');
  });

  it('rejects duplicate email registration', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const duplicateRes = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
  });

  it('authenticates valid credentials and creates an HTTP session', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.email).toBe(testUser.email.toLowerCase());
    expect(loginRes.headers['set-cookie']).toBeDefined();

    // Verify session persistence via /me
    const cookie = loginRes.headers['set-cookie'];
    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(testUser.email.toLowerCase());
  });

  it('rejects invalid password', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword999!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
