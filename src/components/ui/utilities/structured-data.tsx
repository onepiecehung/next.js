import Script from "next/script";

/**
 * Structured Data Component
 * Adds JSON-LD structured data to pages for better SEO
 */
interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

/**
 * Website Structured Data
 * Adds basic website information for SEO
 */
export function WebsiteStructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Next.js Blog Platform",
    description:
      "A modern blogging platform built with Next.js 15, featuring rich text editing, theming, and multi-language support.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Next.js Blog Platform",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/logo.png`,
      },
    },
  };

  return <StructuredData data={websiteData} />;
}

/**
 * Organization Structured Data
 * Adds organization information for SEO
 */
export function OrganizationStructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Next.js Blog Platform",
    description:
      "A modern blogging platform built with Next.js 15, featuring rich text editing, theming, and multi-language support.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/logo.png`,
    sameAs: [
      "https://github.com/your-username/your-repo",
      "https://twitter.com/your-handle",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@your-domain.com",
    },
  };

  return <StructuredData data={organizationData} />;
}

/**
 * Breadcrumb Structured Data
 * Adds breadcrumb navigation for SEO
 */
interface BreadcrumbStructuredDataProps {
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({
  breadcrumbs,
}: BreadcrumbStructuredDataProps) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}${item.url}`,
    })),
  };

  return <StructuredData data={breadcrumbData} />;
}

/**
 * Article Structured Data
 * Adds article-specific structured data for SEO
 */
interface ArticleStructuredDataProps {
  article: {
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
  };
}

export function ArticleStructuredData({ article }: ArticleStructuredDataProps) {
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/article/${article.userId}/${article.slug || article.userId}`;
  const imageUrl = article.coverImage?.url
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}${article.coverImage.url}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/default-article-cover.jpg`;

  const articleData = {
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
      name: "Next.js Blog Platform",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/logo.png`,
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

  return <StructuredData data={articleData} />;
}

/**
 * Person Structured Data
 * Adds person/profile structured data for SEO
 */
interface PersonStructuredDataProps {
  person: {
    id: string;
    name?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    socialLinks?: {
      github?: string;
      x?: string;
      instagram?: string;
      rss?: string;
    };
  };
}

export function PersonStructuredData({ person }: PersonStructuredDataProps) {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name || `User ${person.id}`,
    description:
      person.bio ||
      `Read articles and stories by ${person.name || `User ${person.id}`}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/user/${person.id}`,
    ...(person.avatar && {
      image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}${person.avatar}`,
    }),
    ...(person.website && { url: person.website }),
    ...(person.socialLinks && {
      sameAs: Object.values(person.socialLinks).filter(Boolean),
    }),
  };

  return <StructuredData data={personData} />;
}
