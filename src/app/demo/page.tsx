"use client";

import { Suspense } from "react";
import { SkeletonDemo } from "./skeleton-demo";
import { useI18n } from "@/components/providers";

/**
 * Internationalized Demo page showcasing the automatic skeleton loading technique
 * This page demonstrates how the same DOM structure can be used
 * for both loading and loaded states without layout shifts
 */
export default function DemoPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("demoTitle", "demo")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("demoDescription", "demo")}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-8">{t("demoLoading", "demo")}</div>
          }
        >
          <SkeletonDemo />
        </Suspense>
      </div>
    </div>
  );
}
