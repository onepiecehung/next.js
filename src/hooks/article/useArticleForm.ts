import { useI18n } from "@/components/providers/i18n-provider";
import type { Article } from "@/lib/interface";
import { useState } from "react";
import { toast } from "sonner";

interface UseArticleFormOptions {
  onSuccess?: (article: Article) => void;
}

/**
 * Hook for managing article form state and validation
 * @param _options - Optional configuration for the article form (reserved for future use)
 */
export function useArticleForm(_options?: UseArticleFormOptions) {
  const { t } = useI18n();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<
    "public" | "unlisted" | "private"
  >("public");
  const [scheduledPublish, setScheduledPublish] = useState<Date | null>(null);

  // Validation
  const validateForm = () => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push(t("writeFormTitleRequired", "write") || "Title is required");
    }

    if (title.length > 256) {
      errors.push(
        t("writeFormTitleTooLong", "write") ||
          "Title must be less than 256 characters",
      );
    }

    if (!content.trim()) {
      errors.push(
        t("writeFormContentRequired", "write") || "Content is required",
      );
    }

    if (tags.length > 20) {
      errors.push(
        t("writeFormTagsTooMany", "write") || "Maximum 20 tags allowed",
      );
    }

    // Validate scheduled publish date
    if (scheduledPublish) {
      const now = new Date();
      if (scheduledPublish <= now) {
        errors.push(
          t("writeFormScheduledDateInvalid", "write") ||
            "Scheduled publish date must be in the future",
        );
      }
    }

    return errors;
  };

  // Calculate word count
  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Calculate read time (assuming 200 words per minute)
  const getReadTimeMinutes = (wordCount: number) => {
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  // Reset form
  const resetForm = () => {
    setCoverImage(null);
    setTitle("");
    setContent("");
    setSummary("");
    setTags([]);
    setVisibility("public");
    setScheduledPublish(null);
  };

  // Show validation errors
  const showValidationErrors = (errors: string[]) => {
    errors.forEach((error) => {
      toast.error(error);
    });
  };

  return {
    // Form state
    coverImage,
    setCoverImage,
    title,
    setTitle,
    content,
    setContent,
    summary,
    setSummary,
    tags,
    setTags,
    visibility,
    setVisibility,
    scheduledPublish,
    setScheduledPublish,

    // Form actions
    validateForm,
    resetForm,
    showValidationErrors,

    // Computed values
    wordCount: getWordCount(content),
    readTimeMinutes: getReadTimeMinutes(getWordCount(content)),
  };
}
