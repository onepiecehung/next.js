"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button, DateTimePicker } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { Clock } from "lucide-react";

interface ScheduledPublishDialogProps {
  readonly scheduledPublish: Date | null;
  readonly setScheduledPublish: (date: Date | null) => void;
  readonly onSchedule: () => void;
  readonly isSubmitting: boolean;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

/**
 * Scheduled Publish Dialog Component
 * Handles scheduling articles for future publication
 */
export function ScheduledPublishDialog({
  scheduledPublish,
  setScheduledPublish,
  onSchedule,
  isSubmitting,
  open,
  onOpenChange,
}: ScheduledPublishDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("schedule.scheduleDialogTitle", "article")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("schedule.scheduleDialogDescription", "article")}
          </p>
          <DateTimePicker
            value={scheduledPublish}
            onChange={setScheduledPublish}
            placeholder={t("schedule.schedulePlaceholder", "article")}
            label={t("schedule.scheduleDialogTitle", "article")}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setScheduledPublish(null);
                onOpenChange?.(false);
              }}
              disabled={isSubmitting}
            >
              {t("cancel", "common") || "Cancel"}
            </Button>
            <Button
              onClick={() => {
                onSchedule();
                onOpenChange?.(false);
              }}
              disabled={isSubmitting || !scheduledPublish}
            >
              {isSubmitting
                ? t("schedule.creating", "article")
                : t("schedule.scheduleButton", "article")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
