"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useArticle } from "@/hooks/article";
import { ARTICLE_CONSTANTS } from "@/lib/types/article";
import {
    Bookmark,
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
import { toast } from "sonner";

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
  const { article, isLoading, error } = useArticle(articleId, {
    onError: (error) => {
      toast.error(error.message || t("articleViewError", "article"));
    },
  });

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
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-foreground mb-2">
                  {t("articleViewError", "article")}
                </h1>
                <p className="text-muted-foreground mb-6">
                  {error.message ||
                    "Something went wrong while loading the article."}
                </p>
                <Link href="/">
                  <Button>{t("articleViewBackToHome", "article")}</Button>
                </Link>
              </div>
            </div>
          )}

          {!error && article && (
            <article className="max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-6">
                <Link href="/">
                  <Button variant="outline" size="sm" className="gap-2">
                    ← {t("articleViewBackToHome", "article")}
                  </Button>
                </Link>
              </div>

              {/* Cover Image Hero Section */}
              {article.coverImage && (
                <div className="mb-8">
                  <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={article.coverImage.url}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
                      priority
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              )}

              {/* Article Header */}
              <header className="mb-8">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                  {article.title}
                </h1>

                {/* Author and Metadata Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        User ID {article.userId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {article.publishedAt
                          ? formatDate(article.publishedAt)
                          : formatDate(article.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Bookmark className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Article Stats */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                  {/* Read Time */}
                  {article.readTimeMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {article.readTimeMinutes}{" "}
                        {t("articleViewReadTime", "article")}
                      </span>
                    </div>
                  )}

                  {/* Word Count */}
                  {article.wordCount && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>
                        {article.wordCount}{" "}
                        {t("articleViewWordCount", "article")}
                      </span>
                    </div>
                  )}

                  {/* Visibility */}
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{getVisibilityText(article.visibility)}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {getStatusText(article.status)}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("articleViewTags", "article")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
                <ContentRenderer
                  content={article.content}
                  className="article-content"
                  enableSyntaxHighlighting={true}
                  useTipTapStyling={true}
                  variant="default"
                />
              </div>

              {/* Article Footer */}
              <footer className="mt-16 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        User ID {article.userId}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("articleViewAuthor", "article")}
                      </p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    {t("articleViewLastUpdated", "article")}:{" "}
                    {formatDate(article.updatedAt)}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex justify-center mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Heart className="h-5 w-5" />
                      Like this article
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                      <Bookmark className="h-5 w-5" />
                      Save for later
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                      <Share2 className="h-5 w-5" />
                      Share article
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
