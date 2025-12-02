"use client";

import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import { LanguageSwitcher } from "@/components/ui/navigation/language-switcher";
import { ThemeSelector } from "@/components/ui/theme/theme-selector";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { useAppearanceSettings } from "@/hooks/settings";

/**
 * Appearance Settings Component
 * Handles theme, language, and display preferences
 */
export function AppearanceSettings() {
  const { t } = useI18n();
  const { appearance, updateAppearance, isUpdating } = useAppearanceSettings();
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleThemeConfirm = (theme: string) => {
    updateAppearance({ theme });
    setPreviewTheme(null);
  };

  const handleThemeCancel = () => {
    // Revert to current theme
    if (appearance?.theme) {
      document.documentElement.setAttribute("data-theme", appearance.theme);
    }
    setPreviewTheme(null);
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearanceTheme", "settings")}</CardTitle>
          <CardDescription>
            {t("appearanceThemeDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {t("appearanceColorScheme", "settings")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("appearanceColorSchemeDescription", "settings")}
              </p>
            </div>
            <ThemeToggle />
          </div>

          <Separator />

          {/* Theme Color Selection */}
          <div>
            <h4 className="font-medium mb-3">
              {t("appearanceThemeColor", "settings")}
            </h4>
            <ThemeSelector />

            {previewTheme && previewTheme !== appearance?.theme && (
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleThemeConfirm(previewTheme)}
                  disabled={isUpdating}
                >
                  {t("appearanceApplyTheme", "settings")}
                </Button>
                <Button size="sm" variant="outline" onClick={handleThemeCancel}>
                  {t("appearanceCancelTheme", "settings")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearanceLanguage", "settings")}</CardTitle>
          <CardDescription>
            {t("appearanceLanguageDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {t("appearanceLanguageSelect", "settings")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("appearanceLanguageSelectDescription", "settings")}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Editor Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearanceEditor", "settings")}</CardTitle>
          <CardDescription>
            {t("appearanceEditorDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("appearanceEditorComingSoon", "settings")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearanceDisplay", "settings")}</CardTitle>
          <CardDescription>
            {t("appearanceDisplayDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("appearanceDisplayComingSoon", "settings")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
