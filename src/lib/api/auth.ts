import {
  signInWithGithub,
  signInWithGoogle,
  signInWithX,
  signOutFirebase,
} from "../auth/firebase";
import { http } from "../http";
import type {
  ApiResponse,
  FirebaseLoginRequest,
  LoginResponse,
  OTPRequestRequest,
  OTPRequestResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
} from "../types";
import { User } from "@/lib/interface";

/**
 * Authentication API wrapper
 * Handles all authentication-related API calls
 * Separated from auth-store.ts for better organization
 */
export class AuthAPI {
  private static readonly BASE_URL = "/auth";

  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/login`,
      { email, password },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.data;
  }

  /**
   * Signup with user data
   */
  static async signup(signupData: {
    username: string;
    email: string;
    password: string;
    name?: string;
    dob?: string;
    phoneNumber?: string;
  }): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/signup`,
      signupData,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Signup failed");
    }

    return response.data.data;
  }

  /**
   * Firebase login (Google, GitHub, X)
   */
  static async firebaseLogin(idToken: string): Promise<LoginResponse> {
    const requestBody: FirebaseLoginRequest = { idToken };

    const response = await http.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/firebase/login`,
      requestBody,
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Firebase authentication failed",
      );
    }

    return response.data.data;
  }

  /**
   * Request OTP via email
   */
  static async requestOTP(email: string): Promise<OTPRequestResponse> {
    const requestBody: OTPRequestRequest = { email };

    const response = await http.post<OTPRequestResponse>(
      `${this.BASE_URL}/otp/request`,
      requestBody,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send OTP");
    }

    return response.data;
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(
    email: string,
    code: string,
    requestId: string,
  ): Promise<OTPVerifyResponse> {
    const requestBody: OTPVerifyRequest = { email, code, requestId };

    const response = await http.post<OTPVerifyResponse>(
      `${this.BASE_URL}/otp/verify`,
      requestBody,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "OTP verification failed");
    }

    return response.data;
  }

  /**
   * Logout (best effort)
   */
  static async logout(): Promise<void> {
    try {
      await http.post(`${this.BASE_URL}/logout`);
    } catch {
      // Ignore logout errors - still clear local state
      console.warn("Logout endpoint failed, but clearing local state");
    }
  }

  /**
   * Fetch current user information
   */
  static async fetchMe(): Promise<User> {
    const response = await http.get<ApiResponse<User>>("/users/me");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch user data");
    }

    return response.data.data;
  }
}

/**
 * Firebase Authentication helpers
 * Wrapper functions for Firebase auth operations
 */
export class FirebaseAuthAPI {
  /**
   * Login with Google
   */
  static async loginWithGoogle(): Promise<User> {
    try {
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();
      const { user, token } = await AuthAPI.firebaseLogin(idToken);

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("Firebase Google login error:", error);
      throw error;
    }
  }

  /**
   * Login with GitHub
   */
  static async loginWithGithub(): Promise<User> {
    try {
      const firebaseUser = await signInWithGithub();
      const idToken = await firebaseUser.getIdToken();
      const { user, token } = await AuthAPI.firebaseLogin(idToken);

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("Firebase GitHub login error:", error);
      throw error;
    }
  }

  /**
   * Login with X (Twitter)
   */
  static async loginWithX(): Promise<User> {
    try {
      const firebaseUser = await signInWithX();
      const idToken = await firebaseUser.getIdToken();
      const { user, token } = await AuthAPI.firebaseLogin(idToken);

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("Firebase X login error:", error);
      throw error;
    }
  }

  /**
   * Sign out from Firebase
   */
  static async signOut(): Promise<void> {
    await signOutFirebase();
  }
}

/**
 * OTP Authentication helpers
 * Wrapper functions for OTP operations
 */
export class OTPAuthAPI {
  /**
   * Request OTP and return request info
   */
  static async requestOTP(email: string): Promise<{
    requestId: string;
    expiresIn: number;
  }> {
    try {
      const response = await AuthAPI.requestOTP(email);
      return {
        requestId: response.data.requestId,
        expiresIn: response.data.expiresInSec,
      };
    } catch (error) {
      console.error("OTP request error:", error);
      throw error;
    }
  }

  /**
   * Verify OTP and return user
   */
  static async verifyOTP(
    email: string,
    code: string,
    requestId: string,
  ): Promise<User> {
    try {
      const response = await AuthAPI.verifyOTP(email, code, requestId);
      const { user, token } = response.data;

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  }
}
