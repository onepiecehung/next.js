import { UploadedMedia } from "@/lib/api/media";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

interface ImageUploadOptions {
  onUpload: (files: File[]) => Promise<UploadedMedia[]>;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  onUploadError?: (error: string) => void;
}

/**
 * TipTap extension for handling image uploads on paste
 * Automatically uploads pasted images via API and replaces with uploaded URLs
 */
export const ImageUploadExtension = Extension.create<ImageUploadOptions>({
  name: "imageUpload",

  addOptions() {
    return {
      onUpload: () => Promise.resolve([]),
      onUploadStart: () => {},
      onUploadEnd: () => {},
      onUploadError: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { onUpload, onUploadStart, onUploadEnd, onUploadError } =
      this.options;

    return [
      new Plugin({
        key: new PluginKey("imageUpload"),
        props: {
          handlePaste: (view, event) => {
            const items = event.clipboardData?.items;
            if (!items) return false;

            const imageFiles: File[] = [];

            // Extract image files from clipboard
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) {
                  imageFiles.push(file);
                }
              }
            }

            if (imageFiles.length === 0) return false;

            // Prevent default paste behavior
            event.preventDefault();

            // Start upload process
            onUploadStart?.();

            // Upload images
            onUpload(imageFiles)
              .then((uploadedMedia) => {
                if (uploadedMedia.length > 0) {
                  // Insert uploaded images into editor
                  const { state, dispatch } = view;
                  const { tr } = state;

                  uploadedMedia.forEach((media) => {
                    const imageNode = state.schema.nodes.customImage.create({
                      src: media.url,
                      alt: media.originalName || media.name || "Uploaded image",
                      title:
                        media.originalName || media.name || "Uploaded image",
                    });
                    tr.insert(tr.selection.from, imageNode);
                  });

                  dispatch(tr);
                }
                onUploadEnd?.();
              })
              .catch((error) => {
                const errorMessage =
                  error instanceof Error ? error.message : "Upload failed";
                onUploadError?.(errorMessage);
                onUploadEnd?.();
              });

            return true;
          },
        },
      }),
    ];
  },
});
