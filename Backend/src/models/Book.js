const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author name'],
      trim: true,
      maxlength: [100, 'Author name cannot be more than 100 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Please add a genre'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please add the publication year'],
      min: [1000, 'Publication year must be valid'],
      max: [new Date().getFullYear() + 2, 'Publication year cannot be in the far future'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    cosmicAlignment: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', BookSchema);
