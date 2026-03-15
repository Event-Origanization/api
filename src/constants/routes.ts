// Route Constants
export const ROUTES = {
  // Main Resources
  AUTH: '/auth',
  USERS: '/users',
  SEO: '/seo',
  CONFIGS: '/configs',
  PRODUCTS: '/products',
  // Health Check
  HEALTH: '/health',
  POSTS: '/posts',
  HIGHLIGHT_VIDEOS: '/highlight-videos',
  HOME_VIDEOS: '/home-videos',
  NEWSLETTER: '/newsletter',
  DASHBOARD: '/dashboard',
} as const;

// Product Route Paths
export const PRODUCT_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_ID: '/:id',
  GET_BY_SLUG: '/slug/:slug',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;


// Post Route Paths
export const POST_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_ID: '/:id',
  GET_BY_SLUG: '/slug/:slug',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;


// Highlight Video Route Paths
export const HIGHLIGHT_VIDEO_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_ID: '/:id',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;


// Home Video Route Paths
export const HOME_VIDEO_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_ID: '/:id',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;


// Newsletter Route Paths
export const NEWSLETTER_ROUTES = {
  BASE: '/',
  SUBSCRIBE: '/subscribe',
  GET_ALL: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
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

// SEO Route Paths
export const SEO_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_PAGE: '/:pageKey',
  UPDATE: '/:pageKey',
} as const;

// Website Config Route Paths
export const WEBSITE_CONFIG_ROUTES = {
  BASE: '/',
  GET_ALL: '/',
  GET_BY_GROUP: '/group/:group',
  UPDATE: '/:key',
  BULK_UPDATE: '/bulk-update',
} as const;

// Dashboard Route Paths
export const DASHBOARD_ROUTES = {
  BASE: '/',
  OVERVIEW: '/overview',
  YEARLY_CHARTS: '/charts/yearly',
} as const;