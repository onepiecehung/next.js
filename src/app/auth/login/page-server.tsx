import { generatePageMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";
import { LoginClientWrapper } from "./login-client-wrapper";

/**
 * Generate metadata for login page
 */
export const metadata: Metadata = generatePageMetadata("login", "auth", "en", {
  title: "Login",
  description:
    "Sign in to your account to access your articles, profile, and writing tools.",
  keywords: ["login", "sign in", "authentication", "account"],
  url: "/auth/login",
});

/**
 * Login Page Component (Server Component)
 * Handles authentication and redirects
 *
 * This is a Server Component that can generate dynamic metadata
 * The actual login form and client-side interactions are handled by LoginClientWrapper
 */
export default function LoginPage() {
  return <LoginClientWrapper />;
}
