// Error handling utility for consistent error management
export class AppError extends Error {
  public responseCode?: string;
  public statusCode?: number;
  
  constructor(message: string, responseCode?: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.responseCode = responseCode;
    this.statusCode = statusCode;
  }
}

export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  // Handle network errors
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Handle standardized API errors
  const errorData = error.response?.data;
  if (errorData && !errorData.success) {
    const responseCode = errorData.responseCode;
    
    // Handle specific response codes
    switch (responseCode) {
      case 'RC_401':
      case 'RC_A004':
        return 'Session expired. Please login again.';
      case 'RC_A001':
        return 'Invalid email or password.';
      case 'RC_A002':
        return 'Email already exists.';
      case 'RC_A003':
        return 'User not found.';
      case 'RC_404':
        return 'Resource not found.';
      case 'RC_500':
        return 'Server error. Please try again later.';
      default:
        return errorData.message || errorData.error || 'An unexpected error occurred.';
    }
  }
  
  // Handle HTTP status codes
  const status = error.response?.status;
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please login.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'Resource not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

export const showErrorToast = (error: any) => {
  const message = handleApiError(error);
  // You can integrate with your toast library here
  console.error('Error Toast:', message);
  return message;
};

export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('Async operation failed:', errorMessage);
    return fallbackValue;
  }
};

// Retry utility for failed API calls
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors
      const errorData = error.response?.data;
      if (errorData?.responseCode === 'RC_401' || errorData?.responseCode === 'RC_A004') {
        throw error;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};