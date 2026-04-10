import { SAME_SITE_OPTIONS } from '@/constants';
import { PAGE_KEYS, ProductCategory } from '@/constants/seo';
import { Request } from 'express';
import { Options } from 'sequelize';
import { ConfigGroup, ConfigKey } from '@/constants/config';

export interface DatabaseConfig {
  development: Options;
  test: Options;
  production: Options;
}

// Database Models

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserCreationAttributes {
  username: string;
  email: string;
  password: string;
  isActive?: boolean;
  role?: string;
}

export interface IProduct {
  id: number;
  name_vi: string;
  name_en: string;
  name_zh: string;
  slug: string;
  price: number;
  images: string[];
  isActive: boolean;
  productType: typeof PAGE_KEYS.SOUND_LIGHT | typeof PAGE_KEYS.RENTAL;
  category: ProductCategory | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProductCreationAttributes {
  name_vi: string;
  name_en?: string;
  name_zh?: string;
  slug: string;
  price: number;
  images?: string[];
  isActive?: boolean;
  productType: typeof PAGE_KEYS.SOUND_LIGHT | typeof PAGE_KEYS.RENTAL;
  category?: ProductCategory | null;
}

export interface CreateProductRequest extends ProductCreationAttributes {
  translateName?: boolean;
}

export interface UpdateProductRequest extends Partial<ProductCreationAttributes> {
  translateName?: boolean;
}

export interface IPost {
  id: number;
  title_vi: string;
  title_en: string;
  title_zh: string;
  slug: string;
  content_vi: string;
  content_en: string;
  content_zh: string;
  media: string;
  status: string;
  publishAt: Date | null;
  seoScore: number | null;
  seoAnalysis: string | null;
  seoSuggestions: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface PostCreationAttributes {
  title_vi: string;
  title_en?: string;
  title_zh?: string;
  slug: string;
  content_vi: string;
  content_en?: string;
  content_zh?: string;
  media?: string;
  status?: string;
  publishAt?: Date | null;
  seoScore?: number | null;
  seoAnalysis?: string | null;
  seoSuggestions?: string | null;
}

export interface CreatePostRequest extends PostCreationAttributes {
  translateTitle?: boolean;
  translateContent?: boolean;
}

export interface UpdatePostRequest extends Partial<PostCreationAttributes> {
  translateTitle?: boolean;
  translateContent?: boolean;
}

export interface IHighlightVideo {
  id: number;
  title_vi: string;
  title_en: string;
  title_zh: string;
  url: string;
  thumbnail: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface HighlightVideoCreationAttributes {
  title_vi: string;
  title_en?: string;
  title_zh?: string;
  url: string;
  thumbnail?: string | null;
  orderIndex?: number;
  isActive?: boolean;
}

export interface CreateHighlightVideoRequest extends HighlightVideoCreationAttributes {
  translateTitle?: boolean;
}

export interface UpdateHighlightVideoRequest extends Partial<HighlightVideoCreationAttributes> {
  translateTitle?: boolean;
}

export interface IHomeVideo {
  id: number;
  title_vi: string;
  title_en: string;
  title_zh: string;
  url: string | null;
  thumbnail: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeVideoCreationAttributes {
  title_vi: string;
  title_en?: string;
  title_zh?: string;
  url?: string | null;
  thumbnail?: string | null;
  isActive?: boolean;
}

export interface CreateHomeVideoRequest extends HomeVideoCreationAttributes {
  translateTitle?: boolean;
}

export interface UpdateHomeVideoRequest extends Partial<HomeVideoCreationAttributes> {
  translateTitle?: boolean;
}

export interface IWebsiteConfig {
  id: number;
  key: ConfigKey | string;
  group: ConfigGroup | string;
  value_vi: string;
  value_en: string;
  value_zh: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface WebsiteConfigCreationAttributes {
  key: string;
  group?: string;
  value_vi?: string;
  value_en?: string;
  value_zh?: string;
}

export interface ISeoMeta {
  id: number;
  pageKey: string;
  title_vi: string;
  title_en: string;
  title_zh: string;
  description_vi: string;
  description_en: string;
  description_zh: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeoMetaCreationAttributes {
  pageKey: string;
  title_vi?: string;
  title_en?: string;
  title_zh?: string;
  description_vi?: string;
  description_en?: string;
  description_zh?: string;
  path?: string;
}


// Request Extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    email: string;
    role: string;
  };
}

// Cookie Request
export interface CookieRequest extends Request {
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}

// Request with file
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Log Data
export interface LogData {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  ip: string;
  userAgent: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestBody?: unknown;
  error?: string;
}

// API Response Types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Pagination Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// File Upload Types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Environment Variables
export interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  MAX_FILE_SIZE: number;
  UPLOAD_PATH: string;
  ALLOWED_ORIGINS: string;
  API_VERSION: string;
  API_PREFIX: string;
  FRONTEND_URL: string;
} 

// Interface cho uploaded files
export interface UploadedFile extends Express.Multer.File {
  buffer: Buffer;
}

// Interface cho upload options
export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformation?: Record<string, unknown>[];
  quality?: string | number;
  format?: string;
}

// Interface cho upload result
export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

// Interface cho delete result
export interface CloudinaryDeleteResult {
  success: boolean;
  result?: string;
  error?: string;
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: typeof SAME_SITE_OPTIONS[keyof typeof SAME_SITE_OPTIONS];
  maxAge: number;
  path: string;
  domain?: string;
}

export interface TokenPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

export interface UserValidationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Newsletter Subscriber Types
export interface INewsletterSubscriber {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewsletterSubscriberCreationAttributes = Omit<INewsletterSubscriber, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateNewsletterSubscriberRequest {
  email: string;
}

export interface UpdateNewsletterSubscriberRequest {
  isActive: boolean;
}

// Contact Message Types
export interface IContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageCreationAttributes = Omit<IContactMessage, 'id' | 'createdAt' | 'updatedAt' | 'isRead'> & {
  isRead?: boolean;
};

export interface CreateContactMessageRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface UpdateContactMessageRequest {
  isRead: boolean;
}

export interface ContactMessageQueryOptions extends PaginationQuery {
  search?: string;
  isRead?: boolean;
}

export interface ContactMessageListResult {
  total: number;
  totalPages: number;
  currentPage: number;
  contactMessages: IContactMessage[];
}

// Highlight Types
export interface IHighlight {
  id: number;
  title_vi: string;
  title_en: string;
  title_zh: string;
  content_vi: string;
  content_en: string;
  content_zh: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HighlightCreationAttributes {
  title_vi: string;
  title_en?: string;
  title_zh?: string;
  content_vi: string;
  content_en?: string;
  content_zh?: string;
  orderIndex?: number;
}

export interface CreateHighlightRequest extends HighlightCreationAttributes {
  translateTitle?: boolean;
  translateContent?: boolean;
}

export interface UpdateHighlightRequest extends Partial<HighlightCreationAttributes> {
  translateTitle?: boolean;
  translateContent?: boolean;
}

export interface HighlightListResult {
  total: number;
  totalPages: number;
  currentPage: number;
  highlights: IHighlight[];
}

// Partner Types
export * from './partner.types';