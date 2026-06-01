const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getGenres,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes for viewing books and genres
router.get('/', getBooks);
router.get('/genres', getGenres);
router.get('/:id', getBookById);

// Protected routes (Only Admins can Add, Update, or Delete books)
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;
