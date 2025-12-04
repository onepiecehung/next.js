"use client";

import { useAtom } from "jotai";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  List,
  MoreHorizontal,
  Search,
  Square,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/core/badge";
import { Card, CardContent } from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params with filters and pagination
  const queryParams: AdvancedQueryParams = {
    ...params,
    page: currentPage,
    limit: 12,
    sortBy: "createdAt",
    order: "DESC",
    query: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  };

  const {
    articles,
    isLoading,
    error,
    refetch,
    layoutConfig,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = useUserArticlesLayout(userId, layout, queryParams);

  // Debug info
  console.log("UserArticlesLayout Debug:", {
    articles: articles?.length,
    isLoading,
    error,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    searchQuery,
    statusFilter,
    visibilityFilter,
  });

  const isOwnProfile = currentUser?.id === userId;

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const handleEditArticle = (articleId: string) => {
    router.push(`/write?edit=${articleId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
    // Scroll to top when searching with delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleFilterChange = (type: "status" | "visibility", value: string) => {
    if (type === "status") {
      setStatusFilter(value);
    } else {
      setVisibilityFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filtering
    // Scroll to top when filtering with delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes with a small delay to ensure data loads
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
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
      <div className="space-y-6">
        {/* Title and Stats */}
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
                {/* Debug info */}
                <div className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages} | Search: &quot;
                  {searchQuery}&quot; | Status: {statusFilter}
                </div>
              </div>
            </div>
          </div>

          {/* Layout Controls */}
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

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "all")}
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "published")}
                >
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "draft")}
                >
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "scheduled")}
                >
                  Scheduled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Visibility:{" "}
                  {visibilityFilter === "all" ? "All" : visibilityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("visibility", "all")}
                >
                  All Visibility
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("visibility", "public")}
                >
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("visibility", "unlisted")}
                >
                  Unlisted
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("visibility", "private")}
                >
                  Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Debug Pagination Info */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Debug Info:</h4>
        <div className="text-sm space-y-1">
          <div>Articles: {articles?.length || 0}</div>
          <div>Total Count: {totalCount}</div>
          <div>Total Pages: {totalPages}</div>
          <div>Current Page: {currentPage}</div>
          <div>Has Next: {hasNextPage ? "Yes" : "No"}</div>
          <div>Has Previous: {hasPreviousPage ? "Yes" : "No"}</div>
          <div>Search Query: &quot;{searchQuery}&quot;</div>
          <div>Status Filter: {statusFilter}</div>
          <div>Visibility Filter: {visibilityFilter}</div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {hasPreviousPage && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {hasNextPage && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

interface FormattedArticle {
  id: string;
  title: string;
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
  coverImage?: {
    url: string;
    thumbnailUrl: string;
    altText?: string;
  };
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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            article.coverImage?.url ||
            article.coverImage?.thumbnailUrl ||
            "/default-article-cover.svg"
          }
          alt={article.coverImage?.altText || article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-medium backdrop-blur-sm",
              article.status === "published" &&
                "bg-green-100/90 text-green-700 hover:bg-green-100/90",
              article.status === "draft" &&
                "bg-yellow-100/90 text-yellow-700 hover:bg-yellow-100/90",
              article.status === "scheduled" &&
                "bg-blue-100/90 text-blue-700 hover:bg-blue-100/90",
            )}
          >
            {article.statusText}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs backdrop-blur-sm bg-background/90"
          >
            {article.visibilityIcon} {article.visibilityText}
          </Badge>
        </div>
        {/* Actions Overlay */}
        {isOwnProfile && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/90"
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
          </div>
        )}
      </div>

      <CardContent className="space-y-4 p-6">
        {/* Title */}
        <h3
          className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2"
          onClick={() => onArticleClick(article.id)}
        >
          {article.title}
        </h3>

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
        {article.tags && article.tags.length > 0 && (
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
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Cover Image */}
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={
                article.coverImage?.url ||
                article.coverImage?.thumbnailUrl ||
                "/default-article-cover.svg"
              }
              alt={article.coverImage?.altText || article.title}
              fill
              className="!object-cover !object-center transition-transform duration-300 group-hover:scale-105"
              sizes="128px"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            {/* Status Badge Overlay */}
            <div className="absolute top-1 left-1">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium backdrop-blur-sm",
                  article.status === "published" &&
                    "bg-green-100/90 text-green-700",
                  article.status === "draft" &&
                    "bg-yellow-100/90 text-yellow-700",
                  article.status === "scheduled" &&
                    "bg-blue-100/90 text-blue-700",
                )}
              >
                {article.statusBadge?.text}
              </Badge>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3">
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
            {article.tags && article.tags.length > 0 && (
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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card via-card to-card/80 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={
            article.coverImage?.url ||
            article.coverImage?.thumbnailUrl ||
            "/default-article-cover.svg"
          }
          alt={article.coverImage?.altText || article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Status Badges Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-sm font-medium px-3 py-1 backdrop-blur-sm",
              article.status === "published" &&
                "bg-green-100/90 text-green-700",
              article.status === "draft" && "bg-yellow-100/90 text-yellow-700",
              article.status === "scheduled" && "bg-blue-100/90 text-blue-700",
            )}
          >
            {article.statusText}
          </Badge>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 backdrop-blur-sm bg-background/90"
          >
            {article.visibilityIcon} {article.visibilityText}
          </Badge>
        </div>
        {/* Actions Overlay */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/90"
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
          </div>
        )}
      </div>

      <CardContent className="space-y-6 p-6">
        {/* Title */}
        <h3
          className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-3"
          onClick={() => onArticleClick(article.id)}
        >
          {article.title}
        </h3>

        {/* Meta Info */}
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
        {article.tags && article.tags.length > 0 && (
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
