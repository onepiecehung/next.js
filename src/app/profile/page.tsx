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
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/lib/auth-store";
import { useIsMounted } from "@/components/providers/no-ssr";
import Link from "next/link";
import { Skeletonize } from "@/components/skeletonize";

/**
 * Profile Page Component
 * Displays user profile information with tabs for different content types
 * Uses Dracula theme color system for consistent and harmonious design
 */
export default function ProfilePage() {
  const [user] = useAtom(currentUserAtom);
  const [activeTab, setActiveTab] = useState<
    "articles" | "scraps" | "comments"
  >("articles");
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="bg-background min-h-screen">
      {/* Profile Header Section */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Skeletonize loading={isLoading}>
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                  {hasAvatar && (
                    <AvatarImage
                      src={user?.avatar?.url}
                      alt={`${displayName}'s avatar`}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
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
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Follow
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-secondary transition-colors"
                      asChild
                    >
                      <Link href={`/user/${user.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View as Public
                      </Link>
                    </Button>
                  </div>
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
                    <Heart className="h-4 w-4 text-chart-1" />
                    12 Likes
                  </span>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
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
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("articles")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
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
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
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
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
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
          <Skeletonize loading={isLoading}>
            <div className="space-y-6">
              {/* Article Card 1 */}
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors group">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  TECH
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  Building a Modern Next.js Application with TypeScript and
                  Tailwind CSS
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>2 days ago</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-chart-1" />6
                  </span>
                  <span>8 min read</span>
                </div>
              </div>

              {/* Article Card 2 */}
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors group">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-chart-2/10 text-chart-2 border border-chart-2/20">
                  TUTORIAL
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  Complete Guide to Authentication with Next.js and JWT
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>1 week ago</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-chart-1" />
                    12
                  </span>
                  <span>12 min read</span>
                </div>
              </div>

              {/* Article Card 3 */}
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors group">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-chart-4/10 text-chart-4 border border-chart-4/20">
                  INSIGHTS
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  State Management Best Practices in React Applications
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>2 weeks ago</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-chart-1" />8
                  </span>
                  <span>6 min read</span>
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
                No scraps yet
              </h3>
              <p className="text-muted-foreground">
                Start writing your first scrap to share your thoughts.
              </p>
            </div>
          </Skeletonize>
        )}

        {activeTab === "comments" && (
          <Skeletonize loading={isLoading}>
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
          </Skeletonize>
        )}
      </div>
    </div>
  );
}
