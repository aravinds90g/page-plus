const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  console.error('Error Trace:', err);

  // Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    error.message = `Resource not found with ID of ${err.value}`;
    error.statusCode = 404;
  }

  // Mongoose duplicate key (e.g., duplicate email)
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered. A record with this value already exists.';
    error.statusCode = 400;
  }

  // Mongoose validation error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Authorization failed.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Session expired. Please log in again.';
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
