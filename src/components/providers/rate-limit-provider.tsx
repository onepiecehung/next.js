"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { getRateLimitRemainingSeconds, rateLimitBus } from "@/lib/rate-limit";
import * as React from "react";

type RateLimitProviderProps = {
  children: React.ReactNode;
};

export function RateLimitProvider({ children }: RateLimitProviderProps) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [remaining, setRemaining] = React.useState<number>(0);

  // Listen to bus events - update state when rate limit is triggered
  React.useEffect(() => {
    return rateLimitBus.on((detail) => {
      // Calculate remaining seconds based on the timestamp from event detail
      // This ensures accuracy as the timestamp is set before the event is emitted
      const now = Date.now();
      const secs = Math.max(0, Math.ceil((detail.untilTimestampMs - now) / 1000));
      setRemaining(secs);
      setOpen(secs > 0);
    });
  }, []);

  // Tick every second while dialog is open to update countdown
  React.useEffect(() => {
    if (!open) return;
    
    // Initial update when dialog opens
    const updateRemaining = () => {
      const secs = getRateLimitRemainingSeconds();
      setRemaining(secs);
      if (secs <= 0) {
        setOpen(false);
      }
    };
    
    // Update immediately
    updateRemaining();
    
    // Update every second
    const id = setInterval(updateRemaining, 1000);
    
    return () => clearInterval(id);
  }, [open]);

  const handleClose = React.useCallback(() => {
    // Allow closing, but if still in cooldown, it will pop up again on new requests
    setOpen(false);
  }, []);

  return (
    <>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("rateLimit.title", "common")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t("rateLimit.description", "common")}
            </p>
            <p className="text-base font-medium text-foreground">
              {t("rateLimit.retryIn", "common")} {remaining}s
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                {t("actions.close", "common")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RateLimitProvider;
