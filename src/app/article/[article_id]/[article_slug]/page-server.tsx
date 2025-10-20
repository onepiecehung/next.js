import {
  generateArticleMetadata,
  generateArticleStructuredData,
} from "@/lib/utils/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleClientWrapper } from "./article-client-wrapper";

/**
 * Generate dynamic metadata for article pages
 * This function runs on the server and fetches article data to generate SEO metadata
 */
export async function generateMetadata({
  params,
}: {
  params: { article_id: string; article_slug: string };
}): Promise<Metadata> {
  const { article_id } = params;

  try {
    // Fetch article data for metadata generation
    // In a real app, this would be an API call or database query
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${article_id}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      },
    );

    if (!response.ok) {
      // Return default metadata if article not found
      return generateArticleMetadata({
        title: "Article Not Found",
        content: "The requested article could not be found.",
        userId: article_id,
      });
    }

    const article = await response.json();

    return generateArticleMetadata(article);
  } catch (error) {
    console.error("Error generating article metadata:", error);

    // Return default metadata on error
    return generateArticleMetadata({
      title: "Article",
      content: "Loading article content...",
      userId: article_id,
    });
  }
}

/**
 * Article View Page Component (Server Component)
 * Displays a single article with full content, metadata, and author information
 * URL pattern: /article/[article_id]/[article_slug]
 * Layout inspired by note.jp design
 *
 * This is a Server Component that can generate dynamic metadata
 * The actual article data fetching and client-side interactions are handled by ArticleClientWrapper
 */
export default async function ArticleViewPage({
  params,
}: {
  params: { article_id: string; article_slug: string };
}) {
  const { article_id } = params;

  try {
    // Fetch article data on the server for initial render
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${article_id}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      },
    );

    if (!response.ok) {
      notFound();
    }

    const article = await response.json();

    // Generate structured data for SEO
    const structuredData = generateArticleStructuredData(article);

    return (
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Client-side wrapper for interactive features */}
        <ArticleClientWrapper initialArticle={article} articleId={article_id} />
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
