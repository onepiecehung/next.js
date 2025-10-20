import { generateUserMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserProfileClientWrapper } from "./user-profile-client-wrapper";

/**
 * Generate dynamic metadata for user profile pages
 * This function runs on the server and fetches user data to generate SEO metadata
 */
export async function generateMetadata({
  params,
}: {
  params: { user_id: string };
}): Promise<Metadata> {
  const { user_id } = params;

  try {
    // Fetch user data for metadata generation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!response.ok) {
      // Return default metadata if user not found
      return generateUserMetadata({
        id: user_id,
        name: `User ${user_id}`,
      });
    }

    const user = await response.json();

    return generateUserMetadata(user);
  } catch (error) {
    console.error("Error generating user metadata:", error);

    // Return default metadata on error
    return generateUserMetadata({
      id: user_id,
      name: `User ${user_id}`,
    });
  }
}

/**
 * User Profile Page Component (Server Component)
 * Displays user profile information with tabs for different content types
 *
 * This is a Server Component that can generate dynamic metadata
 * The actual user data fetching and client-side interactions are handled by UserProfileClientWrapper
 */
export default async function UserProfilePage({
  params,
}: {
  params: { user_id: string };
}) {
  const { user_id } = params;

  try {
    // Fetch user data on the server for initial render
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_id}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!response.ok) {
      notFound();
    }

    const user = await response.json();

    return <UserProfileClientWrapper initialUser={user} userId={user_id} />;
  } catch (error) {
    console.error("Error loading user profile:", error);
    notFound();
  }
}
