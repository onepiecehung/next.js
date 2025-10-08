"use client";

import { TipTapEditor } from "@/components/features/text-editor";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/core/card";
import { useTranslation } from "@/i18n/config";
import { useState } from "react";

/**
 * Demo page for testing image upload functionality in TipTap editor
 * Users can paste images and see them automatically uploaded via API
 */
export default function ImageUploadDemoPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState(`
    <h2>Image Upload Demo</h2>
    <p>Try pasting images into this editor! They will be automatically uploaded via the media API.</p>
    <p>You can also use the image button in the toolbar to add images manually.</p>
  `);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleReset = () => {
    setContent(`
      <h2>Image Upload Demo</h2>
      <p>Try pasting images into this editor! They will be automatically uploaded via the media API.</p>
      <p>You can also use the image button in the toolbar to add images manually.</p>
    `);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">{t("demo.imageUpload.title")}</h1>
          <p className="text-muted-foreground text-lg">
            {t("demo.imageUpload.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("demo.imageUpload.editorTitle")}</CardTitle>
            <CardDescription>
              {t("demo.imageUpload.editorDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TipTapEditor
              content={content}
              onChange={handleContentChange}
              placeholder="Start writing and paste some images..."
              className="min-h-[500px]"
            />
            
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline">
                {t("demo.imageUpload.resetContent")}
              </Button>
              <Button 
                onClick={() => navigator.clipboard.writeText(content)}
                variant="outline"
              >
                {t("demo.imageUpload.copyHtml")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("demo.imageUpload.instructions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {t("demo.imageUpload.instructionsList", { returnObjects: true }).map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("demo.imageUpload.currentContent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted rounded-md p-4 text-xs overflow-x-auto">
              <code>{content}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
