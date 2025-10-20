import { SiteNav } from "@/components/features/navigation";
import AuthProvider from "@/components/providers/auth-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { NoSSR } from "@/components/providers/no-ssr";
import RateLimitProvider from "@/components/providers/rate-limit-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui";
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/ui/utilities/structured-data";
import { generateMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata({
  title: "Next.js Blog Platform",
  description:
    "A modern blogging platform built with Next.js 15, featuring rich text editing, theming, and multi-language support. Write, publish, and share your stories with the world.",
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
    "modern web",
    "content creation",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Structured Data for SEO */}
        <WebsiteStructuredData />
        <OrganizationStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <NoSSR>
          <ReactQueryProvider>
            <I18nProvider>
              <ThemeProvider>
                <AuthProvider>
                  <LoadingProvider>
                    <RateLimitProvider>
                      <SiteNav />
                      {children}
                    </RateLimitProvider>
                  </LoadingProvider>
                </AuthProvider>
              </ThemeProvider>
            </I18nProvider>
          </ReactQueryProvider>
        </NoSSR>
        <Toaster richColors position="top-center" expand={true} />
      </body>
    </html>
  );
}
