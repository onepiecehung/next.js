"use client";

import { useAtom } from "jotai";
import {
  ChevronDown,
  CircleChevronDown,
  CircleChevronUp,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/features/auth";
import { TipTapEditor } from "@/components/features/text-editor";
import { ScheduledPublishDialog } from "@/components/features/write";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button, ButtonGroup, ImageUpload } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import {
  useArticleForm,
  useCreateArticle,
} from "@/hooks/article/useArticleQuery";
import { MediaAPI } from "@/lib/api/media";
import { currentUserAtom } from "@/lib/auth";
import { ARTICLE_CONSTANTS } from "@/lib/constants";

/**
 * Internationalized Write Page Component
 * Allows authenticated users to write and publish articles
 * Uses custom i18n hook for multi-language support
 */
export default function WritePage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [currentUser] = useAtom(currentUserAtom);
  const router = useRouter();

  // Use article form hook
  const {
    coverImage,
    setCoverImage,
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    visibility,
    setVisibility,
    scheduledPublish,
    setScheduledPublish,
    validateForm,
    resetForm,
    showValidationErrors,
    wordCount,
    readTimeMinutes,
  } = useArticleForm();

  // Use create article hook
  const { saveArticle, isLoading: isSubmitting } = useCreateArticle({
    onSuccess: (article) => {
      switch (article.status) {
        case ARTICLE_CONSTANTS.STATUS.DRAFT:
          toast.info(
            t("writeFormDraftSuccess", "write") ||
              "Article created successfully!",
            {
              description:
                t("writeFormDraftSuccess", "write") ||
                "Article created successfully!",
            },
          );
          break;
        case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
          toast.success(
            t("writeFormScheduledPublishSuccess", "write") ||
              "Article scheduled for publication!",
            {
              description: t(
                "writeFormScheduledPublishSuccessDescription",
                "write",
                {
                  date: article.scheduledAt?.toLocaleString(),
                },
              ),
            },
          );
          break;

        default:
          toast.success(
            t("writeFormSuccess", "write") || "Article created successfully!",
          );
          break;
      }
      resetForm();

      // Redirect to article view page with a small delay to ensure cleanup
      return router.push(`/article/${article.id}/${article.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create article");
    },
  });

  // Simulate loading delay
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to prepare article data with cover image upload
  const prepareArticleData = async () => {
    let coverImageId: string | undefined = undefined;
    let coverImageUrl: string | undefined = undefined;

    // Upload cover image first if exists
    if (coverImage) {
      const uploaded = await MediaAPI.upload([coverImage]);
      if (uploaded.data[0]) {
        coverImageId = uploaded.data[0].id;
        coverImageUrl = uploaded.data[0].url;
      }
    }

    return {
      title,
      content,
      contentFormat: "html" as const,
      visibility,
      tags: tags.length > 0 ? tags : undefined,
      wordCount,
      readTimeMinutes,
      coverImageId,
      coverImageUrl,
      userId: currentUser?.id,
    };
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      showValidationErrors(errors);
      return;
    }

    try {
      const articleData = await prepareArticleData();
      await saveArticle({
        ...articleData,
        status: ARTICLE_CONSTANTS.STATUS.DRAFT,
      });
    } catch {
      // Error handled by hook
    }
  };

  // Handle publish article (immediate or scheduled)
  const handlePublishArticle = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      showValidationErrors(errors);
      return;
    }

    try {
      const articleData = await prepareArticleData();
      await saveArticle({
        ...articleData,
        status: scheduledPublish
          ? ARTICLE_CONSTANTS.STATUS.SCHEDULED
          : ARTICLE_CONSTANTS.STATUS.PUBLISHED,
        scheduledAt: scheduledPublish ?? undefined,
        visibility: scheduledPublish
          ? ARTICLE_CONSTANTS.VISIBILITY.PRIVATE
          : visibility,
      });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        {/* Main Container - Optimized for mobile scrolling */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 max-w-5xl">
          <Skeletonize loading={isLoading}>
            <div className="space-y-4 md:space-y-6">
              {/* Header - Compact on mobile */}
              <div className="space-y-1 md:space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {t("writeTitle", "write")}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-2 md:line-clamp-none">
                  Create and publish your articles with our modern rich text
                  editor
                </p>
              </div>

              {/* Main Content Card - Reduced padding on mobile */}
              <div className="bg-card rounded-lg shadow-sm border border-border p-3 sm:p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {/* Cover Image Upload - Touch-friendly */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      {t("writeFormCoverImage", "write")}
                    </label>
                    <p className="text-xs text-muted-foreground mb-2 sm:mb-3 hidden sm:block">
                      {t("writeFormCoverImageDescription", "write")}
                    </p>
                    <ImageUpload
                      value={coverImage}
                      onChange={setCoverImage}
                      placeholder={t("writeFormCoverImagePlaceholder", "write")}
                      maxSizeInMB={10}
                      acceptedTypes={[
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                      ]}
                      enableCrop={true}
                      aspectRatio={16 / 9}
                    />
                  </div>

                  {/* Title Input - Larger touch target on mobile */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      {t("writeFormTitle", "write")}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("writeFormTitlePlaceholder", "write")}
                      maxLength={256}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-base sm:text-lg transition-shadow"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {title.length}/256 characters
                    </p>
                  </div>

                  {/* Content Editor - Responsive min-height */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      {t("writeFormContent", "write")}
                    </label>
                    <TipTapEditor
                      content={content}
                      onChange={setContent}
                      placeholder={t("writeFormContentPlaceholder", "write")}
                      className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
                    />
                    <div className="flex justify-between items-center mt-1.5 sm:mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">{wordCount} words</span>
                      <span>{readTimeMinutes} min read</span>
                    </div>
                  </div>

                  {/* Tags Input - Better mobile UX */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      {t("writeFormTags", "write")}
                    </label>
                    <input
                      type="text"
                      value={tags.join(", ")}
                      onChange={(e) => {
                        const tagList = e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag.length > 0);
                        setTags(tagList.slice(0, 20)); // Limit to 20 tags
                      }}
                      placeholder={t("writeFormTagsPlaceholder", "write")}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm sm:text-base transition-shadow"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {tags.length}/20 tags (separate with commas)
                    </p>
                  </div>

                  {/* Visibility & Actions - Mobile optimized layout */}
                  <div className="flex flex-col gap-3 pt-4 sm:pt-6 border-t border-border">
                    {/* Visibility Dropdown - Hidden on mobile, shown in sticky bar */}
                    <div className="hidden md:flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("writeFormVisibility", "write")}:
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9"
                          >
                            {visibility === "public" &&
                              t("writeFormVisibilityPublic", "write")}
                            {visibility === "unlisted" &&
                              t("writeFormVisibilityUnlisted", "write")}
                            {visibility === "private" &&
                              t("writeFormVisibilityPrivate", "write")}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() => setVisibility("public")}
                            className={
                              visibility === "public" ? "bg-accent" : ""
                            }
                          >
                            {t("writeFormVisibilityPublic", "write")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setVisibility("unlisted")}
                            className={
                              visibility === "unlisted" ? "bg-accent" : ""
                            }
                          >
                            {t("writeFormVisibilityUnlisted", "write")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setVisibility("private")}
                            className={
                              visibility === "private" ? "bg-accent" : ""
                            }
                          >
                            {t("writeFormVisibilityPrivate", "write")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Desktop Action Buttons - Hidden on mobile */}
                    <div className="hidden md:flex flex-row gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Saving..."
                          : t("writeFormSaveDraft", "write")}
                      </Button>

                      <ButtonGroup>
                        {/* Publish Button */}
                        <Button
                          variant={
                            visibility === "public" ? "default" : "outline"
                          }
                          size="default"
                          onClick={handlePublishArticle}
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Publishing..."
                            : t("writeFormPublishArticle", "write")}
                        </Button>

                        {/* Schedule Publish Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="default"
                              className="px-2"
                              disabled={isSubmitting}
                            >
                              {isScheduleDialogOpen ? (
                                <CircleChevronUp className="h-4 w-4" />
                              ) : (
                                <CircleChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-41">
                            <DropdownMenuItem
                              onClick={() => setIsScheduleDialogOpen(true)}
                              className="gap-2"
                            >
                              <Clock className="h-4 w-4" />
                              {t("writeFormSchedulePublish", "write")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Skeletonize>
        </div>

        {/* Mobile Sticky Action Bar - Only visible on mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border shadow-lg">
          <div className="container mx-auto px-3 py-3">
            <div className="flex flex-col gap-2">
              {/* Visibility Selector - Mobile */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t("writeFormVisibility", "write")}:
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs"
                    >
                      {visibility === "public" &&
                        t("writeFormVisibilityPublic", "write")}
                      {visibility === "unlisted" &&
                        t("writeFormVisibilityUnlisted", "write")}
                      {visibility === "private" &&
                        t("writeFormVisibilityPrivate", "write")}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setVisibility("public")}
                      className={visibility === "public" ? "bg-accent" : ""}
                    >
                      {t("writeFormVisibilityPublic", "write")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setVisibility("unlisted")}
                      className={visibility === "unlisted" ? "bg-accent" : ""}
                    >
                      {t("writeFormVisibilityUnlisted", "write")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setVisibility("private")}
                      className={visibility === "private" ? "bg-accent" : ""}
                    >
                      {t("writeFormVisibilityPrivate", "write")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  className="flex-1 h-11 font-medium"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : t("writeFormSaveDraft", "write")}
                </Button>

                <Button
                  variant={visibility === "public" ? "default" : "outline"}
                  size="default"
                  className="flex-1 h-11 font-medium"
                  onClick={handlePublishArticle}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Publishing..."
                    : t("writeFormPublishArticle", "write")}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="default"
                      className="h-11 px-3"
                      disabled={isSubmitting}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => setIsScheduleDialogOpen(true)}
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      {t("writeFormSchedulePublish", "write")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Publish Dialog - Shared between mobile and desktop */}
        <ScheduledPublishDialog
          scheduledPublish={scheduledPublish}
          setScheduledPublish={setScheduledPublish}
          onSchedule={handlePublishArticle}
          isSubmitting={isSubmitting}
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
        />
      </div>
    </ProtectedRoute>
  );
}
