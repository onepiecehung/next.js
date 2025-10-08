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
 * User API wrapper
 * Handles all user-related API calls
 */
export class UserAPI {
  private static readonly BASE_URL = "/users";

  /**
   * Fetch user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await http.get<ApiResponse<User>>(
        `${this.BASE_URL}/${userId}`,
      );

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch user profile",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Fetch current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await http.get<ApiResponse<User>>(`${this.BASE_URL}/me`);

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch current user",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    userData: Partial<User>,
  ): Promise<User> {
    try {
      const response = await http.put<ApiResponse<User>>(
        `${this.BASE_URL}/${userId}`,
        userData,
      );

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update user profile",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}
