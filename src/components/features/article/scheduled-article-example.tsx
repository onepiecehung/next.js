"use client";

import { ScheduledCountdown } from "./scheduled-countdown";

/**
 * Example usage of ScheduledCountdown component
 * This shows how to use the countdown timer for scheduled articles
 */
export function ScheduledArticleExample() {
  // Example: Article scheduled for 2 hours from now
  const scheduledDate = new Date();
  scheduledDate.setHours(scheduledDate.getHours() + 2);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Scheduled Article Countdown Example
      </h2>

      {/* Basic countdown */}
      <ScheduledCountdown
        scheduledAt={scheduledDate}
        articleTitle="How to Build a Modern React Application with Next.js 15"
      />

      {/* Countdown without article title */}
      <ScheduledCountdown scheduledAt={scheduledDate} />
    </div>
  );
}
