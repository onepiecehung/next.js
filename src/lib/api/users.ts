/**
 * User API Service
 * Handles all user-related API calls
 */

import { http } from "@/lib/http";
import type { ApiResponse } from "@/lib/types";

export interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
  };
  location?: string;
  website?: string;
  createdAt: string;
  _count?: {
    articles: number;
    followers: number;
    following: number;
  };
}

/**
 * Fetch user profile by user ID
 * @param userId - The user ID to fetch
 * @returns Promise<User>
 */
export async function fetchUserProfile(userId: string): Promise<User> {
  try {
    const response = await http.get<ApiResponse<User>>(`/users/${userId}`);

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch user profile");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

/**
 * Fetch current user profile
 * @returns Promise<User>
 */
export async function fetchCurrentUser(): Promise<User> {
  try {
    const response = await http.get<ApiResponse<User>>("/users/me");

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch current user");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

/**
 * Update user profile
 * @param userId - The user ID to update
 * @param userData - The user data to update
 * @returns Promise<User>
 */
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>,
): Promise<User> {
  try {
    const response = await http.put<ApiResponse<User>>(
      `/users/${userId}`,
      userData,
    );

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update user profile");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
