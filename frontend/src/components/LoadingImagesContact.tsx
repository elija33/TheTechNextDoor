import { JSX, useState, useRef } from "react";
import "../style/LoadingImagesContact.css";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface LoadingImagesProps {
  maxImages?: number;
  disabled?: boolean;
  onImagesChange?: (images: File[]) => void;
}

function LoadingImagesContact({
  maxImages = 5,
  disabled = false,
  onImagesChange,
}: LoadingImagesProps): JSX.Element {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;

    const newImages: UploadedImage[] = [];
    const remainingSlots = maxImages - images.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        newImages.push({
          id: `${Date.now()}-${i}`,
          file,
          preview: URL.createObjectURL(file),
        });
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange?.(updatedImages.map((img) => img.file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesChange?.(updatedImages.map((img) => img.file));
  };

  return (
    <div className="upload-contact-container">
      <div className="upload-contact-header">
        <h2 className="upload-contact-title">Upload Your Phone Images</h2>
      </div>

      <div
        className={`upload-contact-dropzone ${isDragging ? "upload-contact-dropzone-active" : ""} ${disabled ? "upload-contact-dropzone-disabled" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="upload-contact-input"
          disabled={disabled}
        />

        <div className="upload-contact-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        <p className="upload-contact-text">
          Drag & drop images here or <span>click to browse</span>
        </p>
        <p className="upload-contact-hint">
          Upload up to {maxImages} images (JPG, PNG, GIF)
        </p>
      </div>

      {images.length > 0 && (
        <div className="upload-contact-preview-container">
          <p className="upload-contact-count">
            {images.length} of {maxImages} images uploaded
          </p>
          <div className="upload-contact-preview-grid">
            {images.map((image) => (
              <div key={image.id} className="upload-contact-preview-item">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="upload-contact-preview-img"
                />
                <button
                  type="button"
                  className="upload-contact-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  disabled={disabled}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadingImagesContact;
