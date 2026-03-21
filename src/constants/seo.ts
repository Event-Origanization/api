// SEO Meta Constants
export const PAGE_KEYS = {
  HOME: 'HOME',
  ABOUT: 'ABOUT',
  EVENTS: 'EVENTS',
  SOUND_LIGHT: 'SOUND_LIGHT',
  RENTAL: 'RENTAL',
  CONTACT: 'CONTACT',
  POST_DETAIL: 'POST_DETAIL',
  PRODUCT_DETAIL: 'PRODUCT_DETAIL',
} as const;

export type PageKey = keyof typeof PAGE_KEYS;
