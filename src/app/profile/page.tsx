"use client";

import { useState } from "react";
import {
  Heart,
  Github,
  Twitter,
  Rss,
  PenTool,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/lib/auth-store";
import { useIsMounted } from "@/components/providers/no-ssr";

/**
 * Profile Page Component
 * Displays user profile information with tabs for different content types
 */
export default function ProfilePage() {
  const [user] = useAtom(currentUserAtom);
  const [activeTab, setActiveTab] = useState<
    "articles" | "scraps" | "comments"
  >("articles");
  const isMounted = useIsMounted();

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // If no user, show loading or redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Profile Not Found
          </h1>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.username || user.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasAvatar = user.avatar?.url;

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
                Full-stack developer passionate about creating modern web
                applications. Specializing in Next.js, React, TypeScript, and
                Node.js. Building scalable solutions with clean architecture.
              </p>

              {/* Stats */}
              <div className="text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  12 Likes
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Rss className="h-4 w-4" />
                </Button>
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
                Articles 3
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
            {/* Article Card 1 */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  TECH
                </span>
                <PenTool className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                Building a Modern Next.js Application with TypeScript and
                Tailwind CSS
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>2 days ago</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />6
                </span>
              </div>
            </div>

            {/* Article Card 2 */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  TUTORIAL
                </span>
                <BookOpen className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                Complete Guide to Authentication with Next.js and JWT
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>1 week ago</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  12
                </span>
              </div>
            </div>

            {/* Article Card 3 */}
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  INSIGHTS
                </span>
                <MessageSquare className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                State Management Best Practices in React Applications
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>2 weeks ago</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />8
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scraps" && (
          <div className="text-center py-12">
            <PenTool className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No scraps yet
            </h3>
            <p className="text-muted-foreground">
              Start writing your first scrap to share your thoughts.
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
              Your comments will appear here when you start engaging with
              content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
