// Base API Response structure used across all endpoints
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// User-related types
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string | null;
  username: string;
  status: string;
  role: string;
  email: string;
  dob: string | null;
  phoneNumber: string | null;
  oauthProvider: string | null;
  oauthId: string | null;
  authMethod: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  avatar: {
    url: string;
    key: string;
  };
}

// Public User interface for profile pages (extends User with additional public fields)
export interface PublicUser extends User {
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Article interface for user profile pages
export interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
  publishedAt: string;
  likesCount: number;
  commentsCount: number;
  readTime: number;
}

// Authentication-related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

// User profile types
export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  dob?: string;
  phoneNumber?: string;
}

export interface UpdateProfileResponse {
  user: User;
}

// Password-related types
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Email verification types
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationEmailRequest {
  email: string;
}

export interface ResendVerificationEmailResponse {
  message: string;
}

// Generic error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: Record<string, unknown>;
  };
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// Pagination types for list responses
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Common success response
export interface SuccessResponse {
  success: true;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}
