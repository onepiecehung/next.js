import { User } from "@/lib/interface";

/**
 * User Type Definitions
 * Contains user entity and profile-related types
 */

// ============================================================================
// User Entity
// ============================================================================
/**
 * Public User interface for profile pages
 * Extends User with additional public profile fields
 */
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

// ============================================================================
// User Profile Management Types
// ============================================================================

/**
 * Update profile request payload
 * Used for updating user profile information
 */
export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  dob?: string;
  phoneNumber?: string;
}

/**
 * Update profile response structure
 * Contains updated user data
 */
export interface UpdateProfileResponse {
  user: User;
}
