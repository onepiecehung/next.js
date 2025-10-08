"use client";

import { ContentRenderer } from "@/components/ui/utilities/content-renderer";

/**
 * Test page for regular img tags from backend
 */
export default function TestImgTagPage() {
  const content = `
    <h1>Test Regular IMG Tags</h1>
    <p>This tests regular <code>&lt;img&gt;</code> tags from backend HTML content.</p>
    
    <img 
      src="https://cdn.calumma.cc/media/91437909999226880_1759909296577_490065573.jpeg" 
      alt="Test Image from Backend" 
      title="Backend Image Test" 
      width="800" 
      height="600"
    />
    
    <p>If you see the image above with Next.js optimization, it's working!</p>
    
    <h2>Another Image Test</h2>
    <img 
      src="https://images.unsplash.com/photo-1506905925346-14bda316dbe3?w=800&h=600&fit=crop&auto=format" 
      alt="Mountain Landscape" 
      title="Beautiful Mountain View"
    />
    
    <p>This image doesn't have width/height attributes, so it should use defaults.</p>
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
