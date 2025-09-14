"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, ArrowLeft, Search, RefreshCw } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * 404 Not Found Page Component
 * Displays when a page is not found
 * Includes navigation options and helpful suggestions
 */
export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-8xl sm:text-9xl font-bold text-primary/20 select-none">
              404
            </h1>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-primary/30 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-chart-2/40 rounded-full animate-pulse delay-100"></div>
            <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-chart-3/50 rounded-full animate-pulse delay-200"></div>
            <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-chart-1/30 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            {t("notFoundTitle", "common") || "Oops! Page not found"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t("notFoundDescription", "common") ||
              "The page you're looking for doesn't exist or has been moved. Don't worry, it happens to the best of us!"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8">
              <Home className="mr-2 h-5 w-5" />
              {t("notFoundGoHome", "common") || "Go Home"}
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-6 sm:px-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t("notFoundGoBack", "common") || "Go Back"}
          </Button>
        </div>

        {/* Helpful Suggestions */}
        <div className="bg-card border border-border rounded-lg p-6 text-left">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            {t("notFoundSuggestions", "common") || "What can you do?"}
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Search className="h-3 w-3 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("notFoundSuggestion1", "common") || "Check the URL"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("notFoundSuggestion1Desc", "common") ||
                    "Make sure the web address is spelled correctly"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-chart-2/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="h-3 w-3 text-chart-2" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("notFoundSuggestion2", "common") || "Try refreshing"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("notFoundSuggestion2Desc", "common") ||
                    "Press F5 or click the refresh button"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-chart-3/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Home className="h-3 w-3 text-chart-3" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("notFoundSuggestion3", "common") || "Go to homepage"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("notFoundSuggestion3Desc", "common") ||
                    "Start fresh from our homepage"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            {t("notFoundPopularLinks", "common") || "Popular pages:"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/write"
              className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {t("writeTitle", "write") || "Write"}
            </Link>
            <Link
              href="/demo"
              className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {t("demoTitle", "demo") || "Demo"}
            </Link>
            <Link
              href="/demo/theming"
              className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {t("themingTitle", "demo") || "Theming"}
            </Link>
            <Link
              href="/demo/editor"
              className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {t("editorTitle", "demo") || "Editor"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
