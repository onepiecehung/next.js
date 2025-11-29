"use client";

import { Carousel } from "@/components/ui/core/carousel";
import type { PopularSeries } from "@/lib/interface/series.interface";
import { SeriesCarouselItem } from "./series-carousel-item";

/**
 * Series carousel component for popular titles
 */
interface SeriesCarouselProps {
  series: PopularSeries[];
  title?: string;
  autoPlay?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function SeriesCarousel({
  series,
  title,
  autoPlay = true,
  showIndicators = true,
  className,
}: SeriesCarouselProps) {
  return (
    <div className={className}>
      {title && (
        <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </h2>
      )}
      <Carousel
        showArrows={true}
        showIndicators={showIndicators}
        autoPlay={autoPlay}
        autoPlayInterval={5000}
        className="w-full"
      >
        {series.map((series) => (
          <SeriesCarouselItem key={series.id} series={series} />
        ))}
      </Carousel>
    </div>
  );
}
