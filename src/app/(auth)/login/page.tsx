"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { useAuthRedirect } from "@/hooks/auth";
import {
    accessTokenAtom,
    authLoadingAtom,
    currentUserAtom,
    loginAction,
    loginWithGithubAction,
    loginWithGoogleAction,
} from "@/lib/auth-store";
import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginCard } from "./_components/LoginCard";

/**
 * Login page component
 * Refactored with new component structure and improved UX/UI
 */
export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);

  // Redirect if already authenticated
  useAuthRedirect();

  const isAuthenticated = !!user;

  // Handle email/password login
  const handleEmailPasswordLogin = async (data: {
    email: string;
    password: string;
  }) => {
    const user = await loginAction(data.email, data.password);
    setUser(user);
    setAccessToken(null); // Token is stored in http layer
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    const user = await loginWithGoogleAction();
    setUser(user);
    setAccessToken(null); // Token is stored in http layer
  };

  // Handle GitHub OAuth login
  const handleGithubLogin = async () => {
    const user = await loginWithGithubAction();
    setUser(user);
    setAccessToken(null); // Token is stored in http layer
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    console.log("Forgot password clicked");
  };

  // Handle OTP login
  const handleOTPLogin = () => {
    router.push("/auth/login?mode=otp");
  };

  // Handle register
  const handleRegister = () => {
    router.push("/auth/register");
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/");
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if authenticated
  if (isAuthenticated) {
    return null; // useAuthRedirect will handle the redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home link */}
        <div className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        {/* Login Card */}
        <LoginCard
          onSubmitEmailPassword={handleEmailPasswordLogin}
          onGoogle={handleGoogleLogin}
          onGithub={handleGithubLogin}
          onForgotPassword={handleForgotPassword}
          onOTPLogin={handleOTPLogin}
          onRegister={handleRegister}
          onBack={handleBack}
          showBackButton={false}
          title={t("loginTitle", "auth") || "Welcome back"}
          description={
            t("loginSubtitle", "auth") ||
            "Enter your credentials to access your account"
          }
        />

        {/* Additional Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * NextAuth Integration Example (commented out)
 *
 * If you want to use NextAuth instead of custom auth, replace the handlers above with:
 *
 * import { signIn } from "next-auth/react";
 *
 * const handleEmailPasswordLogin = async (data: { email: string; password: string }) => {
 *   await signIn("credentials", {
 *     email: data.email,
 *     password: data.password,
 *     redirect: false,
 *   });
 * };
 *
 * const handleGoogleLogin = async () => {
 *   await signIn("google", { redirect: false });
 * };
 *
 * const handleGithubLogin = async () => {
 *   await signIn("github", { redirect: false });
 * };
 */
