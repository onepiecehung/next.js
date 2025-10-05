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

/**
 * Internationalized Write Page Component
 * Allows authenticated users to write and publish articles
 * Uses custom i18n hook for multi-language support
 */
export default function WritePage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  
  // Use article form hook
  const {
    coverImage,
    setCoverImage,
    title,
    setTitle,
    content,
    setContent,
    summary,
    setSummary,
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
    onSuccess: () => {
      toast.success(t("writeFormSuccess", "write") || "Article created successfully!");
      resetForm();
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
        if (uploaded[0]) {
          coverImageId = uploaded[0].id;
          coverImageUrl = uploaded[0].url;
        }
      }
      await createDraft({
        title,
        content,
        summary: summary || undefined,
        contentFormat: 'html',
        visibility,
        tags: tags.length > 0 ? tags : undefined,
        wordCount,
        readTimeMinutes,
        coverImageId,
        coverImageUrl,
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
        summary: summary || undefined,
        contentFormat: 'html',
        visibility,
        tags: tags.length > 0 ? tags : undefined,
        wordCount,
        readTimeMinutes,
        coverImageId,
        coverImageUrl,
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
                      acceptedTypes={["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]}
                      enableCrop={true}
                      aspectRatio={16/9}
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-base sm:text-lg"
                    />
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
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : t("writeFormSaveDraft", "write")}
                    </Button>
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto"
                      onClick={handlePublishArticle}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publishing..." : t("writeFormPublishArticle", "write")}
                    </Button>
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
