import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/write", "/users", "/demo/editor"];

// Define auth routes that should redirect if user is already authenticated
const authRoutes = ["/auth/login", "/auth/register"];

// Define public routes that don't require authentication
const publicRoutes = ["/", "/demo", "/demo/theming"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware: Processing request to", pathname);

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if the current path is a public route
  // const isPublicRoute = publicRoutes.some(route =>
  //   pathname.startsWith(route)
  // )

  // Get the access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  console.log(
    "Middleware: isProtectedRoute:",
    isProtectedRoute,
    "isAuthRoute:",
    isAuthRoute,
    "accessToken:",
    !!accessToken,
  );

  // If accessing a protected route without authentication
  if (isProtectedRoute && !accessToken) {
    // Redirect to login page with return URL
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes while authenticated
  if (isAuthRoute && accessToken) {
    // Get the redirect URL from query params or default to home
    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
    console.log(
      "Middleware: User authenticated on auth route, redirect to:",
      redirectUrl,
    );
    // Only redirect if we're not already on the target page
    if (pathname !== redirectUrl) {
      console.log("Middleware: Redirecting from", pathname, "to", redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      console.log("Middleware: Already on target page, no redirect needed");
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

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
