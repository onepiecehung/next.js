"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { Button } from "@/components/ui/core/button";
import {
  rateLimitBus,
  getRateLimitRemainingSeconds,
  type RateLimitEventDetail,
} from "@/lib/rate-limit";
import { useI18n } from "@/components/providers/i18n-provider";

type RateLimitProviderProps = {
  children: React.ReactNode;
};

export function RateLimitProvider({ children }: RateLimitProviderProps) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [remaining, setRemaining] = React.useState<number>(0);

  // Tick every second while dialog is open
  React.useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      const secs = getRateLimitRemainingSeconds();
      setRemaining(secs);
      if (secs <= 0) {
        setOpen(false);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  // Listen to bus events
  React.useEffect(() => {
    return rateLimitBus.on((_detail: RateLimitEventDetail) => {
      const secs = getRateLimitRemainingSeconds();
      setRemaining(secs);
      setOpen(secs > 0);
    });
  }, []);

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
              {t("common.rateLimitTitle", "Too Many Requests")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t(
                "common.rateLimitDescription",
                "You have hit the request limit. Please wait before trying again.",
              )}
            </p>
            <p className="text-base font-medium text-foreground">
              {t("common.rateLimitRetryIn", "Retry in")} {remaining}s
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                {t("common.buttonClose", "Close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RateLimitProvider;
