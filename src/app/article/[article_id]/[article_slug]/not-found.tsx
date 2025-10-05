"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useI18n } from "@/components/providers/i18n-provider";
import { FileText, Home } from "lucide-react";

/**
 * Article Not Found Page
 * Displayed when an article cannot be found
 */
export default function ArticleNotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t("articleViewNotFound", "article")}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          The article you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              {t("articleViewBackToHome", "article")}
            </Button>
          </Link>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
