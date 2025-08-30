"use client";

import { useAtom } from "jotai";
import { currentUserAtom } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WritePage() {
  const [user] = useAtom(currentUserAtom);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  // Show loading or redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page.
          </p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Write Your Article
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter your article title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                placeholder="Start writing your article..."
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline">Save Draft</Button>
              <Button>Publish Article</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
