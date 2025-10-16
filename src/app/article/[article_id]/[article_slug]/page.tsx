"use client";

import {
    CompactLikeButton,
    LargeLikeButton,
} from "@/components/features/reactions";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useArticle } from "@/hooks/article/useArticleQuery";
import { useArticleLike } from "@/hooks/reactions";
import { ARTICLE_CONSTANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Clock,
    Eye,
    FileText,
    Heart,
    Share2,
    Tag,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Article View Page Component
 * Displays a single article with full content, metadata, and author information
 * URL pattern: /article/[article_id]/[article_slug]
 * Layout inspired by note.jp design
 */
export default function ArticleViewPage() {
  const params = useParams();
  const { t } = useI18n();

  const articleId = params.article_id as string;

  // Fetch article data
  const { data: article, isLoading, error } = useArticle(articleId);

  // Initialize reactions (likes only)
  const { isLiked, likeCount, fetchLikeCount, checkLikeStatus } =
    useArticleLike(articleId);

  // Initialize reactions when article is loaded
  useEffect(() => {
    if (article && !isLoading && !error) {
      checkLikeStatus();
      fetchLikeCount();
    }
  }, [article, isLoading, error, checkLikeStatus, fetchLikeCount]);

  // Show 404 if article not found
  if (!isLoading && !error && !article) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get visibility text
  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case ARTICLE_CONSTANTS.VISIBILITY.PUBLIC:
        return t("articleViewVisibilityPublic", "article");
      case ARTICLE_CONSTANTS.VISIBILITY.UNLISTED:
        return t("articleViewVisibilityUnlisted", "article");
      case ARTICLE_CONSTANTS.VISIBILITY.PRIVATE:
        return t("articleViewVisibilityPrivate", "article");
      default:
        return visibility;
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case ARTICLE_CONSTANTS.STATUS.DRAFT:
        return t("articleViewStatusDraft", "article");
      case ARTICLE_CONSTANTS.STATUS.PUBLISHED:
        return t("articleViewStatusPublished", "article");
      case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
        return t("articleViewStatusScheduled", "article");
      case ARTICLE_CONSTANTS.STATUS.ARCHIVED:
        return t("articleViewStatusArchived", "article");
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first container with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto px-4">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {t("articleViewError", "article")}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {error.message ||
                    "Something went wrong while loading the article."}
                </p>
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    {t("articleViewBackToHome", "article")}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!error && article && (
            <article className="max-w-4xl mx-auto">
              {/* Back Button - Mobile optimized */}
              <div className="mb-4 sm:mb-6">
                <Link href="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    ← {t("articleViewBackToHome", "article")}
                  </Button>
                </Link>
              </div>

              {/* Cover Image Hero Section - Responsive heights */}
              {article.coverImage && (
                <div className="mb-6 sm:mb-8">
                  <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-lg">
                    <Image
                      src={article.coverImage.url}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
                      priority
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              )}

              {/* Article Header */}
              <header className="mb-6 sm:mb-8">
                {/* Title - Responsive typography */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
                  {article.title}
                </h1>

                {/* Author and Metadata Row - Mobile stacked, tablet+ horizontal */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        User ID {article.userId}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {article.publishedAt
                          ? formatDate(article.publishedAt)
                          : formatDate(article.createdAt ?? new Date())}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile stacked, tablet+ horizontal */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <CompactLikeButton articleId={articleId} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 justify-center"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>

                {/* Article Engagement Stats */}
                <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-border">
                  {/* Like Count - Prominent Display */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Heart
                        className={cn(
                          "h-5 w-5 sm:h-6 sm:w-6 transition-colors",
                          isLiked && "text-red-500 fill-current",
                        )}
                      />
                      <span className="text-lg sm:text-xl font-semibold text-foreground">
                        {likeCount}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {likeCount === 1
                        ? t("reactionLike", "article")
                        : t("reactionLikes", "article")}
                    </span>
                  </div>

                  {/* Read Time - Secondary */}
                  {article.readTimeMinutes && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        <span className="text-lg sm:text-xl font-semibold text-foreground">
                          {article.readTimeMinutes}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {t("articleViewReadTime", "article")}
                      </span>
                    </div>
                  )}

                  {/* Word Count - Secondary */}
                  {article.wordCount && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        <span className="text-lg sm:text-xl font-semibold text-foreground">
                          {article.wordCount}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {t("articleViewWordCount", "article")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Metadata - Compact */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  {/* Visibility */}
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {getVisibilityText(article.visibility)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {getStatusText(article.status)}
                    </span>
                  </div>
                </div>

                {/* Tags - Mobile optimized */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t("articleViewTags", "article")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Article Content - Responsive prose */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20">
                <ContentRenderer
                  content={article.content}
                  className="article-content"
                  enableSyntaxHighlighting={true}
                  useTipTapStyling={true}
                  variant="default"
                />
              </div>

              {/* Article Footer - Mobile optimized */}
              <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        User ID {article.userId}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {t("articleViewAuthor", "article")}
                      </p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                    {t("articleViewLastUpdated", "article")}:{" "}
                    {formatDate(article.updatedAt)}
                  </div>
                </div>

                {/* Bottom Action Buttons - Mobile stacked, tablet+ horizontal */}
                <div className="flex flex-col sm:flex-row justify-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <LargeLikeButton articleId={articleId} />
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 justify-center"
                    >
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">
                        Share article
                      </span>
                    </Button>
                  </div>
                </div>
              </footer>
            </article>
          )}
        </Skeletonize>
      </div>
    </div>
  );
}
