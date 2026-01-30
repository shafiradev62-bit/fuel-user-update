import { createSuccessResponse, createErrorResponse, HTTP_STATUS } from './responseHandler.js';

// Response middleware
export const responseMiddleware = (req, res, next) => {
  // Success response helper
  res.success = (responseCode, data = null, customMessage = null) => {
    const response = createSuccessResponse(responseCode, data, customMessage);
    const statusCode = HTTP_STATUS[responseCode] || 200;
    return res.status(statusCode).json(response);
  };

  // Error response helper
  res.error = (responseCode, error = null, customMessage = null) => {
    const response = createErrorResponse(responseCode, error, customMessage);
    const statusCode = HTTP_STATUS[responseCode] || 500;
    return res.status(statusCode).json(response);
  };

  next();
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  const response = createErrorResponse(
    'RC_500',
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  );
  
  res.status(500).json(response);
};