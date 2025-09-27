"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { TipTapEditor } from "@/components/features/text-editor";
import { Skeletonize } from "@/components/utilities";
import { useI18n } from "@/components/providers";
import { ProtectedRoute } from "@/components/features/auth";

/**
 * Internationalized Write Page Component
 * Allows authenticated users to write and publish articles
 * Uses custom i18n hook for multi-language support
 */
export default function WritePage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Simulate loading delay
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
                    >
                      {t("writeFormSaveDraft", "write")}
                    </Button>
                    <Button size="lg" className="w-full sm:w-auto">
                      {t("writeFormPublishArticle", "write")}
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
