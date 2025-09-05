"use client";

import { Button } from "@/components/ui";
import Link from "next/link";
import {
  BookOpen,
  PenTool,
  User,
  Sparkles,
  Palette,
  Edit3,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Internationalized Home Page Component
 * Welcome page with navigation to main features
 * Uses custom i18n hook for multi-language support
 */
export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              {t("heroTitle", "home")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t("heroDescription", "home")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/profile">
              <Button size="lg" className="px-8">
                <User className="mr-2 h-5 w-5" />
                {t("heroViewProfile", "home")}
              </Button>
            </Link>
            <Link href="/write">
              <Button variant="outline" size="lg" className="px-8">
                <PenTool className="mr-2 h-5 w-5" />
                {t("heroStartWriting", "home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("featuresTitle", "home")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("featuresSubtitle", "home")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1: Write */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t("writeTitle", "home")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("writeDescription", "home")}
            </p>
            <Link href="/write">
              <Button variant="outline" size="sm">
                {t("writeButton", "home")}
              </Button>
            </Link>
          </div>

          {/* Feature 2: Profile */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t("profileTitle", "home")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("profileDescription", "home")}
            </p>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                {t("profileButton", "home")}
              </Button>
            </Link>
          </div>

          {/* Feature 3: Theming */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Theming System
            </h3>
            <p className="text-muted-foreground mb-4">
              Explore multiple themes and color schemes
            </p>
            <Link href="/demo/theming">
              <Button variant="outline" size="sm">
                View Themes
              </Button>
            </Link>
          </div>

          {/* Feature 4: Rich Text Editor */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Rich Text Editor
            </h3>
            <p className="text-muted-foreground mb-4">
              Modern TipTap editor with advanced features
            </p>
            <Link href="/demo/editor">
              <Button variant="outline" size="sm">
                Try Editor
              </Button>
            </Link>
          </div>

          {/* Feature 4: Discover */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t("discoverTitle", "home")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("discoverDescription", "home")}
            </p>
            <Link href="/demo">
              <Button variant="outline" size="sm">
                {t("discoverButton", "home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("ctaTitle", "home")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("ctaSubtitle", "home")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/profile">
              <Button size="lg" className="px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                {t("ctaGetStarted", "home")}
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8">
                {t("ctaLearnMore", "home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
