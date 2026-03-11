import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getUserById,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '@/controllers/user.controller';
import { validate } from '@/middlewares/validator';
import { USER_ROUTES } from '@/constants';
import { authenticateToken } from '@/middlewares/auth';
import { generalRateLimiter, strictRateLimiter } from '@/middlewares/rateLimiter';
import { securityHeaders, requestSizeLimiter, sqlInjectionProtection, xssProtection, sanitizeRequest } from '@/middlewares/security';
import { requestLogger } from '@/middlewares/logger';

const router = Router();

// Apply security middlewares to all routes
router.use(securityHeaders);
router.use(requestSizeLimiter(5 * 1024 * 1024)); // 5MB limit for users
router.use(sqlInjectionProtection);
router.use(xssProtection);
router.use(sanitizeRequest);
router.use(requestLogger);

// Validation chains
const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

const validateUpdateProfile = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-50 characters, alphanumeric and underscore only'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .isLength({ min: 6, max: 255 })
    .withMessage('New password must be at least 6 characters'),
];

// GET /api/v1/users/profile - Get user profile
router.get(
  USER_ROUTES.GET_PROFILE,
  generalRateLimiter,
  authenticateToken,
  getUserProfile
);

// GET /api/v1/users/:id - Get user by ID
router.get(
  USER_ROUTES.GET_BY_ID,
  generalRateLimiter,
  validate(validateId),
  authenticateToken,
  getUserById
);

// PUT /api/v1/users/profile - Update user profile
router.put(
  USER_ROUTES.UPDATE_PROFILE,
  strictRateLimiter,
  authenticateToken,
  validate(validateUpdateProfile),
  updateUserProfile
);

// PUT /api/v1/users/change-password - Change password
router.put(
  USER_ROUTES.CHANGE_PASSWORD,
  strictRateLimiter,
  authenticateToken,
  validate(validateChangePassword),
  changePassword
);

export default router; 
