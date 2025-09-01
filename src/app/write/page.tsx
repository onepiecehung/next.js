"use client";

import { useAtom } from "jotai";
import { currentUserAtom, authLoadingAtom } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, TipTapEditor } from "@/components/ui";
import Link from "next/link";
import { Skeletonize } from "@/components/skeletonize";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Internationalized Write Page Component
 * Allows authenticated users to write and publish articles
 * Uses custom i18n hook for multi-language support
 */
export default function WritePage() {
  const { t } = useI18n();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect to home if user is not authenticated and auth is not loading
    if (!user && !authLoading) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // Show loading or redirect if not authenticated
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("write.accessDenied", "write")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("write.loginRequired", "write")}
          </p>
          <Link href="/">
            <Button>{t("write.goToHome", "write")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeletonize loading={isLoading}>
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {t("write.title", "write")}
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("write.form.title", "write")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("write.form.titlePlaceholder", "write")}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
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
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline">
                  {t("write.form.saveDraft", "write")}
                </Button>
                <Button>{t("write.form.publishArticle", "write")}</Button>
              </div>
            </div>
          </div>
        </Skeletonize>
      </div>
    </div>
  );
}
