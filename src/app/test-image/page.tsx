"use client";

import { ContentRenderer } from "@/components/ui/utilities/content-renderer";

/**
 * Simple test page for Next.js Image optimization
 */
export default function TestImagePage() {
  const content = `
    <h1>Test Next.js Image</h1>
    <p>This is a simple test to verify Next.js Image optimization works.</p>
    
    <custom-image 
      src="https://cdn.calumma.cc/media/91437909999226880_1759909296577_490065573.jpeg" 
      alt="Mountain Landscape" 
      title="Beautiful Mountain View" 
      width="800" 
      height="600">
    </custom-image>
    
    <p>If you see the image above, Next.js Image optimization is working!</p>
  `;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ContentRenderer
          content={content}
          enableSyntaxHighlighting={true}
          useTipTapStyling={true}
        />
      </div>
    </div>
  );
}
