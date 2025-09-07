import { HttpException, HttpStatus } from '@nestjs/common';
import { AppError } from '../errors/app-errors';

export function handleAppError(error: any): never {
  if (error instanceof AppError) {
    throw new HttpException(
      {
        message: error.message,
        error: error.code,
        statusCode: 400,
      },
      400,
    );
  }
  
  // If it's already an HttpException, re-throw it
  if (error instanceof HttpException) {
    throw error;
  }
  
  // For other errors, convert to generic HTTP error
  throw new HttpException(
    {
      message: error.message || 'Internal server error',
      error: 'INTERNAL_SERVER_ERROR',
      statusCode: 400,
    },
    400,
  );
}
