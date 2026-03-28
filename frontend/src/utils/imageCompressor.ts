/**
 * Compresses an image file using the Canvas API.
 * - Resizes to fit within maxWidth × maxHeight (preserving aspect ratio)
 * - Re-encodes as JPEG at the given quality (PNG files stay PNG)
 * Returns a base64 data URL.
 */
export function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG for files that may have transparency; JPEG for everything else
        const outputType =
          file.type === "image/png" ? "image/png" : "image/jpeg";
        const outputQuality =
          file.type === "image/png" ? undefined : quality;

        resolve(canvas.toDataURL(outputType, outputQuality));
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
