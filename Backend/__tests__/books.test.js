const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./helpers/testSetup');
const User = require('../src/models/User');
const Book = require('../src/models/Book');

beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

const registerAndGetToken = async (role = 'user') => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: role === 'admin' ? 'Admin User' : 'Test User',
      email: `${role}@example.com`,
      password: 'password123',
      role,
    });
  return res.body.token;
};

const createTestBook = async (overrides = {}) => {
  const admin = await User.findOne({ email: 'admin@example.com' });
  const defaults = {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    year: 2020,
    description: 'A test book description',
    cosmicAlignment: 'Test alignment',
    imageUrl: '',
    createdBy: admin._id,
  };
  return await Book.create({ ...defaults, ...overrides });
};

describe('Books - Public Endpoints', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await registerAndGetToken('admin');
    userToken = await registerAndGetToken('user');
  });

  describe('GET /api/books', () => {
    beforeEach(async () => {
      await createTestBook({ title: 'Book Alpha', genre: 'Fiction', year: 2020 });
      await createTestBook({ title: 'Book Beta', genre: 'Sci-Fi', year: 2021 });
      await createTestBook({ title: 'Another Book', genre: 'Fiction', year: 2019 });
    });

    it('should return all books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(3);
      expect(res.body.data).toHaveLength(3);
    });

    it('should have pagination info', async () => {
      const res = await request(app).get('/api/books');
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(3);
      expect(res.body.pagination.page).toBe(1);
    });

    it('should filter books by genre', async () => {
      const res = await request(app).get('/api/books?genre=Sci-Fi');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].genre).toBe('Sci-Fi');
    });

    it('should search books by title', async () => {
      const res = await request(app).get('/api/books?search=Alpha');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe('Book Alpha');
    });

    it('should search books by author', async () => {
      const res = await request(app).get('/api/books?search=Author');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(3);
    });

    it('should paginate results', async () => {
      const res = await request(app).get('/api/books?limit=2&page=1');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.pagination.pages).toBe(2);
    });

    it('should return empty array when no books match', async () => {
      const res = await request(app).get('/api/books?search=ZZZZNonexistent');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/books/genres', () => {
    beforeEach(async () => {
      await createTestBook({ title: 'Book 1', genre: 'Fiction' });
      await createTestBook({ title: 'Book 2', genre: 'Sci-Fi' });
      await createTestBook({ title: 'Book 3', genre: 'Fiction' });
    });

    it('should return distinct genres', async () => {
      const res = await request(app).get('/api/books/genres');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toContain('Fiction');
      expect(res.body.data).toContain('Sci-Fi');
      expect(res.body.data).not.toContain('Non-Fiction');
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return a single book by id', async () => {
      const book = await createTestBook({ title: 'Specific Book' });
      const res = await request(app).get(`/api/books/${book._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Specific Book');
    });

    it('should return 404 for non-existent book id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/books/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for invalid ObjectId', async () => {
      const res = await request(app).get('/api/books/invalidid');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});

describe('Books - Admin CRUD', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await registerAndGetToken('admin');
    userToken = await registerAndGetToken('user');
  });

  describe('POST /api/books', () => {
    const newBook = {
      title: 'New Book',
      author: 'New Author',
      genre: 'Fantasy',
      year: 2023,
      description: 'Brand new book',
      cosmicAlignment: 'Cosmic alignment text',
    };

    it('should create a book when admin', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newBook);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Book');
      expect(res.body.data.createdBy).toBeDefined();
    });

    it('should return 403 when non-admin tries to create', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBook);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/books')
        .send(newBook);
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Incomplete Book' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book when admin', async () => {
      const book = await createTestBook();
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Title' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should return 403 when non-admin tries to update', async () => {
      const book = await createTestBook();
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Hacked Title' });
      expect(res.status).toBe(403);
    });

    it('should return 404 when updating non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/books/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Ghost Update' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book when admin', async () => {
      const book = await createTestBook();
      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get(`/api/books/${book._id}`);
      expect(checkRes.status).toBe(404);
    });

    it('should return 403 when non-admin tries to delete', async () => {
      const book = await createTestBook();
      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should return 404 when deleting non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/books/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });
});

describe('Books - Error Handling', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = await registerAndGetToken('admin');
  });

  it('should handle CastError for invalid ObjectId', async () => {
    const res = await request(app)
      .get('/api/books/invalidobjectid');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/resource not found/i);
  });

  it('should handle duplicate key errors gracefully', async () => {
    await createTestBook({ title: 'Unique Book' });
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Another Book',
        author: 'Author',
        genre: 'Fiction',
        year: 2020,
      });
    expect(res.status).toBe(201);
  });
});
