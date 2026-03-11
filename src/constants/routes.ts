// Route Constants
export const ROUTES = {
  // Main Resources
  AUTH: '/auth',
  USERS: '/users',
  // Health Check
  HEALTH: '/health',
} as const;


// Auth Route Paths
export const AUTH_ROUTES = {
  BASE: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/refresh-token',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

// User Route Paths
export const USER_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_ID: '/:id',
  GET_PROFILE: '/profile',
  UPDATE_PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  DELETE: '/:id',
} as const;