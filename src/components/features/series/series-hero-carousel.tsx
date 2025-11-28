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
              <div className="relative px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 lg:pt-8 pb-3 sm:pb-6 lg:pb-8 h-full flex items-center z-10">
                <div className="relative z-10 w-full flex flex-row sm:grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 items-center">
                  {/* Cover image - Mobile: Left, Desktop: Right */}
                  <div className="flex items-center justify-center flex-shrink-0 sm:order-2 sm:mx-0 sm:w-auto">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg w-[100px] sm:min-w-[150px] md:min-w-[180px] lg:min-w-[220px] h-full max-h-[180px] sm:max-h-[calc(100%-3rem)] lg:max-h-[calc(100%-4rem)]">
                      <Image
                        src={item.coverUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 220px"
                        priority
                      />
                    </div>
                  </div>

                  {/* Info section - Mobile: Right, Desktop: Left */}
                  <div className="flex flex-col justify-center space-y-1 sm:space-y-2 lg:space-y-3 flex-1 min-w-0 sm:order-1 text-left">
                    {/* Title */}
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white line-clamp-2 leading-tight">
                      {item.title}
                    </h2>

                    {/* Alt title */}
                    {item.altTitle && (
                      <p className="text-xs sm:text-sm text-neutral-200 line-clamp-1 mt-0.5">
                        {item.altTitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-200/90 line-clamp-2 sm:line-clamp-3 lg:line-clamp-4 leading-relaxed mt-1">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-start mt-1 sm:mt-2">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-white/10 border border-white/20 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs uppercase tracking-wide text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - reduced opacity on mobile */}
      {items.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border-2 sm:border shadow-lg",
              "opacity-20 sm:opacity-100 active:opacity-100",
              !canScrollPrev && "opacity-10 sm:opacity-50 cursor-not-allowed",
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border-2 sm:border shadow-lg",
              "opacity-20 sm:opacity-100 active:opacity-100",
              !canScrollNext && "opacity-10 sm:opacity-50 cursor-not-allowed",
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </>
      )}

      {/* Dots indicator - mobile only */}
      {items.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:hidden">
          {items.map((_, index) => {
            const isActive = emblaApi?.selectedScrollSnap() === index;
            return (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  isActive
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

