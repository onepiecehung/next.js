"use client";

import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { ProtectedRoute } from "@/components/features/auth";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Input, Label } from "@/components/ui/core";
import { Badge } from "@/components/ui/core/badge";
import {
  useCreateSegment,
  useSeries,
  useSeriesFull,
} from "@/hooks/series";
import type { UploadedMedia } from "@/lib/api/media";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import { http } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/types";

/**
 * Upload Segment Page Component
 * Allows users to upload new chapters/episodes for a series
 * URL pattern: /series/[series_id]/upload-segment
 */
export default function UploadSegmentPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const seriesId = params.series_id as string;

  // Fetch series data
  const { data: backendSeries, isLoading: isLoadingSeries } = useSeriesFull(seriesId);
  const { data: seriesDisplay } = useSeries(seriesId);

  // Form state
  const [type, setType] = useState<"trailer" | "episode" | "chapter">("chapter");
  const [number, setNumber] = useState<string>("");
  const [subNumber, setSubNumber] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive" | "pending" | "archived">("pending");
  const [accessType, setAccessType] = useState<"free" | "paid" | "subscription" | "membership">("free");
  const [languageCode, setLanguageCode] = useState<string>("en");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [originalReleaseDate, setOriginalReleaseDate] = useState<string>("");
  const [durationSec, setDurationSec] = useState<string>("");
  const [pageCount, setPageCount] = useState<string>("");
  const [startPage, setStartPage] = useState<string>("");
  const [endPage, setEndPage] = useState<string>("");
  const [isNsfw, setIsNsfw] = useState<boolean>(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState<boolean>(false);
  
  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, "pending" | "uploading" | "success" | "error">>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup all object URLs when component unmounts
      mediaFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on unmount - we don't want to cleanup on every file change

  // Create segment mutation
  const { mutate: createSegment, isPending: isSubmitting } = useCreateSegment();

  // Upload a single file with progress tracking
  const uploadSingleFileWithProgress = async (
    file: File,
    onProgress: (progress: number) => void,
  ): Promise<UploadedMedia> => {
    const form = new FormData();
    form.append("files", file);

    const response = await http.post<ApiResponse<UploadedMedia[]>>(
      "/media",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );

    if (response.data.success && response.data.data.length > 0) {
      return response.data.data[0];
    }

    throw new Error(response.data.message || "Upload failed");
  };

  // Upload files one by one with progress tracking
  const uploadFilesSequentially = async (): Promise<string[]> => {
    const uploadedIds: string[] = [];
    
    // Initialize upload status for all files
    const initialStatus: Record<string, "pending" | "uploading" | "success" | "error"> = {};
    const initialProgress: Record<string, number> = {};
    mediaFiles.forEach((file) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      initialStatus[fileKey] = "pending";
      initialProgress[fileKey] = 0;
    });
    setUploadStatus(initialStatus);
    setUploadProgress(initialProgress);
    setIsUploading(true);

    try {
      // Upload files one by one
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

        // Update status to uploading
        setUploadStatus((prev) => ({ ...prev, [fileKey]: "uploading" }));

        try {
          const uploadedMedia = await uploadSingleFileWithProgress(
            file,
            (progress) => {
              setUploadProgress((prev) => ({ ...prev, [fileKey]: progress }));
            },
          );

          if (uploadedMedia.id) {
            uploadedIds.push(uploadedMedia.id);
            setUploadStatus((prev) => ({ ...prev, [fileKey]: "success" }));
            setUploadProgress((prev) => ({ ...prev, [fileKey]: 100 }));
          } else {
            throw new Error("No media ID returned from upload");
          }
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          setUploadStatus((prev) => ({ ...prev, [fileKey]: "error" }));
          throw error; // Stop uploading if one file fails
        }
      }

      return uploadedIds;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const numberValue = Number(number);
    if (!number || isNaN(numberValue) || numberValue < 1) {
      toast.error(
        t("segments.errors.numberRequired", "series") ||
          "Segment number is required and must be at least 1",
      );
      return;
    }

    if (subNumber && (isNaN(Number(subNumber)) || Number(subNumber) < 0)) {
      toast.error("Sub number must be a non-negative integer");
      return;
    }

    try {
      // Upload media files one by one with progress tracking
      let attachments: Record<string,unknown>[] = [];
      if (mediaFiles.length > 0) {
        try {
          const uploadedIds = await uploadFilesSequentially();
          attachments = uploadedIds.map((id) => ({ id }));
        } catch (mediaError) {
          console.error("Error uploading media:", mediaError);
          toast.error("Failed to upload media files. Please try again.");
          return;
        }
      }

      // Prepare segment data according to CreateSegmentDto
      // Note: seriesId is passed via URL param in API call, but can also be in body
      // Note: userId is optional and will be set automatically from authenticated user
      const segmentData = {
        type,
        number: numberValue,
        subNumber:
          subNumber && Number(subNumber) > 0 ? Number(subNumber) : undefined,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        summary: summary.trim() || undefined,
        slug: slug.trim() || undefined,
        status: status || undefined,
        accessType: accessType || undefined,
        languageCode: languageCode || undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        originalReleaseDate: originalReleaseDate
          ? new Date(originalReleaseDate)
          : undefined,
        durationSec:
          durationSec && Number(durationSec) > 0
            ? Number(durationSec)
            : undefined,
        pageCount:
          pageCount && Number(pageCount) > 0 ? Number(pageCount) : undefined,
        startPage:
          startPage && Number(startPage) >= 0 ? Number(startPage) : undefined,
        endPage:
          endPage && Number(endPage) >= 0 ? Number(endPage) : undefined,
        isNsfw: isNsfw || false,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      createSegment(
        { seriesId: seriesId as string, data: segmentData },
        {
          onSuccess: (result) => {
            // Redirect to series page
            router.push(`/series/${seriesId}/segments/${result.id}`);
          },
        },
      );
    } catch (error) {
      console.error("Error uploading segment:", error);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug && value) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AnimatedSection
          loading={isLoadingSeries}
          data={backendSeries}
          className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
        >
          <Skeletonize loading={isLoadingSeries}>
            {backendSeries && (
              <>
                {/* Back Link */}
                <div className="mb-4 sm:mb-6">
                  <Link
                    href={`/series/${seriesId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("segments.title", "series")}
                  </Link>
                </div>

                {/* Series Info Card */}
                <Card className="mb-4 sm:mb-6">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg md:text-xl">
                      {t("segments.description", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("segments.title", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Cover Image */}
                      {seriesDisplay?.coverUrl && (
                        <div className="relative w-full sm:w-32 md:w-40 flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden border border-border shadow-sm">
                          <Image
                            src={seriesDisplay.coverUrl}
                            alt={seriesDisplay.title || "Series cover"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 160px"
                          />
                        </div>
                      )}

                      {/* Series Info */}
                      <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words">
                            {seriesDisplay?.title || backendSeries?.id || seriesId}
                          </h2>
                          {backendSeries?.title && (
                            <div className="mt-1 space-y-1">
                              {backendSeries.title.romaji &&
                                backendSeries.title.romaji !==
                                  seriesDisplay?.title && (
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    <span className="font-medium">Romaji:</span>{" "}
                                    {backendSeries.title.romaji}
                                  </p>
                                )}
                              {backendSeries.title.english &&
                                backendSeries.title.english !==
                                  seriesDisplay?.title && (
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    <span className="font-medium">English:</span>{" "}
                                    {backendSeries.title.english}
                                  </p>
                                )}
                            </div>
                          )}
                        </div>

                        {/* Type and Format Badges */}
                        <div className="flex flex-wrap gap-2">
                          {backendSeries?.type && (
                            <Badge variant="secondary" className="text-xs">
                              {backendSeries.type === SERIES_CONSTANTS.TYPE.ANIME
                                ? t("type.anime", "series")
                                : backendSeries.type === SERIES_CONSTANTS.TYPE.MANGA
                                  ? t("type.manga", "series")
                                  : backendSeries.type}
                            </Badge>
                          )}
                          {backendSeries?.format && (
                            <Badge variant="outline" className="text-xs">
                              {backendSeries.format}
                            </Badge>
                          )}
                          {backendSeries?.isNsfw && (
                            <Badge variant="destructive" className="text-xs">
                              NSFW
                            </Badge>
                          )}
                        </div>

                        {/* Description Preview */}
                        {seriesDisplay?.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                            {seriesDisplay.description}
                          </p>
                        )}

                        {/* View Series Link */}
                        <div className="pt-2">
                          <Link href={`/series/${seriesId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t("actions.read", "series")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Card 1: Upload Files */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        {t("segments.form.mediaFiles", "series")}
                      </CardTitle>
                      <CardDescription>
                        Upload images, videos, or documents to attach to this segment. You can select multiple files at once or add more files later.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="space-y-3">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.epub"
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);
                            // Append new files to existing ones (avoid duplicates by name+size)
                            setMediaFiles((prev) => {
                              const existing = new Set(
                                prev.map((f) => `${f.name}-${f.size}`),
                              );
                              const uniqueNew = newFiles.filter(
                                (f) => !existing.has(`${f.name}-${f.size}`),
                              );
                              return [...prev, ...uniqueNew];
                            });
                            // Reset input to allow selecting same files again
                            e.target.value = "";
                          }}
                          className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                        />
                          {mediaFiles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-foreground">
                                {mediaFiles.length} file(s) selected:
                              </p>
                              <div className="space-y-1.5 max-h-96 overflow-y-auto border border-border rounded-md p-2 bg-muted/30">
                                {mediaFiles.map((file, index) => {
                                  const isImage = file.type.startsWith("image/");
                                  // Use stable key based on file properties, not index
                                  const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
                                  const previewUrl = isImage
                                    ? URL.createObjectURL(file)
                                    : null;

                                  return (
                                    <div
                                      key={fileKey}
                                      className="flex items-start gap-3 p-2 rounded-md bg-background border border-border hover:bg-muted/50 transition-colors"
                                    >
                                      {/* Image Preview Thumbnail */}
                                      {isImage && previewUrl && (
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                                          <Image
                                            src={previewUrl}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                            unoptimized
                                          />
                                        </div>
                                      )}

                                      {/* File Info */}
                                      <div className="flex-1 min-w-0 space-y-1.5">
                                        <div>
                                          <p className="text-xs font-medium text-foreground truncate">
                                            {file.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                            {file.type && ` • ${file.type.split("/")[0]}`}
                                          </p>
                                        </div>
                                        
                                        {/* Upload Progress Bar */}
                                        {isUploading && uploadStatus[fileKey] && (
                                          <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                              <span className="text-muted-foreground">
                                                {uploadStatus[fileKey] === "pending" && "Waiting..."}
                                                {uploadStatus[fileKey] === "uploading" && `Uploading... ${uploadProgress[fileKey] || 0}%`}
                                                {uploadStatus[fileKey] === "success" && "Uploaded ✓"}
                                                {uploadStatus[fileKey] === "error" && "Upload failed ✗"}
                                              </span>
                                              {uploadStatus[fileKey] === "uploading" && (
                                                <span className="text-muted-foreground">
                                                  {uploadProgress[fileKey] || 0}%
                                                </span>
                                              )}
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                              <div
                                                className={`h-full transition-all duration-300 ${
                                                  uploadStatus[fileKey] === "success"
                                                    ? "bg-green-500"
                                                    : uploadStatus[fileKey] === "error"
                                                      ? "bg-red-500"
                                                      : "bg-primary"
                                                }`}
                                                style={{
                                                  width: `${uploadProgress[fileKey] || 0}%`,
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        {/* Move Up Button */}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => {
                                            if (index > 0) {
                                              setMediaFiles((prev) => {
                                                const newFiles = [...prev];
                                                [newFiles[index - 1], newFiles[index]] = [
                                                  newFiles[index],
                                                  newFiles[index - 1],
                                                ];
                                                return newFiles;
                                              });
                                            }
                                          }}
                                          disabled={index === 0}
                                          aria-label="Move up"
                                          title="Move up"
                                        >
                                          <ChevronUp className="h-4 w-4" />
                                        </Button>

                                        {/* Move Down Button */}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => {
                                            if (index < mediaFiles.length - 1) {
                                              setMediaFiles((prev) => {
                                                const newFiles = [...prev];
                                                [newFiles[index], newFiles[index + 1]] = [
                                                  newFiles[index + 1],
                                                  newFiles[index],
                                                ];
                                                return newFiles;
                                              });
                                            }
                                          }}
                                          disabled={index === mediaFiles.length - 1}
                                          aria-label="Move down"
                                          title="Move down"
                                        >
                                          <ChevronDown className="h-4 w-4" />
                                        </Button>

                                        {/* Remove Button */}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => {
                                            if (previewUrl) {
                                              URL.revokeObjectURL(previewUrl);
                                            }
                                            setMediaFiles((prev) =>
                                              prev.filter((_, i) => i !== index),
                                            );
                                          }}
                                          aria-label="Remove"
                                          title="Remove"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setMediaFiles([])}
                                className="w-full sm:w-auto"
                              >
                                <X className="h-4 w-4 mr-2" />
                                {t("segments.form.clearAll", "series")}
                              </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: Basic Information (Type, Number, Sub Number) */}
                  <Card>
                    <CardHeader>
                          <CardTitle className="text-base sm:text-lg">
                            {t("segments.form.basicInfo", "series")}
                          </CardTitle>
                          <CardDescription>
                            {t("segments.form.basicInfoDescription", "series")}
                          </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      {/* Segment Type */}
                      <div>
                        <Label htmlFor="type" className="text-sm font-medium">
                          {t("segments.form.type", "series")} *
                        </Label>
                        <select
                          id="type"
                          value={type}
                          onChange={(e) =>
                            setType(
                              e.target.value as "trailer" | "episode" | "chapter",
                            )
                          }
                          className="mt-1.5 w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm"
                          required
                        >
                          <option value="chapter">
                            {t("segments.type.chapter", "series")}
                          </option>
                          <option value="episode">
                            {t("segments.type.episode", "series")}
                          </option>
                          <option value="trailer">
                            {t("segments.type.trailer", "series")}
                          </option>
                        </select>
                      </div>

                      {/* Number and Sub Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="number" className="text-sm font-medium">
                            {t("segments.form.number", "series")} *
                          </Label>
                          <Input
                            id="number"
                            type="number"
                            min="1"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder={t(
                              "segments.form.numberPlaceholder",
                              "series",
                            )}
                            className="mt-1.5"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="subNumber"
                            className="text-sm font-medium"
                          >
                            {t("segments.form.subNumber", "series")}
                          </Label>
                          <Input
                            id="subNumber"
                            type="number"
                            min="0"
                            value={subNumber}
                            onChange={(e) => setSubNumber(e.target.value)}
                            placeholder={t(
                              "segments.form.subNumberPlaceholder",
                              "series",
                            )}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Advanced Settings */}
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg">
                            {t("segments.form.advancedSettings", "series")}
                          </CardTitle>
                          <CardDescription>
                            {t("segments.form.advancedSettingsDescription", "series")}
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}
                          className="w-full sm:w-auto"
                        >
                          {isAdvancedSettingsOpen
                            ? t("segments.form.hideAdvancedSettings", "series")
                            : t("segments.form.showAdvancedSettings", "series")}
                        </Button>
                      </div>
                    </CardHeader>
                    {isAdvancedSettingsOpen && (
                      <CardContent className="space-y-4 sm:space-y-6">
                      {/* Title */}
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                          {t("segments.form.title", "series")}
                        </Label>
                        <Input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder={t(
                            "segments.form.titlePlaceholder",
                            "series",
                          )}
                          className="mt-1.5"
                          maxLength={255}
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <Label htmlFor="slug" className="text-sm font-medium">
                          {t("segments.form.slug", "series")}
                        </Label>
                        <Input
                          id="slug"
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder={t(
                            "segments.form.slugPlaceholder",
                            "series",
                          )}
                          className="mt-1.5"
                        />
                      </div>

                      {/* Summary */}
                      <div>
                        <Label htmlFor="summary" className="text-sm font-medium">
                          {t("segments.form.summary", "series")}
                        </Label>
                        <textarea
                          id="summary"
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          placeholder={t(
                            "segments.form.summaryPlaceholder",
                            "series",
                          )}
                          className="mt-1.5 w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm resize-y"
                          maxLength={1000}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          {t("segments.form.description", "series")}
                        </Label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder={t(
                            "segments.form.descriptionPlaceholder",
                            "series",
                          )}
                          className="mt-1.5 w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm resize-y"
                          maxLength={10000}
                        />
                      </div>

                      {/* Status and Access Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status" className="text-sm font-medium">
                            {t("segments.form.status", "series")}
                          </Label>
                          <select
                            id="status"
                            value={status}
                            onChange={(e) =>
                              setStatus(
                                e.target.value as
                                  | "active"
                                  | "inactive"
                                  | "pending"
                                  | "archived",
                              )
                            }
                            className="mt-1.5 w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm"
                          >
                            <option value="pending">
                              {t("segments.status.pending", "series")}
                            </option>
                            <option value="active">
                              {t("segments.status.active", "series")}
                            </option>
                            <option value="inactive">
                              {t("segments.status.inactive", "series")}
                            </option>
                            <option value="archived">
                              {t("segments.status.archived", "series")}
                            </option>
                          </select>
                        </div>
                        <div>
                          <Label
                            htmlFor="accessType"
                            className="text-sm font-medium"
                          >
                            {t("segments.form.accessType", "series")}
                          </Label>
                          <select
                            id="accessType"
                            value={accessType}
                            onChange={(e) =>
                              setAccessType(
                                e.target.value as
                                  | "free"
                                  | "paid"
                                  | "subscription"
                                  | "membership",
                              )
                            }
                            className="mt-1.5 w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm"
                          >
                            <option value="free">
                              {t("segments.accessType.free", "series")}
                            </option>
                            <option value="paid">
                              {t("segments.accessType.paid", "series")}
                            </option>
                            <option value="subscription">
                              {t("segments.accessType.subscription", "series")}
                            </option>
                            <option value="membership">
                              {t("segments.accessType.membership", "series")}
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Language Code */}
                      <div>
                        <Label
                          htmlFor="languageCode"
                          className="text-sm font-medium"
                        >
                          {t("segments.form.languageCode", "series")}
                        </Label>
                        <select
                          id="languageCode"
                          value={languageCode}
                          onChange={(e) => setLanguageCode(e.target.value)}
                          className="mt-1.5 w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm"
                        >
                          <option value="en">English</option>
                          <option value="vi">Tiếng Việt</option>
                          <option value="ja">日本語</option>
                          <option value="zh">中文</option>
                          <option value="ko">한국어</option>
                        </select>
                      </div>

                      {/* Type-specific fields */}
                      {type === "episode" && (
                        <div>
                          <Label
                            htmlFor="durationSec"
                            className="text-sm font-medium"
                          >
                            {t("segments.form.durationSec", "series")}
                          </Label>
                          <Input
                            id="durationSec"
                            type="number"
                            min="0"
                            value={durationSec}
                            onChange={(e) => setDurationSec(e.target.value)}
                            placeholder={t(
                              "segments.form.durationSecPlaceholder",
                              "series",
                            )}
                            className="mt-1.5"
                          />
                        </div>
                      )}

                      {type === "chapter" && (
                        <>
                          <div>
                            <Label
                              htmlFor="pageCount"
                              className="text-sm font-medium"
                            >
                              {t("segments.form.pageCount", "series")}
                            </Label>
                            <Input
                              id="pageCount"
                              type="number"
                              min="0"
                              value={pageCount}
                              onChange={(e) => setPageCount(e.target.value)}
                              placeholder={t(
                                "segments.form.pageCountPlaceholder",
                                "series",
                              )}
                              className="mt-1.5"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="startPage"
                                className="text-sm font-medium"
                              >
                                {t("segments.form.startPage", "series")}
                              </Label>
                              <Input
                                id="startPage"
                                type="number"
                                min="0"
                                value={startPage}
                                onChange={(e) => setStartPage(e.target.value)}
                                placeholder={t(
                                  "segments.form.startPagePlaceholder",
                                  "series",
                                )}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="endPage"
                                className="text-sm font-medium"
                              >
                                {t("segments.form.endPage", "series")}
                              </Label>
                              <Input
                                id="endPage"
                                type="number"
                                min="0"
                                value={endPage}
                                onChange={(e) => setEndPage(e.target.value)}
                                placeholder={t(
                                  "segments.form.endPagePlaceholder",
                                  "series",
                                )}
                                className="mt-1.5"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="publishedAt"
                            className="text-sm font-medium"
                          >
                            {t("segments.form.publishedAt", "series")}
                          </Label>
                          <Input
                            id="publishedAt"
                            type="datetime-local"
                            value={publishedAt}
                            onChange={(e) => setPublishedAt(e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="originalReleaseDate"
                            className="text-sm font-medium"
                          >
                            {t("segments.form.originalReleaseDate", "series")}
                          </Label>
                          <Input
                            id="originalReleaseDate"
                            type="datetime-local"
                            value={originalReleaseDate}
                            onChange={(e) =>
                              setOriginalReleaseDate(e.target.value)
                            }
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      {/* NSFW Toggle */}
                      <div className="flex items-center gap-2">
                        <input
                          id="isNsfw"
                          type="checkbox"
                          checked={isNsfw}
                          onChange={(e) => setIsNsfw(e.target.checked)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                        />
                        <Label
                          htmlFor="isNsfw"
                          className="text-sm font-medium cursor-pointer"
                        >
                          {t("segments.form.isNsfw", "series")}
                        </Label>
                      </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/series/${seriesId}`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                          disabled={isSubmitting || isUploading || !number}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isSubmitting
                        ? t("segments.form.uploadingSegment", "series")
                        : t("segments.form.uploadSegment", "series")}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Skeletonize>
        </AnimatedSection>
      </div>
    </ProtectedRoute>
  );
}

