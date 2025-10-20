# Dynamic Metadata System for SEO

Hệ thống metadata động này được thiết kế để cung cấp SEO tối ưu cho từng page trong ứng dụng Next.js 15+.

## 🚀 Tính năng chính

- **Dynamic Metadata**: Tự động tạo metadata dựa trên dữ liệu thực tế
- **Structured Data**: JSON-LD structured data cho search engines
- **Open Graph**: Hỗ trợ đầy đủ Open Graph cho social sharing
- **Twitter Cards**: Twitter Card metadata
- **i18n Support**: Hỗ trợ đa ngôn ngữ cho metadata
- **Type Safety**: TypeScript support đầy đủ

## 📁 Cấu trúc files

```
src/
├── lib/utils/metadata.ts              # Core metadata utilities
├── components/ui/utilities/
│   └── structured-data.tsx             # Structured data components
├── app/
│   ├── layout.tsx                      # Root layout với default metadata
│   ├── page.tsx                        # Home page (client component)
│   ├── article/[article_id]/[article_slug]/
│   │   ├── page.tsx                   # Article page (client component)
│   │   ├── page-server.tsx            # Server component version với metadata
│   │   └── article-client-wrapper.tsx # Client wrapper
│   ├── user/[user_id]/
│   │   ├── page.tsx                   # User page (client component)
│   │   ├── page-server.tsx            # Server component version với metadata
│   │   └── user-profile-client-wrapper.tsx # Client wrapper
│   └── auth/login/
│       ├── page.tsx                   # Login page (client component)
│       ├── page-server.tsx            # Server component version với metadata
│       └── login-client-wrapper.tsx   # Client wrapper
```

## 🛠️ Cách sử dụng

### 1. Server Component với Dynamic Metadata

```tsx
// app/article/[article_id]/[article_slug]/page.tsx
import { generateArticleMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { article_id: string; article_slug: string };
}): Promise<Metadata> {
  const { article_id } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${article_id}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return generateArticleMetadata({
        title: "Article Not Found",
        content: "The requested article could not be found.",
        userId: article_id,
      });
    }

    const article = await response.json();
    return generateArticleMetadata(article);
  } catch (error) {
    return generateArticleMetadata({
      title: "Article",
      content: "Loading article content...",
      userId: article_id,
    });
  }
}

export default async function ArticlePage({ params }: { params: { article_id: string; article_slug: string } }) {
  // Server component logic
}
```

### 2. Static Metadata cho các page đơn giản

```tsx
// app/write/page.tsx
import { generatePageMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(
  "write",
  "write",
  "en",
  {
    title: "Write Article",
    description: "Create and publish your articles with our rich text editor.",
    keywords: ["write", "article", "editor", "publish"],
    url: "/write",
  }
);
```

### 3. Structured Data Components

```tsx
// Trong component
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/ui/utilities/structured-data";

export default function ArticlePage({ article }: { article: Article }) {
  return (
    <>
      {/* Structured Data */}
      <ArticleStructuredData article={article} />
      <BreadcrumbStructuredData 
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Articles", url: "/articles" },
          { name: article.title, url: `/article/${article.id}` }
        ]} 
      />
      
      {/* Page content */}
      <div>...</div>
    </>
  );
}
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
```

### Site Configuration

```tsx
// lib/utils/metadata.ts
export const SITE_CONFIG = {
  name: "Your Site Name",
  description: "Your site description",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
  twitterSite: "@your-twitter-handle",
  keywords: ["your", "keywords"],
} as const;
```

## 📊 Metadata Types

### Article Metadata
- Title với article title
- Description từ content (160 chars)
- Open Graph image từ cover image
- Published/modified dates
- Author information
- Tags và keywords
- Reading time và word count

### User Profile Metadata
- Title với user name
- Description từ bio
- Profile image
- Social links
- Author information

### Page Metadata
- Dynamic title dựa trên i18n
- Custom description
- Keywords
- Open Graph data
- Twitter Card data

## 🎯 SEO Best Practices

### 1. Title Tags
- Giới hạn 60 characters
- Bao gồm brand name
- Unique cho mỗi page
- Descriptive và relevant

### 2. Meta Descriptions
- Giới hạn 160 characters
- Compelling và actionable
- Bao gồm keywords
- Unique cho mỗi page

### 3. Open Graph
- Image size: 1200x630px
- Alt text descriptive
- Title và description optimized
- URL canonical

### 4. Structured Data
- JSON-LD format
- Valid schema.org markup
- Rich snippets support
- Breadcrumb navigation

## 🔄 Migration từ Client Components

### Before (Client Component)
```tsx
"use client";

export default function ArticlePage() {
  // Client-side logic
  return <div>...</div>;
}
```

### After (Server Component với Metadata)
```tsx
// page.tsx (Server Component)
import { generateArticleMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { article_id: string } }): Promise<Metadata> {
  // Generate metadata logic
}

export default async function ArticlePage({ params }: { params: { article_id: string } }) {
  return <ArticleClientWrapper articleId={params.article_id} />;
}

// article-client-wrapper.tsx (Client Component)
"use client";

export function ArticleClientWrapper({ articleId }: { articleId: string }) {
  // Client-side logic
  return <div>...</div>;
}
```

## 🧪 Testing

### 1. Metadata Testing
```bash
# Kiểm tra metadata trong browser dev tools
# Hoặc sử dụng tools như:
# - Google Rich Results Test
# - Facebook Sharing Debugger
# - Twitter Card Validator
```

### 2. Structured Data Testing
```bash
# Google Rich Results Test
https://search.google.com/test/rich-results

# Schema.org Validator
https://validator.schema.org/
```

## 📈 Performance Considerations

### 1. Caching
- Server-side metadata được cache với `next: { revalidate: 60 }`
- Client-side data fetching với React Query
- Static metadata cho các page không thay đổi

### 2. Bundle Size
- Metadata utilities được tree-shake
- Structured data components lightweight
- No client-side metadata generation

## 🚨 Common Issues

### 1. Hydration Mismatch
```tsx
// Sử dụng useIsMounted hook
const isMounted = useIsMounted();
if (!isMounted) return <div>Loading...</div>;
```

### 2. Dynamic Routes
```tsx
// Đảm bảo params type safety
export async function generateMetadata({
  params,
}: {
  params: { article_id: string; article_slug: string };
}): Promise<Metadata> {
  // Logic
}
```

### 3. Error Handling
```tsx
// Fallback metadata khi API fail
try {
  const article = await fetchArticle(params.article_id);
  return generateArticleMetadata(article);
} catch (error) {
  return generateArticleMetadata({
    title: "Article Not Found",
    content: "The requested article could not be found.",
    userId: params.article_id,
  });
}
```

## 🔮 Future Enhancements

- [ ] Automatic sitemap generation
- [ ] RSS feed metadata
- [ ] Multi-language metadata
- [ ] Advanced structured data (FAQ, How-to, etc.)
- [ ] Performance monitoring
- [ ] SEO analytics integration
