"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DraculaCard,
  DraculaCardContent,
  DraculaCardHeader,
  DraculaCardTitle,
} from "@/components/ui/dracula-card";
import {
  Calendar,
  MapPin,
  Globe,
  Mail,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  User,
} from "lucide-react";
import Link from "next/link";
import { Skeletonize } from "@/components/skeletonize";

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
  };
  location?: string;
  website?: string;
  createdAt: string;
  _count?: {
    articles: number;
    followers: number;
    following: number;
  };
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: number;
  tags: string[];
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.user_id as string;
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data
        const mockUser: User = {
          id: userId,
          username: "johndoe",
          name: "John Doe",
          email: "john@example.com",
          bio: "Passionate software engineer with 5+ years of experience in web development. Love building scalable applications and sharing knowledge with the community.",
          avatar: {
            url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          },
          location: "San Francisco, CA",
          website: "https://johndoe.dev",
          createdAt: "2023-01-15T00:00:00.000Z",
          _count: {
            articles: 12,
            followers: 156,
            following: 89,
          },
        };

        // Mock articles data
        const mockArticles: Article[] = [
          {
            id: "1",
            title: "Building Scalable Web Applications with Next.js",
            excerpt:
              "Learn the best practices for building scalable web applications using Next.js, including performance optimization and deployment strategies.",
            publishedAt: "2024-01-15T00:00:00.000Z",
            readTime: 8,
            likes: 45,
            comments: 12,
            tags: ["Next.js", "Web Development", "Performance"],
          },
          {
            id: "2",
            title: "Mastering TypeScript for React Developers",
            excerpt:
              "A comprehensive guide to using TypeScript effectively in React applications, covering advanced patterns and best practices.",
            publishedAt: "2024-01-10T00:00:00.000Z",
            readTime: 12,
            likes: 67,
            comments: 18,
            tags: ["TypeScript", "React", "Programming"],
          },
          {
            id: "3",
            title: "The Future of Web Development: What's Next?",
            excerpt:
              "Exploring emerging trends and technologies that will shape the future of web development in the coming years.",
            publishedAt: "2024-01-05T00:00:00.000Z",
            readTime: 6,
            likes: 34,
            comments: 8,
            tags: ["Web Development", "Trends", "Technology"],
          },
        ];

        setUser(mockUser);
        setArticles(mockArticles);
      } catch (err) {
        setError("Failed to load user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Loading state with new skeleton system
  if (loading) {
    return (
      <div className="bg-background">
        <div className="border-b bg-card">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <Skeletonize loading={true}>
              <div className="flex items-start gap-6">
                <div className="h-24 w-24 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-48 bg-gray-200 rounded" />
                  <div className="h-6 w-96 bg-gray-200 rounded" />
                  <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
              </div>
            </Skeletonize>
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
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {user._count?.articles || 0}
                  </span>
                  <span className="text-muted-foreground">Articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {user._count?.followers || 0}
                  </span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {user._count?.following || 0}
                  </span>
                  <span className="text-muted-foreground">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Articles by {displayName}
          </h2>
          <p className="text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? "s" : ""}{" "}
            published
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <DraculaCard
              key={article.id}
              className="hover:shadow-md transition-shadow"
            >
              <DraculaCardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DraculaCardTitle className="text-xl mb-2">
                      <Link
                        href={`/article/${article.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </DraculaCardTitle>
                    <p className="text-muted-foreground mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <span>{article.readTime} min read</span>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {article.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {article.comments}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DraculaCardHeader>
              <DraculaCardContent>
                <div className="flex items-center gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </DraculaCardContent>
            </DraculaCard>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <MessageCircle className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Articles Yet</h3>
              <p>This user hasn't published any articles yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
