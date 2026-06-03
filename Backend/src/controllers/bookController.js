const Book = require('../models/Book');

// @desc    Get all books (with search, filtering, and pagination)
// @route   GET /api/books
// @access  Public (or Private, accessible by both admin and user)
exports.getBooks = async (req, res, next) => {
  try {
    let query = {};

    // Search filter (title or author)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
      ];
    }

    // Genre filter
    if (req.query.genre) {
      // Handle array of genres or single genre
      if (Array.isArray(req.query.genre)) {
        query.genre = { $in: req.query.genre.map(g => new RegExp(`^${g}$`, 'i')) };
      } else if (req.query.genre !== 'All') {
        query.genre = new RegExp(`^${req.query.genre}$`, 'i');
      }
    }

    // Publication Year filter
    if (req.query.year) {
      query.year = parseInt(req.query.year, 10);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8; // Default to 8 books per page
    const startIndex = (page - 1) * limit;

    // Sorting (default to newest created)
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      const parts = req.query.sort.split(':');
      sortBy[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('createdBy', 'name email')
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: books.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('createdBy', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        error: `Book not found with ID of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: `Book not found with ID of ${req.params.id}`,
      });
    }

    // Update book
    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: `Book not found with ID of ${req.params.id}`,
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique genres
// @route   GET /api/books/genres
// @access  Public
exports.getGenres = async (req, res, next) => {
  try {
    const genres = await Book.distinct('genre');
    res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    next(error);
  }
};
