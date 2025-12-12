// Middleware to validate URL parameters
export const validateId = (req, res, next) => {
  const id = req.params.id;
  
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID parameter'
    });
  }
  
  // Convert to integer to prevent injection
  req.params.id = parseInt(id);
  next();
};

// Validate multiple IDs in params
export const validateIds = (...paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      if (id && (isNaN(parseInt(id)) || parseInt(id) <= 0)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid ${paramName} parameter`
        });
      }
      if (id) {
        req.params[paramName] = parseInt(id);
      }
    }
    next();
  };
};
