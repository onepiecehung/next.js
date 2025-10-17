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
import { TagsInputComponent } from "@/components/ui/layout/tags-input";
import {
  useArticleFormState,
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

  // Use article form state hook
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
    wordCount,
    readTimeMinutes,
  } = useArticleFormState();

  // Use create article hook
  const { mutate: createArticle, isPending: isSubmitting } = useCreateArticle();

  // Handle article creation with success/error callbacks
  const handleCreateArticle = (articleData: {
    title: string;
    content: string;
    tags: string[];
    visibility: string;
    scheduledPublish?: string;
  }) => {
    const createRequest = {
      ...articleData,
      contentFormat: "html" as const,
      status: (visibility === "draft" ? "draft" : "published") as
        | "draft"
        | "published"
        | "scheduled",
      visibility: visibility as "public" | "unlisted" | "private",
    };

    createArticle(createRequest, {
      onSuccess: (article) => {
        // Reset form after successful creation
        resetForm();
        // Redirect to article view page with a small delay to ensure cleanup
        router.push(`/article/${article.id}/${article.slug}`);
      },
      // onError is now handled by the hook itself
    });
  };

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
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      const articleData = await prepareArticleData();
      handleCreateArticle({
        ...articleData,
        tags: articleData.tags || [],
        visibility: "draft",
      });
    } catch {
      // Error handled by hook
    }
  };

  // Handle publish article (immediate or scheduled)
  const handlePublishArticle = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      const articleData = await prepareArticleData();
      handleCreateArticle({
        ...articleData,
        tags: articleData.tags || [],
        visibility: scheduledPublish
          ? ARTICLE_CONSTANTS.VISIBILITY.PRIVATE
          : visibility,
        scheduledPublish: scheduledPublish?.toISOString(),
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
                  {t("title", "write")}
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
                      {t("form.coverImage", "write")}
                    </label>
                    <p className="text-xs text-muted-foreground mb-2 sm:mb-3 hidden sm:block">
                      {t("form.coverImageDescription", "write")}
                    </p>
                    <ImageUpload
                      value={coverImage}
                      onChange={setCoverImage}
                      placeholder={t("form.coverImagePlaceholder", "write")}
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
                      {t("form.title", "write")}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("form.titlePlaceholder", "write")}
                      maxLength={256}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-base sm:text-lg transition-shadow"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {(title || "").length}/256 characters
                    </p>
                  </div>

                  {/* Content Editor - Responsive min-height */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      {t("form.content", "write")}
                    </label>
                    <TipTapEditor
                      content={content}
                      onChange={setContent}
                      placeholder={t("form.contentPlaceholder", "write")}
                      className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
                    />
                    <div className="flex justify-between items-center mt-1.5 sm:mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">
                        {wordCount || 0} words
                      </span>
                      <span>{readTimeMinutes || 0} min read</span>
                    </div>
                  </div>

                  {/* Tags Input - Interactive Tags Component */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      {t("form.tags", "write")}
                    </label>
                    <TagsInputComponent
                      tags={[]} // Empty array for now - could be populated with existing tags
                      selectedTags={tags.map((tag: string) => 
                        tag.toLowerCase().replace(/\s+/g, "-")
                      )}
                      onTagsChange={(newSelectedTags) => {
                        // Convert back to original tag format
                        const tagLabels = newSelectedTags.map(tagId => 
                          tagId.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
                        );
                        setTags(tagLabels.slice(0, 20)); // Limit to 20 tags
                      }}
                      onTagCreate={(newTag) => {
                        // Add new tag to the list
                        const formattedTag = newTag.label.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
                        if (!tags.includes(formattedTag) && tags.length < 20) {
                          setTags([...tags, formattedTag]);
                        }
                      }}
                      placeholder={t("form.tagsPlaceholder", "write")}
                      allowCreate={true}
                      allowRemove={true}
                      disabled={false}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {(tags || []).length}/20 tags
                    </p>
                  </div>

                  {/* Visibility & Actions - Mobile optimized layout */}
                  <div className="flex flex-col gap-3 pt-4 sm:pt-6 border-t border-border">
                    {/* Visibility Dropdown - Hidden on mobile, shown in sticky bar */}
                    <div className="hidden md:flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("form.visibility", "write")}:
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9"
                          >
                            {visibility === "public" &&
                              t("visibility.public", "write")}
                            {visibility === "unlisted" &&
                              t("visibility.unlisted", "write")}
                            {visibility === "private" &&
                              t("visibility.private", "write")}
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
                            {t("visibility.public", "write")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setVisibility("unlisted")}
                            className={
                              visibility === "unlisted" ? "bg-accent" : ""
                            }
                          >
                            {t("visibility.unlisted", "write")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setVisibility("private")}
                            className={
                              visibility === "private" ? "bg-accent" : ""
                            }
                          >
                            {t("visibility.private", "write")}
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
                          : t("form.saveDraft", "write")}
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
                            : t("form.publishArticle", "write")}
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
                              {t("form.schedulePublish", "write")}
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
                  {t("form.visibility", "write")}:
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs"
                    >
                      {visibility === "public" &&
                        t("visibility.public", "write")}
                      {visibility === "unlisted" &&
                        t("visibility.unlisted", "write")}
                      {visibility === "private" &&
                        t("visibility.private", "write")}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setVisibility("public")}
                      className={visibility === "public" ? "bg-accent" : ""}
                    >
                      {t("visibility.public", "write")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setVisibility("unlisted")}
                      className={visibility === "unlisted" ? "bg-accent" : ""}
                    >
                      {t("visibility.unlisted", "write")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setVisibility("private")}
                      className={visibility === "private" ? "bg-accent" : ""}
                    >
                      {t("visibility.private", "write")}
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
                  {isSubmitting ? "Saving..." : t("form.saveDraft", "write")}
                </Button>

                <Button
                  variant={visibility === "public" ? "default" : "outline"}
                  size="default"
                  className="flex-1 h-11 font-medium"
                  onClick={handlePublishArticle}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("form.publishingArticle", "write")
                    : t("form.publishArticle", "write")}
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
                      {t("form.schedulePublish", "write")}
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
