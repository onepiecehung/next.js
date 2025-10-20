import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Route configuration interface
 * Follows Open/Closed Principle - easy to extend
 */
export interface RouteConfig {
  readonly protected: readonly string[];
  readonly auth: readonly string[];
  readonly public: readonly string[];
}

/**
 * Default route configuration
 * Centralized configuration following Single Responsibility
 */
export const DEFAULT_ROUTE_CONFIG: RouteConfig = {
  protected: ["/write", "/users", "/demo/editor"],
  auth: ["/auth/login", "/auth/register"],
  public: ["/", "/demo", "/demo/theming"],
} as const;

/**
 * Route matcher service
 * Single responsibility: determine route types
 */
export class RouteMatcher {
  constructor(private readonly config: RouteConfig) {}

  /**
   * Check if pathname matches any protected routes
   */
  isProtectedRoute(pathname: string): boolean {
    return this.config.protected.some((route) => pathname.startsWith(route));
  }

  /**
   * Check if pathname matches any auth routes
   */
  isAuthRoute(pathname: string): boolean {
    return this.config.auth.some((route) => pathname.startsWith(route));
  }

  /**
   * Check if pathname matches any public routes
   */
  isPublicRoute(pathname: string): boolean {
    return this.config.public.some((route) => pathname.startsWith(route));
  }
}

/**
 * Authentication service
 * Single responsibility: handle auth-related operations
 */
export class AuthService {
  /**
   * Extract access token from request cookies
   */
  getAccessToken(request: NextRequest): string | null {
    return request.cookies.get("accessToken")?.value || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(request: NextRequest): boolean {
    return !!this.getAccessToken(request);
  }
}

/**
 * Redirect service
 * Single responsibility: handle redirects
 */
export class RedirectService {
  /**
   * Create login redirect URL with return path
   */
  createLoginRedirect(request: NextRequest, returnPath: string): NextResponse {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", returnPath);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Create authenticated user redirect
   */
  createAuthRedirect(request: NextRequest, redirectPath?: string): NextResponse {
    const redirectUrl = redirectPath || request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
}

/**
 * Logger service
 * Single responsibility: handle logging
 */
export class LoggerService {
  private readonly isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log middleware processing information
   */
  logRequest(pathname: string, isProtected: boolean, isAuth: boolean, hasToken: boolean): void {
    if (!this.isDevelopment) return;

    console.log("Middleware: Processing request to", pathname);
    console.log("Middleware: isProtectedRoute:", isProtected, "isAuthRoute:", isAuth, "accessToken:", hasToken);
  }

  /**
   * Log redirect information
   */
  logRedirect(from: string, to: string, reason: string): void {
    if (!this.isDevelopment) return;

    console.log(`Middleware: ${reason} - Redirecting from ${from} to ${to}`);
  }
}

/**
 * Main middleware handler
 * Orchestrates all services following Dependency Inversion Principle
 */
export class MiddlewareHandler {
  constructor(
    private readonly routeMatcher: RouteMatcher,
    private readonly authService: AuthService,
    private readonly redirectService: RedirectService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Process incoming request
   */
  handle(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;
    const isProtected = this.routeMatcher.isProtectedRoute(pathname);
    const isAuth = this.routeMatcher.isAuthRoute(pathname);
    const isAuthenticated = this.authService.isAuthenticated(request);

    // Log request processing
    this.logger.logRequest(pathname, isProtected, isAuth, isAuthenticated);

    // Handle protected routes
    if (isProtected && !isAuthenticated) {
      this.logger.logRedirect(pathname, "/auth/login", "Protected route without auth");
      return this.redirectService.createLoginRedirect(request, pathname);
    }

    // Handle auth routes for authenticated users
    if (isAuth && isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
      
      // Only redirect if not already on target page
      if (pathname !== redirectUrl) {
        this.logger.logRedirect(pathname, redirectUrl, "Authenticated user on auth route");
        return this.redirectService.createAuthRedirect(request, redirectUrl);
      } else {
        this.logger.logRedirect(pathname, redirectUrl, "Already on target page, no redirect needed");
      }
    }

    // Allow request to continue
    return NextResponse.next();
  }
}

/**
 * Factory function to create middleware handler with default dependencies
 * Follows Dependency Injection pattern
 */
export function createMiddlewareHandler(config: RouteConfig = DEFAULT_ROUTE_CONFIG): MiddlewareHandler {
  const routeMatcher = new RouteMatcher(config);
  const authService = new AuthService();
  const redirectService = new RedirectService();
  const logger = new LoggerService();

  return new MiddlewareHandler(routeMatcher, authService, redirectService, logger);
}

/**
 * Main middleware function
 * Clean, simple entry point
 */
export function middleware(request: NextRequest): NextResponse {
  const handler = createMiddlewareHandler();
  return handler.handle(request);
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};