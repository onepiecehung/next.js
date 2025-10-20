import type { Metadata } from "next";

/**
 * Base site configuration for metadata
 */
export const SITE_CONFIG = {
  name: "Next.js Blog Platform",
  description:
    "A modern blogging platform built with Next.js 15, featuring rich text editing, theming, and multi-language support.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
  twitterSite: "@your-twitter-handle",
  keywords: [
    "blog",
    "writing",
    "next.js",
    "react",
    "typescript",
    "tailwindcss",
    "shadcn/ui",
    "tiptap",
    "firebase",
    "i18n",
  ],
} as const;

/**
 * Generate dynamic metadata for pages
 * @param options - Metadata configuration options
 */
export function generateMetadata(options: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  locale?: string;
}): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    authors = [],
    tags = [],
    locale = "en",
  } = options;

  // Generate full title with site name
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;

  // Generate description with fallback
  const metaDescription = description || SITE_CONFIG.description;

  // Generate keywords array
  const allKeywords = [...SITE_CONFIG.keywords, ...keywords];

  // Generate canonical URL
  const canonicalUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;

  // Generate Open Graph image URL
  const ogImageUrl = image
    ? `${SITE_CONFIG.url}${image}`
    : `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: authors.length > 0 ? authors.map((name) => ({ name })) : undefined,
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale,
      url: canonicalUrl,
      title: fullTitle,
      description: metaDescription,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors.length > 0 && { authors }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: SITE_CONFIG.twitterCard,
      site: SITE_CONFIG.twitterSite,
      creator: SITE_CONFIG.twitterSite,
      title: fullTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };

  return metadata;
}

/**
 * Generate article-specific metadata
 * @param article - Article data
 * @param locale - Locale for internationalization
 */
export function generateArticleMetadata(
  article: {
    title: string;
    content: string;
    coverImage?: { url: string };
    publishedAt?: string;
    modifiedAt?: string;
    tagsArray?: string[];
    userId: string;
    slug?: string;
  },
  locale: string = "en",
): Metadata {
  // Extract first paragraph as description (max 160 chars)
  const contentText = article.content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const description =
    contentText.length > 160
      ? `${contentText.substring(0, 157)}...`
      : contentText;

  // Generate article URL
  const articleUrl = `/article/${article.userId}/${article.slug || article.userId}`;

  // Use cover image or default
  const imageUrl = article.coverImage?.url || "/default-article-cover.jpg";

  return generateMetadata({
    title: article.title,
    description,
    keywords: article.tagsArray || [],
    image: imageUrl,
    url: articleUrl,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    authors: [`User ${article.userId}`],
    tags: article.tagsArray,
    locale,
  });
}

/**
 * Generate user profile metadata
 * @param user - User data
 * @param locale - Locale for internationalization
 */
export function generateUserMetadata(
  user: {
    id: string;
    name?: string;
    bio?: string;
    avatar?: string;
  },
  locale: string = "en",
): Metadata {
  const userName = user.name || `User ${user.id}`;
  const description = user.bio || `Read articles and stories by ${userName}`;
  const userUrl = `/user/${user.id}`;

  return generateMetadata({
    title: `${userName}'s Profile`,
    description,
    keywords: ["profile", "author", "writer", userName],
    image: user.avatar,
    url: userUrl,
    type: "profile",
    locale,
  });
}

/**
 * Generate page metadata with i18n support
 * @param pageKey - Page key for i18n
 * @param namespace - i18n namespace
 * @param locale - Current locale
 * @param additionalData - Additional metadata
 */
export function generatePageMetadata(
  pageKey: string,
  namespace: string,
  locale: string = "en",
  additionalData?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
  },
): Metadata {
  // This would typically use your i18n system
  // For now, we'll use fallback values
  const fallbackTitles: Record<string, string> = {
    home: "Home",
    write: "Write Article",
    profile: "Profile",
    settings: "Settings",
    login: "Login",
    register: "Register",
  };

  const fallbackDescriptions: Record<string, string> = {
    home: "Welcome to our modern blogging platform",
    write: "Create and publish your articles",
    profile: "Manage your profile and articles",
    settings: "Customize your experience",
    login: "Sign in to your account",
    register: "Create a new account",
  };

  const title = additionalData?.title || fallbackTitles[pageKey] || pageKey;
  const description =
    additionalData?.description ||
    fallbackDescriptions[pageKey] ||
    SITE_CONFIG.description;

  return generateMetadata({
    title,
    description,
    keywords: additionalData?.keywords,
    image: additionalData?.image,
    url: additionalData?.url,
    locale,
  });
}

/**
 * Generate structured data for articles (JSON-LD)
 * @param article - Article data
 */
export function generateArticleStructuredData(article: {
  title: string;
  content: string;
  coverImage?: { url: string };
  publishedAt?: string;
  modifiedAt?: string;
  tagsArray?: string[];
  userId: string;
  slug?: string;
  readTimeMinutes?: number;
  wordCount?: number;
}) {
  const articleUrl = `${SITE_CONFIG.url}/article/${article.userId}/${article.slug || article.userId}`;
  const imageUrl = article.coverImage?.url
    ? `${SITE_CONFIG.url}${article.coverImage.url}`
    : `${SITE_CONFIG.url}/default-article-cover.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.content.replace(/<[^>]*>/g, "").substring(0, 160),
    image: imageUrl,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: `User ${article.userId}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(article.tagsArray && { keywords: article.tagsArray.join(", ") }),
    ...(article.readTimeMinutes && {
      timeRequired: `PT${article.readTimeMinutes}M`,
    }),
    ...(article.wordCount && { wordCount: article.wordCount }),
  };
}

/**
 * Generate breadcrumb structured data
 * @param breadcrumbs - Array of breadcrumb items
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
