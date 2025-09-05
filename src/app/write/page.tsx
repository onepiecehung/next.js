"use client";

import React, { useState } from "react";
import { Button, TipTapEditor } from "@/components/ui";
import { Skeletonize } from "@/components/skeletonize";
import { useI18n } from "@/components/providers/i18n-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";

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
        <div className="container mx-auto px-6 py-8">
          <Skeletonize loading={isLoading}>
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {t("write.title", "write")}
              </h1>
              <p className="text-muted-foreground">
                Create and publish your articles with our modern rich text
                editor
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("write.form.title", "write")}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("write.form.titlePlaceholder", "write")}
                    className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("write.form.content", "write")}
                  </label>
                  <TipTapEditor
                    content={content}
                    onChange={setContent}
                    placeholder={t("write.form.contentPlaceholder", "write")}
                    className="min-h-[600px]"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                  <Button variant="outline" size="lg">
                    {t("write.form.saveDraft", "write")}
                  </Button>
                  <Button size="lg">
                    {t("write.form.publishArticle", "write")}
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
