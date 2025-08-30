"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Github,
  Twitter,
  Rss,
  PenTool,
  MessageSquare,
  BookOpen,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { http } from "@/lib/http";
import { useIsMounted } from "@/components/providers/no-ssr";
import { toast } from "sonner";
import type { PublicUser, Article } from "@/lib/types";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.user_id as string;
  const [user, setUser] = useState<PublicUser | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "articles" | "scraps" | "comments"
  >("articles");
  const isMounted = useIsMounted();

  // Fetch user data
  useEffect(() => {
    if (!isMounted || !userId) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const userResponse = await http.get(`/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        } else {
          throw new Error(userResponse.data.message || "Failed to fetch user");
        }

        // Fetch user articles
        const articlesResponse = await http.get(`/users/${userId}/articles`);
        if (articlesResponse.data.success) {
          setArticles(articlesResponse.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load user profile";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, isMounted]);

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-background">
        <div className="border-b bg-card">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            User Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            {error ||
              "The user you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.username;
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasAvatar = user.avatar?.url;
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="bg-background">
      {/* Profile Header Section */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                {hasAvatar && (
                  <AvatarImage
                    src={user.avatar!.url}
                    alt={`${displayName}'s avatar`}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {displayName}
                </h1>
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  Follow
                </Button>
              </div>

              {/* Bio */}
              <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                {user.bio ||
                  `Welcome to ${displayName}&apos;s profile! This user hasn&apos;t added a bio yet.`}
              </p>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {user.socialLinks?.github && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={user.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {user.socialLinks?.twitter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {user.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Rss className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Navigation Tabs */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("articles")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "articles"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Articles {articles.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("scraps")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "scraps"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Scraps 0
              </span>
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "comments"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {activeTab === "articles" && (
          <div className="space-y-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <PenTool className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {article.likesCount}
                    </span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No articles yet
                </h3>
                <p className="text-muted-foreground">
                  {displayName} hasn&apos;t published any articles yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "scraps" && (
          <div className="text-center py-12">
            <PenTool className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No scraps yet
            </h3>
            <p className="text-muted-foreground">
              {displayName} hasn&apos;t written any scraps yet.
            </p>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No comments yet
            </h3>
            <p className="text-muted-foreground">
              {displayName} hasn&apos;t made any comments yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
