"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface RedirectOverlayProps {
  /**
   * Whether the overlay is visible
   */
  isVisible: boolean;
  
  /**
   * Countdown seconds remaining
   */
  countdown: number;
  
  /**
   * Custom title text (optional)
   */
  title?: string;
  
  /**
   * Custom description text (optional)
   */
  description?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to show the countdown
   */
  showCountdown?: boolean;
  
  /**
   * Custom loading spinner (optional)
   */
  spinner?: React.ReactNode;
}

/**
 * Reusable Redirect Overlay Component
 * Displays a loading overlay with countdown timer for redirects
 * Can be used across different pages for consistent UX
 */
export function RedirectOverlay({
  isVisible,
  countdown,
  title,
  description,
  className,
  showCountdown = true,
  spinner,
}: RedirectOverlayProps) {
  const { t } = useI18n();

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div 
        className={cn(
          "bg-card border border-border rounded-xl p-6 sm:p-8 shadow-lg max-w-md mx-4 text-center",
          className
        )}
      >
        {/* Loading Spinner */}
        {spinner || (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        )}
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title || t("success.redirecting", "write")}
        </h3>
        
        {/* Description with Countdown */}
        <p className="text-sm text-muted-foreground">
          {description || (
            showCountdown 
              ? t("success.redirectCountdown", "write").replace("{seconds}", countdown.toString())
              : t("success.redirecting", "write")
          )}
        </p>
      </div>
    </div>
  );
}
