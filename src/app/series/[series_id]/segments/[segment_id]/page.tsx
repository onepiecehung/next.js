"use client";

import {
  ArrowLeft,
  Download,
  FileText,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Minimize2,
  Play,
  Video,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { Badge } from "@/components/ui/core/badge";
import { useSeries, useSeriesFull, useSeriesSegment } from "@/hooks/series";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import { cn } from "@/lib/utils";

/**
 * Segment Detail Page Component
 * Displays segment information and attachments
 * URL pattern: /series/[series_id]/segments/[segment_id]
 */
export default function SegmentDetailPage() {
  const params = useParams();
  const { t } = useI18n();
  const seriesId = params.series_id as string;
  const segmentId = params.segment_id as string;

  // Fetch segment data
  const {
    data: segment,
    isLoading: isLoadingSegment,
    error: segmentError,
  } = useSeriesSegment(seriesId, segmentId);

  // Fetch series data for context
  const { data: seriesDisplay } = useSeries(seriesId);
  const { data: backendSeries } = useSeriesFull(seriesId);

  // Image size mode state
  type ImageSizeMode = "default" | "full" | "half" | "fit";
  const [imageSizeMode, setImageSizeMode] = useState<ImageSizeMode>("default");

  // Helper functions - defined before useMemo to avoid reference errors
  // Check if media is image
  const isImage = (url: string, type?: string, mimeType?: string) => {
    const mediaType = mimeType || type;
    if (mediaType) {
      return mediaType.startsWith("image/");
    }
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  // Check if media is video
  const isVideo = (url: string, type?: string, mimeType?: string) => {
    const mediaType = mimeType || type;
    if (mediaType) {
      return mediaType.startsWith("video/");
    }
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
  };

  // Check if media is document
  const isDocument = (url: string, type?: string, mimeType?: string) => {
    const mediaType = mimeType || type;
    if (mediaType) {
      return mediaType.includes("pdf") || mediaType.includes("epub");
    }
    return /\.(pdf|epub)$/i.test(url);
  };

  // Get all image attachments - use useMemo to ensure it's computed before useEffect
  const imageAttachments = useMemo(() => {
    if (!segment) return [];
    return (segment.attachments || segment.media || []).filter((media) =>
      isImage(media.url, media.type, media.mimeType),
    );
  }, [segment]);

  // Show 404 if segment not found
  if (!isLoadingSegment && !segmentError && !segment) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format duration helper
  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Get segment number display
  const getSegmentNumber = () => {
    if (!segment) return "";
    if (segment.subNumber) {
      return `${segment.number}.${segment.subNumber}`;
    }
    return segment.number.toString();
  };

  // Get segment type text
  const getSegmentTypeText = () => {
    if (!segment) return "";
    const typeMap: Record<string, string> = {
      chapter: t("segments.type.chapter", "series"),
      episode: t("segments.type.episode", "series"),
      trailer: t("segments.type.trailer", "series"),
    };
    return typeMap[segment.type] || segment.type;
  };

  // Get status text
  const getStatusText = () => {
    if (!segment) return "";
    const statusMap: Record<string, string> = {
      active: t("segments.status.active", "series"),
      inactive: t("segments.status.inactive", "series"),
      pending: t("segments.status.pending", "series"),
      archived: t("segments.status.archived", "series"),
    };
    return statusMap[segment.status] || segment.status;
  };

  // Get access type text
  const getAccessTypeText = () => {
    if (!segment) return "";
    const accessMap: Record<string, string> = {
      free: t("segments.accessType.free", "series"),
      paid: t("segments.accessType.paid", "series"),
      subscription: t("segments.accessType.subscription", "series"),
      membership: t("segments.accessType.membership", "series"),
    };
    return accessMap[segment.accessType] || segment.accessType;
  };

  // Scroll to top when segment changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [segmentId]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection
        loading={isLoadingSegment}
        data={segment}
        className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
      >
        <Skeletonize loading={isLoadingSegment}>
          {segmentError && (
            <div className="text-center max-w-md mx-auto py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Segment Not Found
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {segmentError.message || "The segment you're looking for doesn't exist."}
              </p>
              <Link href={`/series/${seriesId}`}>
                <Button variant="outline">Back to Series</Button>
              </Link>
            </div>
          )}

          {!segmentError && segment && (
            <>
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <Link
                  href={`/series/${seriesId}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 sm:mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {seriesDisplay?.title || "Series"}
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {getSegmentTypeText()} {getSegmentNumber()}
                      {segment.title && `: ${segment.title}`}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getSegmentTypeText()}
                      </Badge>
                      <Badge
                        variant={
                          segment.status === "active"
                            ? "default"
                            : segment.status === "pending"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {getStatusText()}
                      </Badge>
                      {segment.isNsfw && (
                        <Badge variant="destructive" className="text-xs">
                          NSFW
                        </Badge>
                      )}
                      {segment.accessType !== "free" && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Lock className="h-3 w-3" />
                          {getAccessTypeText()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Main Content - Manga Reader Style */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Summary */}
                  {segment.summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">
                          Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line">
                          {segment.summary}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Description */}
                  {segment.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">
                          Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line">
                          {segment.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Manga Reader - Continuous Scroll View */}
                  {imageAttachments.length > 0 && (
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                          <div>
                            <CardTitle className="text-base sm:text-lg">
                              {getSegmentTypeText()} {getSegmentNumber()}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {imageAttachments.length} pages
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Image Size Selector */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                  {imageSizeMode === "default" && (
                                    <>
                                      <Maximize2 className="h-4 w-4" />
                                      Default
                                    </>
                                  )}
                                  {imageSizeMode === "full" && (
                                    <>
                                      <Maximize2 className="h-4 w-4" />
                                      Full Width
                                    </>
                                  )}
                                  {imageSizeMode === "half" && (
                                    <>
                                      <Minimize2 className="h-4 w-4" />
                                      Half Width
                                    </>
                                  )}
                                  {imageSizeMode === "fit" && (
                                    <>
                                      <ZoomIn className="h-4 w-4" />
                                      Fit Image
                                    </>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Image Size</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("default")}
                                  className={cn(
                                    imageSizeMode === "default" && "bg-accent",
                                  )}
                                >
                                  <Maximize2 className="h-4 w-4 mr-2" />
                                  Default (max-w-5xl)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("full")}
                                  className={cn(
                                    imageSizeMode === "full" && "bg-accent",
                                  )}
                                >
                                  <Maximize2 className="h-4 w-4 mr-2" />
                                  Full Width
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("half")}
                                  className={cn(
                                    imageSizeMode === "half" && "bg-accent",
                                  )}
                                >
                                  <Minimize2 className="h-4 w-4 mr-2" />
                                  Half Width
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("fit")}
                                  className={cn(
                                    imageSizeMode === "fit" && "bg-accent",
                                  )}
                                >
                                  <ZoomIn className="h-4 w-4 mr-2" />
                                  Fit Image (Original Size)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="gap-2"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Top
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {/* Continuous Scroll Container */}
                        <div className="bg-black/5 dark:bg-black/20">
                          {/* Image List - Load sequentially from top to bottom */}
                          <div className="space-y-0">
                            {imageAttachments.map((media, index) => (
                              <div
                                key={media.id}
                                className="group relative w-full bg-background border-b border-border last:border-b-0"
                              >
                                {/* Page Number Indicator */}
                                <div className="absolute top-2 left-2 z-10 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 border border-border">
                                  <span className="text-xs font-medium text-foreground">
                                    Page {index + 1} / {imageAttachments.length}
                                  </span>
                                </div>

                                {/* Image Container - Full width, auto height */}
                                <div className="flex items-center justify-center w-full py-2 sm:py-4">
                                  <div
                                    className={cn(
                                      "relative",
                                      imageSizeMode === "default" && "w-full max-w-5xl",
                                      imageSizeMode === "full" && "w-full",
                                      imageSizeMode === "half" && "w-full sm:w-1/2",
                                      imageSizeMode === "fit" && "w-auto",
                                    )}
                                  >
                                    <Skeletonize loading={false}>
                                      <Image
                                        src={media.url}
                                        alt={`Page ${index + 1} - ${media.name || ""}`}
                                        width={1200}
                                        height={1600}
                                        className={cn(
                                          imageSizeMode === "fit"
                                            ? "h-auto w-auto max-w-full object-contain"
                                            : "w-full h-auto object-contain",
                                        )}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                                        priority={index < 3}
                                        loading={index < 3 ? "eager" : "lazy"}
                                      />
                                    </Skeletonize>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bottom Info Bar */}
                          <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border px-4 py-3">
                            <div className="flex items-center justify-center max-w-4xl mx-auto">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                  Total: {imageAttachments.length} pages
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="gap-2"
                                >
                                  <ArrowLeft className="h-4 w-4" />
                                  Back to Top
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Non-Image Attachments (Videos, Documents) */}
                  {((segment.attachments && segment.attachments.length > 0) ||
                    (segment.media && segment.media.length > 0)) && (
                    <>
                      {(
                        segment.attachments || segment.media || []
                      ).some(
                        (media) =>
                          !isImage(media.url, media.type, media.mimeType),
                      ) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base sm:text-lg">
                              Other Attachments
                            </CardTitle>
                            <CardDescription>
                              Videos and documents
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {(segment.attachments || segment.media || [])
                                .filter(
                                  (media) =>
                                    !isImage(media.url, media.type, media.mimeType),
                                )
                                .map((media) => (
                                  <div
                                    key={media.id}
                                    className="relative group border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                                  >
                                    {/* Video */}
                                    {isVideo(media.url, media.type, media.mimeType) && (
                                      <div className="relative aspect-video w-full bg-black">
                                        <video
                                          src={media.url}
                                          controls
                                          className="w-full h-full"
                                        >
                                          Your browser does not support the video tag.
                                        </video>
                                        <div className="absolute top-2 left-2">
                                          <Badge variant="secondary" className="gap-1">
                                            <Video className="h-3 w-3" />
                                            Video
                                          </Badge>
                                        </div>
                                      </div>
                                    )}

                                    {/* Document */}
                                    {isDocument(media.url, media.type, media.mimeType) && (
                                      <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                                        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                                        <p className="text-sm font-medium text-foreground mb-2">
                                          {(media.mimeType || media.type)?.includes("pdf")
                                            ? "PDF"
                                            : "EPUB"}
                                        </p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-2"
                                          asChild
                                        >
                                          <a
                                            href={media.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Download className="h-4 w-4" />
                                            Open
                                          </a>
                                        </Button>
                                      </div>
                                    )}

                                    {/* Media Info */}
                                    <div className="p-3 border-t border-border">
                                      <p className="text-xs text-muted-foreground truncate">
                                        {media.mimeType || media.type || "Unknown type"}
                                      </p>
                                      {media.name && (
                                        <p className="text-xs font-medium text-foreground truncate mt-1">
                                          {media.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

                  {/* No Attachments */}
                  {(!segment.attachments ||
                    segment.attachments.length === 0) &&
                    (!segment.media || segment.media.length === 0) && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          No attachments available for this segment
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

              </div>
            </>
          )}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}

