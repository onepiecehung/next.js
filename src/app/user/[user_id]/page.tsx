"use client";

import { useAtom } from "jotai";
import {
  BookOpen,
  Eye,
  Heart,
  MessageSquare,
  PenTool,
  Rss,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { Skeletonize } from "@/components/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  GitHubIcon,
  XIcon,
} from "@/components/ui";
import { UserAPI, type UserProfile } from "@/lib/api/users";
import { currentUserAtom } from "@/lib/auth";

/**
 * Internationalized Profile Page Component
 * Displays user profile information with tabs for different content types
 * Uses custom i18n hook for multi-language support with simple URL structure
 */
export default function ProfilePage() {
  const { t } = useI18n();
  const params = useParams();
  const userId = params.user_id as string;

  const [currentUser] = useAtom(currentUserAtom);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "articles" | "scraps" | "comments"
  >("articles");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await UserAPI.getUserProfile(userId);
        setProfileData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user profile",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Show error if API call failed
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t("userErrorTitle", "user")}
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // If no profile data, show loading
  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t("userNotFoundTitle", "user")}
          </h1>
          <p className="text-muted-foreground">
            {t("userNotFoundDescription", "user")}
          </p>
        </div>
      </div>
    );
  }
  const displayName =
    profileData.name || profileData.username || profileData.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasAvatar = profileData.avatar?.url;

  return (
    <div className="bg-background min-h-screen">
      {/* Profile Header Section */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          <Skeletonize loading={isLoading}>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-2 ring-primary/20">
                  {hasAvatar && (
                    <AvatarImage
                      src={profileData.avatar?.url}
                      alt={`${displayName}'s avatar`}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/60 dark:from-primary/80 dark:to-primary/40 text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {displayName}
                  </h1>
                  {currentUser && currentUser.id === userId && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/30 hover:border-primary/50 hover:bg-primary/10 text-xs sm:text-sm"
                      >
                        {t("buttonEdit", "common")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/30 hover:border-primary/50 hover:bg-primary/10 text-xs sm:text-sm"
                      >
                        {t("buttonSave", "common")}
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-base sm:text-lg mb-4 leading-relaxed">
                  Full-stack developer passionate about creating beautiful and
                  functional web applications. Love working with React, Next.js,
                  and modern web technologies.
                </p>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 text-chart-3" />
                    1.2k Views
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 text-chart-1" />
                    12 {t("headerLikes", "profile")}
                  </span>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <Button
                    key="github"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    key="x"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    key="rss"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Rss className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Skeletonize>
        </div>
      </div>

      {/* Content Navigation Tabs */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              key="articles"
              onClick={() => setActiveTab("articles")}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t("tabsArticles", "profile")} 3
              </span>
            </button>
            <button
              key="scraps"
              onClick={() => setActiveTab("scraps")}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "scraps"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <span className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                {t("tabsScraps", "profile")} 0
              </span>
            </button>
            <button
              key="comments"
              onClick={() => setActiveTab("comments")}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "comments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("tabsComments", "profile")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {activeTab === "articles" && (
          <Skeletonize loading={isLoading}>
            <div className="space-y-6">
              {/* Article Card 1 */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/30 transition-colors group">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-3">
                  {t("categoriesTech", "profile")}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  Building a Modern Next.js Application with TypeScript and
                  Tailwind CSS
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>2 {t("contentDaysAgo", "profile")}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-chart-1" />6
                  </span>
                  <span>8 {t("contentReadTime", "profile")}</span>
                </div>
              </div>

              {/* Article Card 2 */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/30 transition-colors group">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-chart-2/10 text-chart-2 border border-chart-2/20 mb-3">
                  {t("categoriesTutorial", "profile")}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  Complete Guide to Authentication with Next.js and JWT
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>1 {t("contentWeeksAgo", "profile")}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-chart-1" />
                    12
                  </span>
                  <span>12 {t("contentReadTime", "profile")}</span>
                </div>
              </div>

              {/* Article Card 3 */}
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors group">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-chart-4/10 text-chart-4 border border-chart-4/20 mb-3">
                  {t("categoriesInsights", "profile")}
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  State Management Best Practices in React Applications
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>2 {t("contentWeeksAgo", "profile")}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-chart-1" />8
                  </span>
                  <span>6 {t("contentReadTime", "profile")}</span>
                </div>
              </div>
            </div>
          </Skeletonize>
        )}

        {activeTab === "scraps" && (
          <Skeletonize loading={isLoading}>
            <div className="text-center py-12">
              <PenTool className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("contentNoScraps", "profile")}
              </h3>
              <p className="text-muted-foreground">
                {t("contentNoScrapsDescription", "profile")}
              </p>
            </div>
          </Skeletonize>
        )}

        {activeTab === "comments" && (
          <Skeletonize loading={isLoading}>
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("contentNoComments", "profile")}
              </h3>
              <p className="text-muted-foreground">
                {t("contentNoCommentsDescription", "profile")}
              </p>
            </div>
          </Skeletonize>
        )}
      </div>
    </div>
  );
}
