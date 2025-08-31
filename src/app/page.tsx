"use client";

import { Button } from "@/components/ui";
import Link from "next/link";
import { BookOpen, PenTool, User, Sparkles } from "lucide-react";
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
              {t("home.hero.title", "home")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t("home.hero.description", "home")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/profile">
              <Button size="lg" className="px-8">
                <User className="mr-2 h-5 w-5" />
                {t("home.hero.viewProfile", "home")}
              </Button>
            </Link>
            <Link href="/write">
              <Button variant="outline" size="lg" className="px-8">
                <PenTool className="mr-2 h-5 w-5" />
                {t("home.hero.startWriting", "home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("home.features.title", "home")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("home.features.subtitle", "home")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Write */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t("home.features.write.title", "home")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("home.features.write.description", "home")}
            </p>
            <Link href="/write">
              <Button variant="outline" size="sm">
                {t("home.features.write.button", "home")}
              </Button>
            </Link>
          </div>

          {/* Feature 2: Profile */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t("home.features.profile.title", "home")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("home.features.profile.description", "home")}
            </p>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                {t("home.features.profile.button", "home")}
              </Button>
            </Link>
          </div>

          {/* Feature 3: Discover */}
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t("home.features.discover.title", "home")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("home.features.discover.description", "home")}
            </p>
            <Link href="/demo">
              <Button variant="outline" size="sm">
                {t("home.features.discover.button", "home")}
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
              {t("home.cta.title", "home")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.cta.subtitle", "home")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/profile">
              <Button size="lg" className="px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                {t("home.cta.getStarted", "home")}
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8">
                {t("home.cta.learnMore", "home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
