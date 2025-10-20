"use client";

import { useAtom } from "jotai";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Grid3X3,
  Heart,
  List,
  MoreHorizontal,
  Square,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/core/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/core/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { useUserArticlesLayout } from "@/hooks/article";
import { currentUserAtom } from "@/lib/auth";
import type { AdvancedQueryParams } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserArticlesLayoutProps {
  readonly userId: string;
  readonly initialLayout?: "grid" | "list" | "card";
  readonly params?: AdvancedQueryParams;
  readonly className?: string;
}

/**
 * User Articles Layout Component
 * Displays user's articles with multiple layout options
 */
export function UserArticlesLayout({
  userId,
  initialLayout = "grid",
  params,
  className = "",
}: UserArticlesLayoutProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [currentUser] = useAtom(currentUserAtom);
  const [layout, setLayout] = useState<"grid" | "list" | "card">(initialLayout);

  const {
    articles,
    isLoading,
    error,
    refetch,
    layoutConfig,
    totalCount,
    hasMore,
  } = useUserArticlesLayout(userId, layout, params);

  const isOwnProfile = currentUser?.id === userId;

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleEditArticle = (articleId: string) => {
    router.push(`/write?edit=${articleId}`);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {t("error.loadingArticles", "article") || "Failed to load articles"}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t("actions.retry", "common") || "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {t("articles.title", "article") || "Articles"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {totalCount} {totalCount === 1 ? "article" : "articles"}{" "}
                published
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Layout Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-xl p-1">
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("grid")}
              className={cn(
                "h-9 px-3 transition-all duration-200",
                layout === "grid" && "shadow-sm",
              )}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={layout === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("list")}
              className={cn(
                "h-9 px-3 transition-all duration-200",
                layout === "list" && "shadow-sm",
              )}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={layout === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout("card")}
              className={cn(
                "h-9 px-3 transition-all duration-200",
                layout === "card" && "shadow-sm",
              )}
            >
              <Square className="h-4 w-4 mr-2" />
              Card
            </Button>
          </div>
        </div>
      </div>

      {/* Articles Grid/List */}
      <Skeletonize loading={isLoading}>
        {articles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No articles yet
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                {isOwnProfile
                  ? "Start sharing your thoughts and experiences with the world."
                  : "This user hasn't published any articles yet."}
              </p>
              {isOwnProfile && (
                <Button onClick={() => router.push("/write")} className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Write your first article
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={layoutConfig.containerClass}>
            {articles.map((article) => (
              <ArticleItem
                key={article.id}
                article={article as unknown as FormattedArticle}
                layout={layout}
                layoutConfig={layoutConfig}
                isOwnProfile={isOwnProfile}
                onArticleClick={handleArticleClick}
                onEditArticle={handleEditArticle}
              />
            ))}
          </div>
        )}
      </Skeletonize>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={() => refetch()}>
            {t("actions.loadMore", "common") || "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

interface FormattedArticle {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  visibility: string;
  statusText: string;
  visibilityText: string;
  visibilityIcon: string;
  formattedDate: string;
  readTime: number;
  tags: string[];
  statusBadge?: { text: string; color: string };
  visibilityBadge?: { text: string; color: string };
}

interface ArticleItemProps {
  readonly article: FormattedArticle;
  readonly layout: "grid" | "list" | "card";
  readonly layoutConfig: {
    containerClass: string;
    itemClass: string;
  };
  readonly isOwnProfile: boolean;
  readonly onArticleClick: (id: string) => void;
  readonly onEditArticle: (id: string) => void;
}

function ArticleItem({
  article,
  layout,
  isOwnProfile,
  onArticleClick,
  onEditArticle,
}: ArticleItemProps) {
  const renderGridLayout = () => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium",
                article.status === "published" &&
                  "bg-green-100 text-green-700 hover:bg-green-100",
                article.status === "draft" &&
                  "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                article.status === "scheduled" &&
                  "bg-blue-100 text-blue-700 hover:bg-blue-100",
              )}
            >
              {article.statusText}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {article.visibilityIcon} {article.visibilityText}
            </Badge>
          </div>
          {isOwnProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onArticleClick(article.id)}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Article
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEditArticle(article.id)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Article
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete Article
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        <h3
          className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2"
          onClick={() => onArticleClick(article.id)}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {article.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime} min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />0
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />0
            </span>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderListLayout = () => (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  article.status === "published" &&
                    "bg-green-100 text-green-700",
                  article.status === "draft" && "bg-yellow-100 text-yellow-700",
                  article.status === "scheduled" && "bg-blue-100 text-blue-700",
                )}
              >
                {article.statusBadge?.text}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {article.visibilityBadge?.text}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {article.formattedDate}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2"
              onClick={() => onArticleClick(article.id)}
            >
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />0 views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />0 likes
              </span>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onArticleClick(article.id)}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Article
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEditArticle(article.id)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Article
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete Article
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderCardLayout = () => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card via-card to-card/80">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-sm font-medium px-3 py-1",
                  article.status === "published" &&
                    "bg-green-100 text-green-700",
                  article.status === "draft" && "bg-yellow-100 text-yellow-700",
                  article.status === "scheduled" && "bg-blue-100 text-blue-700",
                )}
              >
                {article.statusText}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {article.visibilityIcon} {article.visibilityText}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {article.formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </span>
            </div>
          </div>
          {isOwnProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onArticleClick(article.id)}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Article
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEditArticle(article.id)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Article
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete Article
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <h3
          className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-3"
          onClick={() => onArticleClick(article.id)}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-base">
          {article.excerpt}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">0</span>
            <span>views</span>
          </span>
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="font-medium">0</span>
            <span>likes</span>
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-medium">0</span>
            <span>comments</span>
          </span>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-sm px-3 py-1">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  switch (layout) {
    case "grid":
      return renderGridLayout();
    case "list":
      return renderListLayout();
    case "card":
      return renderCardLayout();
    default:
      return renderGridLayout();
  }
}
