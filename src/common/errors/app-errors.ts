// Custom application errors
export enum AppErrorCode {
  // User errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  USER_ALREADY_LOCKED = 'USER_ALREADY_LOCKED',
  USER_ALREADY_UNLOCKED = 'USER_ALREADY_UNLOCKED',
  INVALID_ROLE_TYPE = 'INVALID_ROLE_TYPE',
  
  // Auth errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  INVALID_VERIFICATION_TOKEN = 'INVALID_VERIFICATION_TOKEN',
  EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    code: AppErrorCode,
    message: string,
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error factory functions
export const createUserNotFoundError = (id: number) => 
  new AppError(AppErrorCode.USER_NOT_FOUND, `User with ID ${id} not found`);

export const createEmailExistsError = () => 
  new AppError(AppErrorCode.EMAIL_ALREADY_EXISTS, 'Email already exists');

export const createUsernameExistsError = () => 
  new AppError(AppErrorCode.USERNAME_ALREADY_EXISTS, 'Username already exists');

export const createUserAlreadyLockedError = () => 
  new AppError(AppErrorCode.USER_ALREADY_LOCKED, 'User is already locked');

export const createUserAlreadyUnlockedError = () => 
  new AppError(AppErrorCode.USER_ALREADY_UNLOCKED, 'User is already unlocked');

export const createInvalidRoleTypeError = () => 
  new AppError(AppErrorCode.INVALID_ROLE_TYPE, 'Invalid role type. Must be "admin" or "support"');

export const createInvalidCredentialsError = () => 
  new AppError(AppErrorCode.INVALID_CREDENTIALS, 'Invalid username or password');

export const createEmailNotVerifiedError = () => 
  new AppError(AppErrorCode.EMAIL_NOT_VERIFIED, 'Please verify your email before logging in');

export const createInvalidVerificationTokenError = () => 
  new AppError(AppErrorCode.INVALID_VERIFICATION_TOKEN, 'Invalid or expired verification token');

export const createEmailAlreadyVerifiedError = () => 
  new AppError(AppErrorCode.EMAIL_ALREADY_VERIFIED, 'Email already verified');

export const createEmailExistsAuthError = () => 
  new AppError(AppErrorCode.EMAIL_ALREADY_EXISTS, 'User with this email already exists');

export const createEmailSendFailedError = () => 
  new AppError(AppErrorCode.EMAIL_SEND_FAILED, 'Failed to send verification email');
