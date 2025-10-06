"use client";

import React, { useState } from "react";
import { Button, ImageUpload } from "@/components/ui";
import { TipTapEditor } from "@/components/features/text-editor";
import { Skeletonize } from "@/components/shared";
import { useI18n } from "@/components/providers/i18n-provider";
import { ProtectedRoute } from "@/components/features/auth";
import { useCreateArticle } from "@/hooks/useCreateArticle";
import { useArticleForm } from "@/hooks/useArticleForm";
import { toast } from "sonner";
import { MediaAPI } from "@/lib/api/media";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/lib/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Internationalized Write Page Component
 * Allows authenticated users to write and publish articles
 * Uses custom i18n hook for multi-language support
 */
export default function WritePage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
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
    validateForm,
    resetForm,
    showValidationErrors,
    wordCount,
    readTimeMinutes,
  } = useArticleForm();

  // Use create article hook
  const {
    createDraft,
    publishArticle,
    isLoading: isSubmitting,
  } = useCreateArticle({
    onSuccess: (article) => {
      toast.success(
        t("writeFormSuccess", "write") || "Article created successfully!"
      );
      resetForm();
      router.prefetch(`/article/${article.id}/${article.slug}`);
      // Redirect to article view page
      router.push(`/article/${article.id}/${article.slug}`);
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

  // Handle save draft
  const handleSaveDraft = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      showValidationErrors(errors);
      return;
    }

    try {
      // Upload cover image first if exists
      let coverImageId: string | undefined = undefined;
      let coverImageUrl: string | undefined = undefined;
      if (coverImage) {
        const uploaded = await MediaAPI.upload([coverImage]);
        console.log(uploaded);
        if (uploaded[0]) {
          coverImageId = uploaded[0].id;
          coverImageUrl = uploaded[0].url;
        }
      }
      await createDraft({
        title,
        content,
        contentFormat: "html",
        visibility,
        tags: tags.length > 0 ? tags : undefined,
        wordCount,
        readTimeMinutes,
        coverImageId,
        coverImageUrl,
        userId: currentUser?.id,
      });
    } catch {
      // Error handled by hook
    }
  };

  // Handle publish article
  const handlePublishArticle = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      showValidationErrors(errors);
      return;
    }

    try {
      // Upload cover image first if exists
      let coverImageId: string | undefined = undefined;
      let coverImageUrl: string | undefined = undefined;
      if (coverImage) {
        const uploaded = await MediaAPI.upload([coverImage]);
        if (uploaded[0]) {
          coverImageId = uploaded[0].id;
          coverImageUrl = uploaded[0].url;
        }
      }
      await publishArticle({
        title,
        content,
        contentFormat: "html",
        visibility,
        tags: tags.length > 0 ? tags : undefined,
        wordCount,
        readTimeMinutes,
        coverImageId,
        coverImageUrl,
        userId: currentUser?.id,
      });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <Skeletonize loading={isLoading}>
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {t("writeTitle", "write")}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create and publish your articles with our modern rich text
                  editor
                </p>
              </div>

              {/* Main Content */}
              <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("writeFormCoverImage", "write")}
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
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

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("writeFormTitle", "write")}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("writeFormTitlePlaceholder", "write")}
                      maxLength={256}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-base sm:text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {title.length}/256 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("writeFormContent", "write")}
                    </label>
                    <TipTapEditor
                      content={content}
                      onChange={setContent}
                      placeholder={t("writeFormContentPlaceholder", "write")}
                      className="min-h-[400px] sm:min-h-[600px]"
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{wordCount} words</span>
                      <span>{readTimeMinutes} min read</span>
                    </div>
                  </div>

                  {/* Tags Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-sm sm:text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {tags.length}/20 tags (separate with commas)
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-6 border-t border-border">
                    {/* Visibility Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("writeFormVisibility", "write")}:
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Saving..."
                          : t("writeFormSaveDraft", "write")}
                      </Button>
                      <Button
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={handlePublishArticle}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Publishing..."
                          : t("writeFormPublishArticle", "write")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Skeletonize>
        </div>
      </div>
    </ProtectedRoute>
  );
}
