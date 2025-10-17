"use client";

import { ScheduledCountdown } from "./scheduled-countdown";

/**
 * Test component for scheduled article countdown
 * This can be used to test the countdown functionality
 */
export function ScheduledArticleTest() {
  // Test with different scenarios
  const testCases = [
    {
      title: "Article in 2 hours",
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },
    {
      title: "Article in 30 minutes",
      scheduledAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    },
    {
      title: "Article in 5 minutes",
      scheduledAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    },
  ];

  const handleComplete = () => {
    console.log("Countdown completed! Article should be published now.");
    alert("Article is now being published!");
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Scheduled Article Countdown Test</h2>

      {testCases.map((testCase, index) => (
        <div key={index} className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{testCase.title}</h3>
          <ScheduledCountdown
            scheduledAt={testCase.scheduledAt}
            articleTitle={`Test Article ${index + 1}`}
            onComplete={handleComplete}
          />
        </div>
      ))}
    </div>
  );
}
