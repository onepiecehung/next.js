import { setupHttpInterceptors } from "./interceptors";

setupHttpInterceptors();

export { http, publicHttp } from "./instances";
export {
  clearRefreshTokenFallback,
  clearTokens,
  getAccessToken,
  getRefreshTokenFallback,
  setAccessToken,
  setRefreshTokenFallback,
} from "./tokens";
export { setupHttpInterceptors };
