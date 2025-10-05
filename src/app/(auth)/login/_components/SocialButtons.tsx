"use client";

import React from "react";
import { Button } from "@/components/ui";
import { GoogleIcon, GitHubIcon } from "@/components/ui/icons";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

interface SocialButtonsProps {
  onGoogle?: () => Promise<void> | void;
  onGithub?: () => Promise<void> | void;
  disabled?: boolean;
  oauthLoading?: "google" | "github" | null;
  className?: string;
}

/**
 * Social login buttons component
 * Handles Google and GitHub OAuth with individual loading states
 */
export const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGoogle,
  onGithub,
  disabled = false,
  oauthLoading = null,
  className = "",
}) => {
  const isGoogleLoading = oauthLoading === "google";
  const isGithubLoading = oauthLoading === "github";
  const isAnyLoading = isGoogleLoading || isGithubLoading;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Google Login Button */}
      {onGoogle && (
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 text-base font-medium border-border/50 hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onGoogle}
          disabled={disabled || isAnyLoading}
          aria-label="Continue with Google"
        >
          <div className="flex items-center justify-center gap-3">
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" size={16} />
            ) : (
              <GoogleIcon className="w-4 h-4" size={16} />
            )}
            <span>
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </div>
        </Button>
      )}

      {/* GitHub Login Button */}
      {onGithub && (
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 text-base font-medium border-border/50 hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onGithub}
          disabled={disabled || isAnyLoading}
          aria-label="Continue with GitHub"
        >
          <div className="flex items-center justify-center gap-3">
            {isGithubLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" size={16} />
            ) : (
              <GitHubIcon className="w-4 h-4" size={16} />
            )}
            <span>
              {isGithubLoading ? "Connecting..." : "Continue with GitHub"}
            </span>
          </div>
        </Button>
      )}
    </div>
  );
};

/**
 * Social login separator component
 * Visual separator between email/password form and social login
 */
interface SocialSeparatorProps {
  text?: string;
  className?: string;
}

export const SocialSeparator: React.FC<SocialSeparatorProps> = ({
  text,
  className = "",
}) => {
  const { t } = useI18n();
  const separatorText = text || t("orContinueWith", "auth");
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/50" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-background text-muted-foreground">
          {separatorText}
        </span>
      </div>
    </div>
  );
};

/**
 * Social login error component
 * Displays OAuth-specific errors
 */
interface SocialErrorProps {
  error?: string;
  className?: string;
}

export const SocialError: React.FC<SocialErrorProps> = ({
  error,
  className = "",
}) => {
  if (!error) return null;

  return (
    <div
      className={`p-3 rounded-md bg-destructive/10 border border-destructive/20 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm text-destructive font-medium text-center">
        {error}
      </p>
    </div>
  );
};
