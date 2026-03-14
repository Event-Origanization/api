// SEO Meta Constants
export const PAGE_KEYS = {
  HOME: 'HOME',
  ABOUT: 'ABOUT',
  PRODUCTS: 'PRODUCTS',
  POSTS: 'POSTS',
  CONTACT: 'CONTACT',
} as const;

export type PageKey = keyof typeof PAGE_KEYS;
