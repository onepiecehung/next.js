"use client";

import { Button } from "@/components/ui";
import { useState } from "react";
import { ScheduledPublishDialog } from "./scheduled-publish-dialog";

/**
 * Test component for scheduled publish functionality
 * This can be used to test the scheduled publish dialog and data flow
 */
export function ScheduledPublishTest() {
  const [scheduledPublish, setScheduledPublish] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = () => {
    console.log("Scheduled publish data:", {
      scheduledPublish,
      scheduledAt: scheduledPublish?.toISOString(),
      status: scheduledPublish ? "scheduled" : "published",
      visibility: "public", // This should be preserved
    });

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      alert("Article scheduled successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Scheduled Publish Test</h2>

      <div className="space-y-2">
        <p>
          <strong>Current scheduled date:</strong>{" "}
          {scheduledPublish?.toLocaleString() || "None"}
        </p>
        <p>
          <strong>ISO String:</strong>{" "}
          {scheduledPublish?.toISOString() || "None"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {scheduledPublish ? "scheduled" : "published"}
        </p>
        <p>
          <strong>Visibility:</strong> public (should be preserved)
        </p>
      </div>

      <Button onClick={() => setIsDialogOpen(true)}>
        Open Schedule Dialog
      </Button>

      <ScheduledPublishDialog
        scheduledPublish={scheduledPublish}
        setScheduledPublish={setScheduledPublish}
        onSchedule={handleSchedule}
        isSubmitting={isSubmitting}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
