"use client";

import Image from "next/image";
import { useState } from "react";

interface CustomImageContentRendererProps {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Custom Image Content Renderer Component
 * Uses Next.js Image component with proper optimization through _next/image
 */
export function CustomImageContentRenderer({
  src,
  alt = "",
  title = "",
  width = 800,
  height = 600,
  className = "",
}: CustomImageContentRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center h-32 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25 my-4 ${className}`}>
        <div className="text-center">
          <div className="text-muted-foreground text-sm mb-2">Failed to load image</div>
          <div className="text-xs text-muted-foreground/70">{src}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group my-4 inline-block max-w-full ${className}`}>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
        
        <Image
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className="rounded-lg max-w-full h-auto"
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={false}
          placeholder="empty"
        />
      </div>
      
      {/* Image info */}
      {(alt || title) && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {alt && <div>Alt: {alt}</div>}
          {title && <div>Title: {title}</div>}
        </div>
      )}
    </div>
  );
}
