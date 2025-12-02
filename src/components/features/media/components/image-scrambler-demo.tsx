"use client";

import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { MediaAPI, type UploadedMedia } from "@/lib/api/media";
import React, { useState } from "react";
import { ScrambledImageCanvas } from "./scrambled-image-canvas";

/**
 * Image Scrambler Demo Component
 *
 * Interactive demo for testing the image scrambler feature.
 * Allows users to upload images, see the scrambled version from the backend,
 * and view the unscrambled reconstruction using the client-side canvas.
 */
export function ImageScramblerDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * Handle file selection from input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);

    // Create preview URL for selected file
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  /**
   * Handle upload and scrambling process
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      // Check backend connectivity first
      console.log("Checking backend connectivity...");
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      console.log("Backend URL:", baseUrl);
      console.log(
        "Current frontend origin:",
        typeof window !== "undefined" ? window.location.origin : "SSR",
      );

      // Upload file using MediaAPI
      const uploadResponse = await MediaAPI.upload([selectedFile]);

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || "Upload failed");
      }

      const media = uploadResponse.data[0];

      console.log("Uploaded media:", media);
      console.log("Media URL:", media.url);
      if (!media || !media.id) {
        throw new Error("No media returned from upload");
      }

      setUploadedMedia(media);
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset the demo state
   */
  const handleReset = () => {
    setSelectedFile(null);
    setUploadedMedia(null);
    setUploadError(null);
    setPreviewUrl(null);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Image Scrambler Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload an image to see it scrambled by the backend and reconstructed
            on the client
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Original Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="file-input" className="block text-sm font-medium">
                Select Image File
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-medium
                         file:bg-primary file:text-primary-foreground
                         hover:file:bg-primary/90"
              />
            </div>

            {/* Preview of selected file */}
            {previewUrl && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Image Preview</h3>
                <div className="border rounded-lg overflow-hidden max-w-md">
                  <img
                    src={previewUrl}
                    alt="Selected file preview"
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Upload button */}
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 sm:flex-none"
              >
                {isUploading
                  ? "Uploading & Scrambling..."
                  : "Upload & Scramble"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isUploading}
              >
                Reset
              </Button>
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{uploadError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {uploadedMedia && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Scrambled Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  2. Scrambled Image (from Backend)
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {uploadedMedia.mimeType}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground break-all">
                    URL: {uploadedMedia.url}
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <Skeletonize loading={false}>
                      <img
                        src={uploadedMedia.url}
                        alt={`Scrambled version of ${uploadedMedia.originalName || uploadedMedia.name || "uploaded image"}`}
                        className="w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          console.error(
                            "Direct image load failed:",
                            uploadedMedia.url,
                            e,
                          );
                          // Show fallback message
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const fallback = img.parentElement?.querySelector(
                            ".image-fallback",
                          ) as HTMLElement;
                          if (fallback) fallback.style.display = "block";
                        }}
                        onLoad={() => {
                          console.log(
                            "Direct image loaded successfully:",
                            uploadedMedia.url,
                          );
                        }}
                      />
                      <div className="image-fallback hidden p-4 text-center text-sm text-muted-foreground bg-muted/50 rounded border">
                        <p>⚠️ Image failed to load</p>
                        <p className="mt-1 break-all text-xs font-mono">
                          {uploadedMedia.url}
                        </p>
                        <div className="flex gap-2 justify-center mt-2">
                          <a
                            href={uploadedMedia.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs"
                          >
                            Open in new tab
                          </a>
                          <button
                            onClick={async () => {
                              // Test CORS by trying to fetch the image
                              try {
                                const response = await fetch(
                                  uploadedMedia.url,
                                  {
                                    method: "HEAD",
                                    mode: "cors",
                                  },
                                );

                                const corsHeaders = {
                                  "Access-Control-Allow-Origin":
                                    response.headers.get(
                                      "Access-Control-Allow-Origin",
                                    ),
                                  "Access-Control-Allow-Methods":
                                    response.headers.get(
                                      "Access-Control-Allow-Methods",
                                    ),
                                  "Access-Control-Allow-Headers":
                                    response.headers.get(
                                      "Access-Control-Allow-Headers",
                                    ),
                                };

                                const currentOrigin = window.location.origin;
                                const originMatch =
                                  corsHeaders["Access-Control-Allow-Origin"] ===
                                    currentOrigin ||
                                  corsHeaders["Access-Control-Allow-Origin"] ===
                                    "*";

                                if (response.ok && originMatch) {
                                  const methods =
                                    corsHeaders[
                                      "Access-Control-Allow-Methods"
                                    ] || "";
                                  const hasOptions = methods
                                    .toUpperCase()
                                    .includes("OPTIONS");

                                  let message = "✅ CORS test passed!\n\n";
                                  message += `Origin: ${corsHeaders["Access-Control-Allow-Origin"]}\n`;
                                  message += `Methods: ${methods}\n`;
                                  message += hasOptions
                                    ? "✅ OPTIONS method included\n"
                                    : "⚠️ OPTIONS method missing\n";

                                  if (hasOptions) {
                                    message +=
                                      "\nReloading page to retry image loading...";
                                    setTimeout(
                                      () => window.location.reload(),
                                      2000,
                                    );
                                  } else {
                                    message +=
                                      "\n⚠️ Please add OPTIONS to AllowedMethods in R2 CORS config.";
                                  }

                                  alert(message);
                                } else {
                                  let message = "❌ CORS test failed!\n\n";
                                  message += `Expected origin: ${currentOrigin}\n`;
                                  message += `Received: ${corsHeaders["Access-Control-Allow-Origin"] || "None"}\n\n`;
                                  message += "Possible issues:\n";
                                  message += "1. CORS config not saved in R2\n";
                                  message +=
                                    "2. CORS config not yet propagated (wait 1-5 min)\n";
                                  message +=
                                    "3. Origin mismatch in AllowedOrigins";
                                  alert(message);
                                }
                              } catch (error: unknown) {
                                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                                alert(
                                  `❌ CORS test failed: ${errorMessage}\n\nThis usually means:\n1. CORS not configured\n2. CORS not yet propagated (wait 1-5 min)\n3. Network error`,
                                );
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Test CORS
                          </button>
                        </div>
                      </div>
                    </Skeletonize>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is how the image appears when stored on the server
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Unscrambled Image */}
            <Card>
              <CardHeader>
                <CardTitle>
                  3. Unscrambled Image (Client Reconstruction)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Reconstructed using permutation seed from backend
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <ScrambledImageCanvas
                      mediaId={uploadedMedia.id}
                      src={uploadedMedia.url}
                      alt={`Unscrambled version of ${uploadedMedia.originalName || uploadedMedia.name || "uploaded image"}`}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This shows the original image reconstructed on the client
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        {!uploadedMedia && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium">How it works</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    1. Upload an image - the backend scrambles it into tiles
                  </p>
                  <p>2. View the scrambled version stored on the server</p>
                  <p>3. See the client reconstruct the original image</p>
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      ⚠️ CORS Configuration Issue
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Your CDN is configured to allow CORS from specific
                      origins, but requests are being blocked. Current
                      configuration:
                    </p>
                    <code className="block mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded border">
                      AllowedOrigins: [<br />
                      &nbsp;&nbsp;&quot;http://localhost:3000&quot;,
                      <br />
                      &nbsp;&nbsp;&quot;http://localhost:3001&quot;
                      <br />
                      ]<br />
                      AllowedMethods: [&quot;GET&quot;, &quot;HEAD&quot;, &quot;POST&quot;]
                      <br />
                      AllowedHeaders: [&quot;*&quot;]
                    </code>
                    <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
                      <p>
                        <strong>Solutions:</strong>
                      </p>
                      <p>
                        1. Update CDN CORS to include your current frontend
                        origin
                      </p>
                      <p>
                        2. Or temporarily allow all origins: <code>&quot;*&quot;</code>{" "}
                        (not recommended for production)
                      </p>
                      <p>
                        3. Or run frontend on port 3000 to match CORS config
                      </p>
                      <p className="mt-1 text-yellow-600 dark:text-yellow-400">
                        Check browser console for your current frontend origin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
