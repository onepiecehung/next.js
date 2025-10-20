import { generatePageMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";
import { WriteClientWrapper } from "./write-client-wrapper";

/**
 * Generate metadata for write page
 */
export const metadata: Metadata = generatePageMetadata("write", "write", "en", {
  title: "Write Article",
  description:
    "Create and publish your articles with our rich text editor. Write, format, and share your stories with the world.",
  keywords: [
    "write",
    "article",
    "editor",
    "publish",
    "content creation",
    "blogging",
  ],
  url: "/write",
});

/**
 * Write Page Component (Server Component)
 * Allows authenticated users to write and publish articles
 *
 * This is a Server Component that can generate dynamic metadata
 * The actual writing interface and client-side interactions are handled by WriteClientWrapper
 */
export default function WritePage() {
  return <WriteClientWrapper />;
}
