"use client";

import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";

/**
 * Test Loading Component
 * Demonstrates the global loading state functionality
 * Shows how loading state can be controlled from any component
 */
export default function TestLoading() {
  const { userProfileLoading, setUserProfileLoading } = useLoading();

  const toggleLoading = () => {
    setUserProfileLoading(!userProfileLoading);
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border border-border rounded-lg shadow-lg">
      <div className="text-sm font-medium mb-2">Test Loading State</div>
      <div className="text-xs text-muted-foreground mb-3">
        Current: {userProfileLoading ? "Loading" : "Not Loading"}
      </div>
      <Button onClick={toggleLoading} size="sm">
        Toggle Loading
      </Button>
    </div>
  );
}
