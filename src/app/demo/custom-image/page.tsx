"use client";

import { TipTapEditor } from "@/components/features/text-editor/tiptap-editor";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useState } from "react";

/**
 * Demo page for testing custom image node with Next.js Image component
 * Shows the TipTap editor with custom image support and content renderer
 */
export default function CustomImageDemoPage() {
  const [content, setContent] = useState(`
    <h1>Custom Image Demo</h1>
    <p>This demo shows how the TipTap editor uses Next.js Image component instead of regular img tags.</p>
    
    <h2>Features:</h2>
    <ul>
      <li>✅ Next.js Image optimization</li>
      <li>✅ Lazy loading</li>
      <li>✅ Responsive sizing</li>
      <li>✅ Blur placeholder</li>
      <li>✅ Error handling</li>
      <li>✅ Image controls (edit, download, delete)</li>
    </ul>
    
    <h2>Test Image:</h2>
    <p>Try adding an image using the image button in the toolbar, or paste an image directly.</p>
  `);

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const addTestImage = () => {
    const testImageUrl = "https://images.unsplash.com/photo-1506905925346-14bda316dbe3?w=800&h=600&fit=crop&auto=format";
    const imageHTML = `<custom-image src="${testImageUrl}" alt="Test Mountain Image" title="Beautiful Mountain Landscape" width="800" height="600"></custom-image>`;
    setContent(prev => prev + imageHTML);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Custom Image Node Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            TipTap Editor with Next.js Image Component Integration
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Editor Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editor</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTestImage}
                  >
                    Add Test Image
                  </Button>
                  <Button
                    variant={isPreviewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Write content and add images using the toolbar. Images will use Next.js Image component for optimization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TipTapEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Start writing and add some images..."
                className="min-h-[500px]"
              />
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Content Renderer Preview</CardTitle>
              <CardDescription>
                How your content will look when rendered with the ContentRenderer component.
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

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Image Node Features</CardTitle>
            <CardDescription>
              Benefits of using Next.js Image component in the TipTap editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Performance</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic image optimization</li>
                  <li>• WebP format conversion</li>
                  <li>• Responsive image sizing</li>
                  <li>• Lazy loading by default</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">User Experience</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Blur placeholder while loading</li>
                  <li>• Error handling with retry</li>
                  <li>• Image controls overlay</li>
                  <li>• Alt text and title support</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Developer Experience</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• TypeScript support</li>
                  <li>• Consistent with Next.js patterns</li>
                  <li>• Easy to customize</li>
                  <li>• SEO-friendly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
            <CardDescription>
              How the custom image node works under the hood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">1. Custom TipTap Node</h4>
                <p className="text-sm text-muted-foreground">
                  Created a custom TipTap node that renders React components instead of plain HTML elements.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">2. Next.js Image Integration</h4>
                <p className="text-sm text-muted-foreground">
                  The custom node uses Next.js Image component with proper sizing, lazy loading, and optimization.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">3. Content Renderer Support</h4>
                <p className="text-sm text-muted-foreground">
                  Content renderer processes custom-image tags and converts them to optimized img elements for display.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">4. Responsive Design</h4>
                <p className="text-sm text-muted-foreground">
                  Images automatically adapt to different screen sizes using Next.js responsive image features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
