"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeletonize } from "@/components/skeletonize";
import { useLoadingDelay } from "@/hooks/useLoadingDelay";

/**
 * Demo component that simulates data fetching and shows skeleton loading
 * Uses a 2-second artificial delay to demonstrate the skeleton effect
 */
export function SkeletonDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    stats: Array<{ label: string; value: string }>;
    avatar: string;
  } | null>(null);

  // Use loading delay to avoid flicker on very fast requests
  const isDelaying = useLoadingDelay(500);

  useEffect(() => {
    // Simulate data fetching with 2-second delay
    const fetchData = async () => {
      // Artificial delay to demonstrate skeleton loading
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setData({
        title: "Welcome to Auto Skeleton",
        subtitle: "A powerful loading solution",
        description:
          "This demo showcases how automatic skeleton loading preserves your existing DOM layout while providing beautiful shimmering placeholders during loading states. No more creating individual skeleton components for each element!",
        stats: [
          { label: "Components", value: "3" },
          { label: "CSS Classes", value: "15+" },
          { label: "Animation", value: "1.4s" },
          { label: "Accessibility", value: "100%" },
        ],
        avatar: "/avatar.png",
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Show skeleton while loading or during initial delay
  const shouldShowSkeleton = isLoading || isDelaying;

  return (
    <div className="space-y-8">
      {/* Demo explanation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-card-foreground mb-4">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              CSS-Based Approach
            </h3>
            <p className="text-muted-foreground text-sm">
              The{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                .skeletonize
              </code>{" "}
              class automatically converts text, images, and buttons into
              shimmering placeholders without changing the DOM structure.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              React Wrapper
            </h3>
            <p className="text-muted-foreground text-sm">
              Simply wrap your content with{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                &lt;Skeletonize loading&gt;
              </code>{" "}
              and the magic happens automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Main content demo */}
      <Skeletonize loading={shouldShowSkeleton}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {data?.title || "Loading..."}
              </h1>
              <p className="text-xl text-muted-foreground">
                {data?.subtitle || "Loading subtitle..."}
              </p>
            </div>

            <p className="text-foreground leading-relaxed">
              {data?.description || "Loading description..."}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {data?.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-card border border-border rounded-lg"
                >
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              )) ||
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="text-2xl font-bold text-foreground">-</div>
                    <div className="text-sm text-muted-foreground">
                      Loading...
                    </div>
                  </div>
                ))}
            </div>

            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>

          {/* Right column - Avatar and info */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted border-2 border-border">
                <Image
                  src={data?.avatar || "/avatar.png"}
                  alt="Demo Avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback for missing avatar
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML =
                      '<div class="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-4xl">👤</div>';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {data?.title ? "Demo User" : "Loading..."}
              </h3>
              <p className="text-muted-foreground">
                {data?.subtitle ? "Frontend Developer" : "Loading role..."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">
                Features
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Zero layout shifts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Automatic element detection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Accessibility compliant
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Tailwind CSS compatible
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Skeletonize>

      {/* Status indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <div
            className={`w-2 h-2 rounded-full ${shouldShowSkeleton ? "bg-yellow-500" : "bg-green-500"}`}
          ></div>
          <span className="text-sm text-muted-foreground">
            {shouldShowSkeleton
              ? "Loading with skeleton..."
              : "Content loaded successfully!"}
          </span>
        </div>
      </div>
    </div>
  );
}
