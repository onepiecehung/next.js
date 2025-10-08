"use client";

import { WithAutoSkeleton } from "@/components/shared/with-auto-skeleton";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useState } from "react";

/**
 * Test page for WithAutoSkeleton behavior
 */
export default function TestSkeletonPage() {
  const [isLoading, setIsLoading] = useState(true);

  const content = `
    <h1>Test WithAutoSkeleton</h1>
    <p>Testing skeleton behavior with images.</p>
    
    <img 
      src="https://cdn.calumma.cc/media/91437909999226880_1759909296577_490065573.jpeg" 
      alt="Test Image" 
      width="400" 
      height="300"
    />
  `;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Direct WithAutoSkeleton Test
          </h2>
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toggle Loading: {isLoading ? "ON" : "OFF"}
          </button>

          <WithAutoSkeleton loading={isLoading}>
            <img
              src="https://cdn.calumma.cc/media/91437909999226880_1759909296577_490065573.jpeg"
              alt="Test Image"
              width="400"
              height="300"
              className="rounded-lg"
            />
          </WithAutoSkeleton>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">ContentRenderer Test</h2>
          <ContentRenderer
            content={content}
            enableSyntaxHighlighting={true}
            useTipTapStyling={true}
          />
        </div>
      </div>
    </div>
  );
}
