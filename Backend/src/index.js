const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const seedData = require('./config/seeder');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  // Run database seeder
  seedData();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Book Management API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      books: {
        getAll: 'GET /api/books',
        getById: 'GET /api/books/:id',
        create: 'POST /api/books (Admin only)',
        update: 'PUT /api/books/:id (Admin only)',
        delete: 'DELETE /api/books/:id (Admin only)',
        genres: 'GET /api/books/genres',
      },
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
