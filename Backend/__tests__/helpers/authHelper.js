const User = require('../../src/models/User');

const createTestUser = async (overrides = {}) => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    ...overrides,
  };
  return await User.create(userData);
};

const createTestAdmin = async (overrides = {}) => {
  return await createTestUser({ role: 'admin', email: 'admin@example.com', name: 'Admin User', ...overrides });
};

module.exports = { createTestUser, createTestAdmin };
