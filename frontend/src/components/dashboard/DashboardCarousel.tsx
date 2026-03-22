import React, { useState, useRef, useEffect } from "react";
import { JSX } from "react";
import { Upload, Trash2 } from "lucide-react";
import { CarouselImage, getCarouselImages, saveCarouselImages } from "../../utils/carouselStorage";
import { quoteImagesApi } from "../../services/api";
import "../../style/DashboardCarousel.css";

interface QuoteImage {
  id: string;
  name: string;
  data: string;
}

function DashboardCarousel(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"carousel" | "quote">("carousel");

  // Carousel Images state
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get A Quote Images state
  const [quoteImages, setQuoteImages] = useState<QuoteImage[]>([]);
  const [hasQuoteChanges, setHasQuoteChanges] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const quoteFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCarouselImages().then(setImages);
    quoteImagesApi.getAll().then((res) => setQuoteImages(res.data)).catch(() => {});
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: CarouselImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          data: reader.result as string,
        };
        setImages((prev) => [...prev, newImage]);
        setHasChanges(true);
        setSubmitted(false);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setHasChanges(true);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    await saveCarouselImages(images);
    setHasChanges(false);
    setSubmitted(true);
  };

  // Quote image handlers
  const handleQuoteUploadClick = () => {
    quoteFileInputRef.current?.click();
  };

  const handleQuoteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: QuoteImage = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
          name: file.name,
          data: reader.result as string,
        };
        setQuoteImages((prev) => [...prev, newImage]);
        setHasQuoteChanges(true);
        setQuoteSubmitted(false);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleQuoteDelete = (id: string) => {
    setQuoteImages((prev) => prev.filter((img) => img.id !== id));
    setHasQuoteChanges(true);
    setQuoteSubmitted(false);
  };

  const handleQuoteSubmit = async () => {
    await quoteImagesApi.saveAll(quoteImages);
    setHasQuoteChanges(false);
    setQuoteSubmitted(true);
  };

  return (
    <div className="carousel-page">
      <div className="carousel-tabs">
        <button
          className={`carousel-tab ${activeTab === "carousel" ? "active" : ""}`}
          onClick={() => setActiveTab("carousel")}
        >
          Carousel Images
        </button>
        <button
          className={`carousel-tab ${activeTab === "quote" ? "active" : ""}`}
          onClick={() => setActiveTab("quote")}
        >
          Get A Quote
        </button>
      </div>

      {activeTab === "carousel" && (
        <>
          <div className="carousel-page-header">
            <h2>Carousel Images ({images.length})</h2>
          </div>

          <div className="carousel-upload-area" onClick={handleUploadClick}>
            <div className="carousel-upload-icon">
              <Upload size={40} />
            </div>
            <p className="carousel-upload-text">Click to upload images</p>
            <p className="carousel-upload-hint">PNG, JPG or WEBP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="carousel-upload-input"
              onChange={handleFileChange}
            />
          </div>

          {images.length > 0 ? (
            <div className="carousel-images-grid">
              {images.map((image) => (
                <div className="carousel-image-card" key={image.id}>
                  <img
                    src={image.data}
                    alt={image.name}
                    className="carousel-image-preview"
                  />
                  <div className="carousel-image-footer">
                    <span className="carousel-image-name">{image.name}</span>
                    <button
                      className="carousel-image-delete"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="carousel-empty">
              No carousel images uploaded yet. Upload images above and they will appear on the home page carousel.
            </div>
          )}

          {images.length > 0 && (
            <div className="carousel-submit-area">
              <button
                className="carousel-submit-btn"
                onClick={handleSubmit}
                disabled={!hasChanges}
              >
                Submit
              </button>
              {submitted && <p className="carousel-submit-success">Carousel images saved successfully!</p>}
            </div>
          )}
        </>
      )}

      {activeTab === "quote" && (
        <>
          <div className="carousel-page-header">
            <h2>Get A Quote Images ({quoteImages.length})</h2>
          </div>

          <div className="carousel-upload-area" onClick={handleQuoteUploadClick}>
            <div className="carousel-upload-icon">
              <Upload size={40} />
            </div>
            <p className="carousel-upload-text">Click to upload images for Get A Quote page</p>
            <p className="carousel-upload-hint">PNG, JPG or WEBP</p>
            <input
              ref={quoteFileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="carousel-upload-input"
              onChange={handleQuoteFileChange}
            />
          </div>

          {quoteImages.length > 0 ? (
            <div className="carousel-images-grid">
              {quoteImages.map((image) => (
                <div className="carousel-image-card" key={image.id}>
                  <img
                    src={image.data}
                    alt={image.name}
                    className="carousel-image-preview"
                  />
                  <div className="carousel-image-footer">
                    <span className="carousel-image-name">{image.name}</span>
                    <button
                      className="carousel-image-delete"
                      onClick={() => handleQuoteDelete(image.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="carousel-empty">
              No images uploaded yet. Upload images above and they will appear on the Get A Quote page.
            </div>
          )}

          {quoteImages.length > 0 && (
            <div className="carousel-submit-area">
              <button
                className="carousel-submit-btn"
                onClick={handleQuoteSubmit}
                disabled={!hasQuoteChanges}
              >
                Submit
              </button>
              {quoteSubmitted && <p className="carousel-submit-success">Quote images saved successfully!</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardCarousel;
