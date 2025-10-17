"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/layout/dialog";
import { CountdownTimer } from "@/components/ui/utilities";
import { Clock } from "lucide-react";

interface ScheduledCountdownDialogProps {
  /**
   * Target date/time for the countdown
   */
  scheduledAt: Date | string;
  
  /**
   * Article title for context
   */
  articleTitle?: string;
  
  /**
   * Callback when countdown completes
   */
  onComplete?: () => void;
  
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Scheduled Countdown Dialog Component
 * Displays countdown timer in a modal dialog with backdrop blur
 * Perfect for scheduled article publication countdown
 */
export function ScheduledCountdownDialog({
  scheduledAt,
  articleTitle,
  onComplete,
  open,
  onOpenChange,
}: ScheduledCountdownDialogProps) {
  const { t } = useI18n();

  const handleCountdownComplete = () => {
    // Call the parent callback if provided
    if (onComplete) {
      onComplete();
    }
    console.log("Article is now being published!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            {t("schedule.countdownTitle", "article")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Article Title */}
          {articleTitle && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t("schedule.countdownDescription", "article")}
              </p>
            </div>
          )}
          
          {/* Countdown Timer */}
          <div className="flex justify-center py-4">
            <CountdownTimer
              targetDate={scheduledAt}
              onComplete={handleCountdownComplete}
              showDays={true}
              showHours={true}
              showMinutes={true}
              showSeconds={true}
              completedText={t("schedule.publishing", "article") || "Publishing now..."}
              expiredText={t("schedule.published", "article") || "Published"}
              className="scale-110"
            />
          </div>
          
          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {t("schedule.scheduledFor", "article", {
                date: new Date(scheduledAt).toLocaleString(),
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
