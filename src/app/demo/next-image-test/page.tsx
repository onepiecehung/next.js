"use client";

import { TipTapEditor } from "@/components/features/text-editor/tiptap-editor";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useState } from "react";

/**
 * Demo page for testing Next.js Image optimization through _next/image
 * Shows how images are loaded through Next.js optimization API
 */
export default function NextImageTestPage() {
  const [content, setContent] = useState(`
    <h1>Next.js Image Optimization Test</h1>
    <p>This demo shows how images are loaded through <code>_next/image</code> endpoint for optimization.</p>
    
    <h2>Test Images:</h2>
    <p>Click the buttons below to add test images and see them load through Next.js optimization.</p>
  `);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const addUnsplashImage = () => {
    const imageUrl =
      "https://images.unsplash.com/photo-1506905925346-14bda316dbe3?w=800&h=600&fit=crop&auto=format";
    const imageHTML = `<custom-image src="${imageUrl}" alt="Mountain Landscape" title="Beautiful Mountain View" width="800" height="600"></custom-image>`;
    setContent((prev) => prev + imageHTML);
  };

  const addPicsumImage = () => {
    const imageUrl = "https://picsum.photos/800/600?random=1";
    const imageHTML = `<custom-image src="${imageUrl}" alt="Random Image" title="Random Image from Picsum" width="800" height="600"></custom-image>`;
    setContent((prev) => prev + imageHTML);
  };

  const addPlaceholderImage = () => {
    const imageUrl =
      "https://via.placeholder.com/800x600/0066cc/ffffff?text=Next.js+Image+Test";
    const imageHTML = `<custom-image src="${imageUrl}" alt="Placeholder Image" title="Placeholder Test Image" width="800" height="600"></custom-image>`;
    setContent((prev) => prev + imageHTML);
  };

  const clearContent = () => {
    setContent(`
      <h1>Next.js Image Optimization Test</h1>
      <p>This demo shows how images are loaded through <code>_next/image</code> endpoint for optimization.</p>
      
      <h2>Test Images:</h2>
      <p>Click the buttons below to add test images and see them load through Next.js optimization.</p>
    `);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Next.js Image Optimization Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Testing images loaded through <code>_next/image</code> endpoint
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Editor Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editor</span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addUnsplashImage}
                  >
                    Add Unsplash
                  </Button>
                  <Button variant="outline" size="sm" onClick={addPicsumImage}>
                    Add Picsum
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPlaceholderImage}
                  >
                    Add Placeholder
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearContent}
                  >
                    Clear
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Add images using the buttons above. Images will be loaded
                through Next.js optimization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TipTapEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Add some images to test Next.js optimization..."
                className="min-h-[500px]"
              />
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Content Renderer Preview</CardTitle>
              <CardDescription>
                Images rendered through ContentRenderer with Next.js Image
                optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[500px] border border-border rounded-lg p-4 bg-muted/20">
                <ContentRenderer
                  content={content}
                  enableSyntaxHighlighting={true}
                  useTipTapStyling={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Network Tab Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Verify Next.js Image Optimization</CardTitle>
            <CardDescription>
              Follow these steps to confirm images are loaded through{" "}
              <code>_next/image</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  1. Open Developer Tools
                </h3>
                <p className="text-sm text-muted-foreground">
                  Press F12 or right-click → Inspect to open Developer Tools
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  2. Go to Network Tab
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click on the &quot;Network&quot; tab in Developer Tools
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3. Add Images
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click the buttons above to add test images
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4. Check Network Requests
                </h3>
                <p className="text-sm text-muted-foreground">
                  Look for requests to <code>_next/image</code> endpoint instead
                  of direct image URLs
                </p>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <code className="text-xs">
                    _next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-14bda316dbe3%3Fw%3D800%26h%3D600%26fit%3Dcrop%26auto%3Dformat&w=1920&q=75
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  5. Verify Optimization
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Images should be served as WebP/AVIF format</li>
                  <li>• Response headers should show Next.js optimization</li>
                  <li>• Images should be resized based on device size</li>
                  <li>• Loading should be optimized with blur placeholder</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Benefits of Next.js Image Optimization</CardTitle>
            <CardDescription>
              Why using <code>_next/image</code> is better than regular img tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Performance</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic WebP/AVIF conversion</li>
                  <li>• Responsive image sizing</li>
                  <li>• Lazy loading by default</li>
                  <li>• Blur placeholder while loading</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  SEO & Accessibility
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Better Core Web Vitals scores</li>
                  <li>• Proper alt text support</li>
                  <li>• Screen reader friendly</li>
                  <li>• Mobile-first responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
