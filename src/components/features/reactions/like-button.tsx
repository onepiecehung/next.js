"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui";
import {
  useReactions,
  useToggleReaction,
} from "@/hooks/reactions/useReactionQuery";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  readonly articleId: string;
  readonly className?: string;
  readonly size?: "sm" | "default" | "lg";
  readonly variant?: "default" | "outline" | "ghost";
  readonly showCount?: boolean;
  readonly showText?: boolean;
}

/**
 * Like Button Component
 * Handles article liking with optimistic updates and proper loading states
 */
export function LikeButton({
  articleId,
  className,
  size = "default",
  variant = "outline",
  showCount = true,
  showText = true,
}: LikeButtonProps) {
  const { t } = useI18n();
  const { mutate: toggleLike, isPending: isLoading } = useToggleReaction();

  // Get reactions data for this article
  const { data: reactions } = useReactions(articleId);
  const likeCount = reactions?.filter((r) => r.type === "like").length || 0;
  const isLiked = reactions?.some((r) => r.type === "like") || false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike({ articleId, type: "like" });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "gap-2 transition-all duration-200",
        isLiked && "text-red-500 hover:text-red-600",
        isLoading && "opacity-70",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isLiked && "fill-current",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5",
        )}
      />
      {showText && (
        <span className="hidden sm:inline">
          {isLiked
            ? t("reactionLiked", "article") || "Liked"
            : t("reactionLike", "article") || "Like"}
        </span>
      )}
      {showCount && likeCount > 0 && (
        <span className="text-xs font-medium">{likeCount}</span>
      )}
    </Button>
  );
}

/**
 * Compact Like Button Component
 * Smaller version for use in article headers or compact layouts
 */
export function CompactLikeButton({
  articleId,
  className,
}: Readonly<Pick<LikeButtonProps, "articleId" | "className">>) {
  return (
    <LikeButton
      articleId={articleId}
      size="sm"
      variant="outline"
      showText={false}
      showCount={true}
      className={className}
    />
  );
}

/**
 * Large Like Button Component
 * Larger version for use in article footers or prominent positions
 */
export function LargeLikeButton({
  articleId,
  className,
}: Readonly<Pick<LikeButtonProps, "articleId" | "className">>) {
  return (
    <LikeButton
      articleId={articleId}
      size="lg"
      variant="outline"
      showText={true}
      showCount={true}
      className={className}
    />
  );
}
