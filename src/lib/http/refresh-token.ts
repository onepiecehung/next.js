import axios from "axios";

import { API_BASE_URL } from "./constants";
import {
  clearRefreshTokenFallback,
  clearTokens,
  getRefreshTokenFallback,
  setAccessToken,
} from "./tokens";

type RefreshTokenResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
  };
};

export async function refreshAccessToken(): Promise<string> {
  try {
    const refreshToken = getRefreshTokenFallback();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const refreshHttp = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: false,
    });

    const response = await refreshHttp.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    const accessToken = response.data?.data?.accessToken;
    if (!response.data?.success || !accessToken) {
      throw new Error("Failed to obtain access token from refresh");
    }

    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    clearTokens();
    clearRefreshTokenFallback();
    throw error;
  }
}
