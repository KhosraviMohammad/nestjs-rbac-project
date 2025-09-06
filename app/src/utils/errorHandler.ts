// Error handling utility functions

export interface BackendError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const formatBackendError = (error: any): string => {
  // If it's a backend validation error
  if (error?.response?.data?.message) {
    const messages = error.response.data.message;
    if (Array.isArray(messages)) {
      return messages.join(', ');
    }
    return messages;
  }
  
  // If it's a network error
  if (error?.message) {
    return error.message;
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again.';
};

export const isBackendError = (error: any): error is BackendError => {
  return error?.response?.data?.message !== undefined;
};
