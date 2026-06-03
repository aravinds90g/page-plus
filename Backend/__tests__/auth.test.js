const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./helpers/testSetup');
const User = require('../src/models/User');

beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

const registerUser = (data = {}) => {
  const defaults = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
  };
  return request(app)
    .post('/api/auth/register')
    .send({ ...defaults, ...data });
};

describe('Auth - Register', () => {
  it('should register a new user successfully', async () => {
    const res = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.role).toBe('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should register an admin user successfully', async () => {
    const res = await registerUser({
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('admin');
  });

  it('should return 400 for duplicate email', async () => {
    await registerUser();
    const res = await registerUser();
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await registerUser({ email: 'invalid-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for short password', async () => {
    const res = await registerUser({ password: '12345' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid role', async () => {
    const res = await registerUser({ role: 'superadmin' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth - Login', () => {
  beforeEach(async () => {
    await registerUser();
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing email and password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/please provide an email and password/i);
  });
});

describe('Auth - Get Me', () => {
  let userToken;

  beforeEach(async () => {
    const res = await registerUser();
    userToken = res.body.token;
  });

  it('should return current user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 with expired token', async () => {
    const { sign } = require('jsonwebtoken');
    const expiredToken = sign(
      { id: new mongoose.Types.ObjectId() },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );
    // Wait for token to expire
    await new Promise(r => setTimeout(r, 100));
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });
});
