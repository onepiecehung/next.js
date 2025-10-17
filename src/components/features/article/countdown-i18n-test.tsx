"use client";

import { Button } from "@/components/ui";
import { CountdownTimer } from "@/components/ui/utilities";
import { useState } from "react";

/**
 * Test component for countdown timer i18n
 * This can be used to test the internationalized time units
 */
export function CountdownI18nTest() {
  const [testDate, setTestDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return date;
  });

  const updateTestDate = (hours: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    setTestDate(date);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Countdown Timer i18n Test</h2>
      
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p><strong>Current test time:</strong> {testDate.toLocaleString()}</p>
          <p><strong>Time until:</strong> {Math.round((testDate.getTime() - Date.now()) / (1000 * 60 * 60))} hours</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => updateTestDate(1)} variant="outline" size="sm">
            +1 hour
          </Button>
          <Button onClick={() => updateTestDate(2)} variant="outline" size="sm">
            +2 hours
          </Button>
          <Button onClick={() => updateTestDate(24)} variant="outline" size="sm">
            +1 day
          </Button>
          <Button onClick={() => updateTestDate(48)} variant="outline" size="sm">
            +2 days
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Full Countdown (Days, Hours, Minutes, Seconds)</h3>
            <CountdownTimer
              targetDate={testDate}
              showDays={true}
              showHours={true}
              showMinutes={true}
              showSeconds={true}
              onComplete={() => alert("Countdown completed!")}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Compact Countdown (Hours, Minutes, Seconds)</h3>
            <CountdownTimer
              targetDate={testDate}
              showDays={false}
              showHours={true}
              showMinutes={true}
              showSeconds={true}
              onComplete={() => alert("Countdown completed!")}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Minutes & Seconds Only</h3>
            <CountdownTimer
              targetDate={testDate}
              showDays={false}
              showHours={false}
              showMinutes={true}
              showSeconds={true}
              onComplete={() => alert("Countdown completed!")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
