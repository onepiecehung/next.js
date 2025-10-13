import { User } from "@/lib/interface";
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithX,
  signOutFirebase,
} from "../auth/firebase";
import { http } from "../http";
import type {
  ApiResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  FirebaseLoginRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  OTPRequestRequest,
  OTPRequestResponseData,
  OTPVerifyRequest,
  OTPVerifyResponseData,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types";

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
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/login`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.data;
  }

  /**
   * Signup with user data
   */
  static async signup(data: {
    username: string;
    email: string;
    password: string;
    name?: string;
    dob?: string;
    phoneNumber?: string;
  }): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/signup`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Signup failed");
    }

    return response.data.data;
  }

  /**
   * Firebase login (Google, GitHub, X)
   */
  static async firebaseLogin(data: FirebaseLoginRequest): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/firebase/login`,
      data,
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
  static async requestOTP(data: OTPRequestRequest): Promise<OTPRequestResponseData> {
    const response = await http.post<ApiResponse<OTPRequestResponseData>>(
      `${this.BASE_URL}/otp/request`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send OTP");
    }

    return response.data.data;
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(data: OTPVerifyRequest): Promise<OTPVerifyResponseData> {
    const response = await http.post<ApiResponse<OTPVerifyResponseData>>(
      `${this.BASE_URL}/otp/verify`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "OTP verification failed");
    }

    return response.data.data;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await http.post<ApiResponse<RefreshTokenResponse>>(
      `${this.BASE_URL}/refresh`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Token refresh failed");
    }

    return response.data.data;
  }

  /**
   * Logout
   */
  static async logout(): Promise<LogoutResponse> {
    const response = await http.post<ApiResponse<LogoutResponse>>(
      `${this.BASE_URL}/logout`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Logout failed");
    }

    return response.data.data;
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await http.post<ApiResponse<ChangePasswordResponse>>(
      `${this.BASE_URL}/change-password`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Password change failed");
    }

    return response.data.data;
  }

  /**
   * Forgot password
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await http.post<ApiResponse<ForgotPasswordResponse>>(
      `${this.BASE_URL}/forgot-password`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Password reset request failed");
    }

    return response.data.data;
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await http.post<ApiResponse<ResetPasswordResponse>>(
      `${this.BASE_URL}/reset-password`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Password reset failed");
    }

    return response.data.data;
  }

  /**
   * Verify email
   */
  static async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await http.post<ApiResponse<VerifyEmailResponse>>(
      `${this.BASE_URL}/verify-email`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Email verification failed");
    }

    return response.data.data;
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(data: ResendVerificationEmailRequest): Promise<ResendVerificationEmailResponse> {
    const response = await http.post<ApiResponse<ResendVerificationEmailResponse>>(
      `${this.BASE_URL}/resend-verification`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to resend verification email");
    }

    return response.data.data;
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
      const { user, token } = await AuthAPI.firebaseLogin({ idToken });

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
      const { user, token } = await AuthAPI.firebaseLogin({ idToken });

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
      const { user, token } = await AuthAPI.firebaseLogin({ idToken });

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
      const response = await AuthAPI.requestOTP({ email });
      return {
        requestId: response.requestId,
        expiresIn: response.expiresInSec,
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
      const response = await AuthAPI.verifyOTP({ email, code, requestId });
      const { user, token } = response;

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
