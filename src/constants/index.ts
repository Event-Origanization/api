import { ENV } from '@/lib';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Messages
export const MESSAGES = {
  SUCCESS: {
    UPGRADED: 'Upgraded successfully',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    FETCHED: 'Data fetched successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    AUTH: {
      REGISTER_SUCCESS: 'Registration successful. Please check your email for OTP verification.',
      TOKEN_REFRESHED: 'Token refreshed successfully',
      VERIFY_OTP_SUCCESS: 'Account verified successfully',
      RESEND_OTP_SUCCESS: 'OTP resent successfully. Please check your email.',
      PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
      PASSWORD_RESET_SUCCESS: 'Password reset successful',
    },
    USER: {
      GET_ALL_USERS_SUCCESS: 'All users fetched successfully',
      GET_USER_BY_ID_SUCCESS: 'User fetched successfully',
      GET_USER_PROFILE_SUCCESS: 'User profile fetched successfully',
      UPDATE_USER_PROFILE_SUCCESS: 'User profile updated successfully',
      UPDATE_USER_AVATAR_SUCCESS: 'User avatar updated successfully',
      PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
    },
  },
  ERROR: {
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
    DUPLICATE_ENTRY: 'Duplicate entry',
    INVALID_CREDENTIALS: 'Invalid credentials',
    FILE_TOO_LARGE: 'File size too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
    AUTH: {
      UNAUTHORIZED: 'Unauthorized access',
      FAILED_TO_SEND_OTP: 'Failed to send verification email. Please try again.',
      FAILED_TO_REGISTER: 'Registration failed',
      FAILED_TO_VERIFY_OTP: 'OTP verification failed',
      REQUIRED_EMAIL_OTP: 'Email or OTP are required',
      FAILED_TO_RESEND_OTP: 'Failed to resend OTP.',
      REQUIRED_EMAIL_PASSWORD: 'Email and password are required',
      REQUIRED_REFRESH_TOKEN: 'Refresh token is required from cookies or request body',
      FAILED_TO_REFRESH_TOKEN: 'Token refresh failed',
      REQUIRED_ACCESS_TOKEN: 'Access token is required',
      REQUIRED_AUTH: 'Authentication required',
      INSUFFICIENT_PERMISSION: 'Insufficient permissions',
      INVALID_ACCESS_TOKEN: 'Invalid or expired access token',
      INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
      INVALID_TOKEN: 'Invalid token format',
      REQUIRED_EMAIL: 'Email is required',
      FAILED_TO_SEND_PASSWORD_RESET_EMAIL: 'Failed to send password reset email',
      REQUIRED_TOKEN_NEW_PASSWORD: 'Token and new password are required',
      FAILED_TO_RESET_PASSWORD: 'Password reset failed',
    },
    USER: {
      REQUIRED_ID: 'ID is required',
      USER_NOT_FOUND: 'User not found',
      REQUIRED_ROLE: 'Role is required',
      REQUIRED_SEARCH: 'Search term is required',
      PROFILE_UPDATE_FAILED: 'Profile update failed',
      REQUIRED_CURRENT_PASSWORD_NEW_PASSWORD: 'Current password and new password are required',
      PASSWORD_CHANGE_FAILED: 'Password change failed',
      REQUIRED_USERNAME: 'Username is required',
      REQUIRED_PASSWORD: 'Password is required',
      PASSWORD_LENGTH: 'Password must be at least 6 characters long',
      PASSWORD_MATCH: 'Passwords do not match',
      FAILED_TO_HASH_PASSWORD: 'Failed to hash password',
      REQUIRED_CONFIRM_PASSWORD: 'Confirm password is required',
      REQUIRED_IMAGE: 'Image is required',
      INVALID_EMAIL: 'Invalid email format',
      REQUIRED_EMAIL: 'Email is required',
      USERNAME_LENGTH: 'Username must be between 3 and 50 characters',
      USERNAME_FORMAT: 'Username can only contain alphanumeric characters and underscore',
      FAILED_TO_CHECK_USER_EXISTENCE: 'Failed to check user existence',
      USER_ALREADY_EXISTS: 'User with this email already exists',
      FAILED_TO_CREATE_USER: 'Failed to create user',
    },
  },
} as const;

// Re-export route constants
export * from './routes';

// Database Constants
export const DB_CONSTANTS = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
  MAX_PAGE_SIZE: 1000,
} as const;

// File Upload Constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  UPLOAD_PATH: 'uploads',
} as const;

// Helper to parse duration string to seconds
const parseDurationToSeconds = (duration: string): number => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return parseInt(duration) || 0;
  
  const value = parseInt(match[1] || '0');
  const unit = match[2];
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return value;
  }
};

// JWT Constants
export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: ENV.JWT_EXPIRES_IN || '24h',
  REFRESH_TOKEN_EXPIRES_IN: ENV.JWT_REFRESH_EXPIRES_IN || '7d',
  ALGORITHM: ENV.JWT_ALGORITHM,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Performance Constants
export const PERFORMANCE_CONSTANTS = {
  SLOW_REQUEST_THRESHOLD: 1000, // 1 second
  MAX_RESPONSE_TIME: 5000, // 5 seconds
} as const;

// User Roles
export const USER_ROLES = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_USER: 'ROLE_USER',
} as const;

// Cookie Constants
export const COOKIE_CONSTANTS = {
  ACCESS_TOKEN_COOKIE_NAME: 'access_token',
  REFRESH_TOKEN_COOKIE_NAME: 'refresh_token',
  ACCESS_TOKEN_COOKIE_PATH: '/',
  REFRESH_TOKEN_COOKIE_PATH: `${ENV.API_PREFIX}${ENV.API_VERSION}/auth/refresh-token`,
} as const;

// SameSite Options
export const SAME_SITE_OPTIONS = {
  STRICT: 'strict',
  LAX: 'lax',
  NONE: 'none',
} as const;

// Token Types
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

// Token Expiration Constants in seconds
export const TOKEN_EXPIRATION_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: parseDurationToSeconds(JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN),
  REFRESH_TOKEN_EXPIRES_IN: parseDurationToSeconds(JWT_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN),
};

// Post Status
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  PUBLISHED: 'PUBLISHED',
} as const;

// Development Environment
export const DEVELOPMENT_ENVIRONMENT = 'development';

// Production Environment
export const PRODUCTION_ENVIRONMENT = 'production';