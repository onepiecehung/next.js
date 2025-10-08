"use client";

import { Button } from "@/components/ui/core/button";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import Link from "next/link";
import { useState } from "react";

/**
 * Test page for navigation issues
 */
export default function TestNavigationPage() {
  const [content, setContent] = useState(`
    <h1>Test Navigation</h1>
    <p>This page tests image loading during navigation.</p>
    
    <img 
      src="https://cdn.calumma.cc/media/91437909999226880_1759909296577_490065573.jpeg" 
      alt="Test Image" 
      width="400" 
      height="300"
    />
    
    <p>If you see this image clearly, navigation is working properly.</p>
  `);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex gap-4 mb-8">
          <Link href="/test-navigation">
            <Button variant="outline">Reload This Page</Button>
          </Link>
          <Link href="/test-image">
            <Button variant="outline">Go to Test Image</Button>
          </Link>
          <Link href="/write">
            <Button variant="outline">Go to Write Page</Button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Content with Image</h2>
          <ContentRenderer
            content={content}
            enableSyntaxHighlighting={true}
            useTipTapStyling={true}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Console Logs</h2>
          <p className="text-sm text-muted-foreground">
            Open Developer Tools → Console to see loading logs
          </p>
        </div>
      </div>
    </div>
  );
}
