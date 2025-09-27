"use client";

import React, { useState } from "react";
import { Button, Input, Label } from "@/components/ui/primitives";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { Image as ImageIcon } from "lucide-react";

/**
 * Image Dialog Component
 * Beautiful popup dialog for adding images to the editor
 */
interface ImageDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAddImage: (url: string) => void;
}

export function ImageDialog({ isOpen, onClose, onAddImage }: ImageDialogProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    if (!url.trim()) {
      setError("Please enter an image URL");
      return;
    }

    // Check if URL has protocol, if not add https://
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    // Basic URL validation
    try {
      new URL(finalUrl);
      onAddImage(finalUrl);
      setUrl("");
      setError("");
      onClose();
    } catch {
      setError("Please enter a valid image URL");
    }
  };

  const handleClose = () => {
    setUrl("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Add Image
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              className={
                error
                  ? "border-destructive focus-visible:ring-destructive/50"
                  : ""
              }
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Image</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
