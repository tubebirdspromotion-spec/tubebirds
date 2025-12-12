const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Never expose stack traces in production
  const isProduction = process.env.NODE_ENV === 'production' || 
                      process.env.NODE_ENV === 'prod' || 
                      !process.env.NODE_ENV;
  
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Server Error',
    ...(!isProduction && { stack: err.stack })
  });
};

export default errorHandler;
