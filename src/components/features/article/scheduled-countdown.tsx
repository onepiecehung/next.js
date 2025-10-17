"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { CountdownTimer } from "@/components/ui/utilities";
import { Clock } from "lucide-react";

// Force TypeScript to recompile

interface ScheduledCountdownProps {
  /**
   * Scheduled publish date
   */
  scheduledAt: Date | string;

  /**
   * Article title for context
   */
  articleTitle?: string;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Callback when countdown completes
   */
  onComplete?: () => void;
}

/**
 * Scheduled Article Countdown Component
 * Displays countdown timer for scheduled article publication
 * Includes article context and styling
 */
export function ScheduledCountdown({
  scheduledAt,
  articleTitle,
  className,
  onComplete,
}: ScheduledCountdownProps) {
  const { t } = useI18n();

  const handleCountdownComplete = () => {
    // Call the parent callback if provided
    if (onComplete) {
      onComplete();
    }
    console.log("Article is now being published!");
  };

  return (
    <div
      className={`bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 ${className || ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            {t("schedule.countdownTitle", "article") || "Scheduled Publication"}
          </h3>

          {articleTitle && (
            <p className="text-xs text-amber-700 mb-3 line-clamp-2">
              "{articleTitle}"
            </p>
          )}

          <div className="space-y-2">
            <p className="text-xs text-amber-600">
              {t("schedule.countdownDescription", "article") ||
                "This article will be published in:"}
            </p>

            <CountdownTimer
              targetDate={scheduledAt}
              onComplete={handleCountdownComplete}
              showDays={true}
              showHours={true}
              showMinutes={true}
              showSeconds={true}
              completedText={
                t("schedule.publishing", "article") || "Publishing now..."
              }
              expiredText={t("schedule.published", "article") || "Published"}
              className="justify-start"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
