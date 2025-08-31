"use client";

import { useAtom } from "jotai";
import { currentUserAtom } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  // Show loading or redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('write.accessDenied', 'write')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('write.loginRequired', 'write')}
          </p>
          <Link href="/">
            <Button>{t('write.goToHome', 'write')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeletonize loading={isLoading}>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {t('write.title', 'write')}
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('write.form.title', 'write')}
                </label>
                <input
                  type="text"
                  placeholder={t('write.form.titlePlaceholder', 'write')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('write.form.content', 'write')}
                </label>
                <textarea
                  placeholder={t('write.form.contentPlaceholder', 'write')}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline">
                  {t('write.form.saveDraft', 'write')}
                </Button>
                <Button>
                  {t('write.form.publishArticle', 'write')}
                </Button>
              </div>
            </div>
          </div>
        </Skeletonize>
      </div>
    </div>
  );
}
