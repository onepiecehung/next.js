"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui";
import { useArticle } from "@/hooks/article/useArticleQuery";
import { FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Article Redirect Page Component
 * Redirects from /article/[article_id] to /article/[article_id]/[article_slug]
 * This ensures all article URLs have proper slugs for SEO and consistency
 */
export default function ArticleRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();

  const articleId = params.article_id as string;

  // Fetch article data to get the slug
  const { data: article, isLoading, error } = useArticle(articleId);

  // Redirect to the proper URL with slug when article data is loaded
  useEffect(() => {
    if (article && !isLoading && !error) {
      // Construct the proper URL with slug
      const redirectUrl = `/article/${articleId}/${article.slug}`;

      // Use replace to avoid adding to browser history
      router.replace(redirectUrl);
    }
  }, [article, articleId, isLoading, error, router]);

  // Show loading state while fetching article data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("articleRedirectLoading", "article") || "Loading article..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("articleRedirectLoadingDesc", "article") ||
                "Redirecting to the article page..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if article not found or error occurred
  if (error || (!isLoading && !article)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground mb-2">
              {t("articleNotFound", "article") || "Article Not Found"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error?.message ||
                t("articleNotFoundDesc", "article") ||
                "The article you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  {t("articleViewBackToHome", "article") || "Back to Home"}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                {t("retry", "common") || "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should not be reached due to the redirect in useEffect
  // But keeping it as a fallback
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {t("articleRedirectProcessing", "article") ||
              "Processing redirect..."}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("articleRedirectProcessingDesc", "article") ||
              "Please wait while we redirect you to the article."}
          </p>
        </div>
      </div>
    </div>
  );
}
