"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/core/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Featured series type for hero carousel
 */
export type FeaturedSeries = {
  id: string;
  title: string;
  altTitle?: string;
  description: string;
  tags: string[];
  coverUrl: string;
};

/**
 * Series Hero Carousel Component
 * MangaDex-style hero carousel with blurred background and series information
 */
interface SeriesHeroCarouselProps {
  items: FeaturedSeries[];
  className?: string;
}

export function SeriesHeroCarousel({
  items,
  className,
}: SeriesHeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Safe fallback
  if (!items?.length) return null;

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative min-w-0 flex-shrink-0 w-full h-full"
            >
              {/* Background image - extends to top to overlay navigation */}
              <div className="absolute inset-0 -top-[80px] z-0 overflow-hidden">
                <Image
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  style={{
                    filter: "blur(40px)",
                    transform: "scale(1.2)",
                  }}
                />
              </div>

              {/* Gradient overlay from bottom (dark/opaque) to top (transparent) - MangaDex style */}
              <div 
                className="absolute inset-0 -top-[80px] z-[1]"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 85%, transparent 100%)'
                }}
              />

              {/* Slide container */}
              <div className="relative px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 h-full flex items-center z-10">
                <div className="relative z-10 w-full grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6 items-center">
                  {/* Info section - Left */}
                  <div className="flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4">
                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white line-clamp-2">
                      {item.title}
                    </h2>

                    {/* Alt title */}
                    {item.altTitle && (
                      <p className="text-sm text-neutral-200 line-clamp-1">
                        {item.altTitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 sm:line-clamp-3 lg:line-clamp-4">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cover image - Right */}
                  <div className="mx-auto flex items-center justify-center">
                    <div className="relative w-auto aspect-[2/3] overflow-hidden rounded-lg shadow-lg min-w-[120px] sm:min-w-[150px] md:min-w-[180px] lg:min-w-[220px] max-h-[calc(100%-2rem)] sm:max-h-[calc(100%-3rem)] lg:max-h-[calc(100%-4rem)]">
                      <Image
                        src={item.coverUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 220px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - visible on desktop (sm+) */}
      {items.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hidden sm:flex",
              !canScrollPrev && "opacity-50 cursor-not-allowed",
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hidden sm:flex",
              !canScrollNext && "opacity-50 cursor-not-allowed",
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

