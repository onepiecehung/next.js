"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button, GitHubIcon, InstagramIcon, XIcon } from "@/components/ui";
import { AuthorCardData } from "@/lib/interface/user.interface";
import {
  ExternalLink,
  Rss,
  User,
} from "lucide-react";
import Image from "next/image";

interface AuthorCardProps {
  author: AuthorCardData;
  onFollow?: (authorId: string) => void;
  className?: string;
}

/**
 * Reusable Author Card Component
 * Displays author information with avatar, bio, social links, and follow button
 * Can be used in article pages, user profiles, and other locations
 */
export function AuthorCard({ author, onFollow, className }: AuthorCardProps) {
  const { t } = useI18n();

  const handleFollow = () => {
    if (onFollow) {
      onFollow(author.id);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-6 sm:p-8 ${className || ""}`}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
              <Image
                src={author.avatar}
                alt={author.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          {/* Name and Follow Button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                {author.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("authorCard.bio", "article")}
              </p>
            </div>
            <Button size="sm" className="w-full sm:w-auto" onClick={handleFollow}>
              {t("authorCard.follow", "article")}
            </Button>
          </div>

          {/* Author Bio */}
          {author.bio && (
            <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
              {author.bio}
            </p>
          )}

          {/* Website Link */}
          {author.website && (
            <div className="mb-4">
              <a 
                href={author.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {author.website}
              </a>
            </div>
          )}

          {/* Social Links */}
          {author.socialLinks && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {t("authorCard.socialLinks", "article")}:
              </span>
              <div className="flex items-center gap-3">
                {author.socialLinks.github && (
                  <a 
                    href={author.socialLinks.github} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Github"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
                {author.socialLinks.x && (
                  <a 
                    href={author.socialLinks.x} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="X"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                )}
                {author.socialLinks.instagram && (
                  <a 
                    href={author.socialLinks.instagram} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {author.socialLinks.rss && (
                  <a 
                    href={author.socialLinks.rss} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="RSS Feed"
                  >
                    <Rss className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Author Stats */}
          {author.stats && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {author.stats.followers !== undefined && (
                  <span>
                    <span className="font-semibold text-foreground">{author.stats.followers}</span>{" "}
                    {t("authorCard.followers", "article")}
                  </span>
                )}
                {author.stats.articles !== undefined && (
                  <span>
                    <span className="font-semibold text-foreground">{author.stats.articles}</span>{" "}
                    {t("authorCard.articles", "article")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
