"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "../shadcn-io/image-crop";

interface ImageCropDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (croppedFile: File) => void;
  readonly imageFile: File | null;
  readonly aspectRatio?: number;
}

/**
 * Image Crop Dialog using shadcn/ui ImageCrop component
 * Provides professional image cropping with fixed aspect ratio
 */
export function ImageCropDialog({
  isOpen,
  onClose,
  onSave,
  imageFile,
  aspectRatio = 16 / 9,
}: ImageCropDialogProps) {
  const { t } = useI18n();
  const [croppedImage, setCroppedImage] = React.useState<string | null>(null);

  const handleCrop = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
  };

  const handleSave = () => {
    if (croppedImage && imageFile) {
      // Convert data URL to File
      fetch(croppedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], imageFile.name, { type: 'image/jpeg' });
          onSave(file);
          onClose();
        });
    }
  };

  const handleReset = () => {
    setCroppedImage(null);
  };

  if (!imageFile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("imageEditorTitle", "write")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {croppedImage ? (
            <div className="space-y-4">
              <div className="text-center">
                <Image
                  src={croppedImage}
                  alt="Cropped"
                  width={1280}
                  height={720}
                  className="max-w-full h-auto max-h-96 mx-auto rounded"
                  unoptimized
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={handleSave}>
                  {t("imageEditorSave", "write")}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  {t("imageEditorCancel", "write")}
                </Button>
              </div>
            </div>
          ) : (
            <ImageCrop
              aspect={aspectRatio}
              file={imageFile}
              maxImageSize={1024 * 1024 * 5} // 5MB
              onCrop={handleCrop}
            >
              <ImageCropContent className="max-w-2xl mx-auto" />
              <div className="flex items-center justify-center gap-2 mt-4">
                <ImageCropApply asChild>
                  <Button>{t("imageEditorCrop", "write")}</Button>
                </ImageCropApply>
                <ImageCropReset asChild>
                  <Button variant="secondary">{t("imageEditorReset", "write")}</Button>
                </ImageCropReset>
                <Button variant="outline" onClick={onClose}>
                  {t("imageEditorCancel", "write")}
                </Button>
              </div>
            </ImageCrop>
          )}
          
          <div className="text-sm text-muted-foreground text-center">
            {t("imageEditorInstructions", "write").replace("{ratio}", aspectRatio.toFixed(1))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
