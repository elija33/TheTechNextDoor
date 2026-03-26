import { JSX, useState, useEffect } from "react";
import { quoteImagesApi } from "../services/api";
import "../style/GetAQuoteImage.css";

interface QuoteImage {
  id: string;
  name: string;
  data: string;
}

function GetAQuoteImage(): JSX.Element {
  const [images, setImages] = useState<QuoteImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    quoteImagesApi.getAll().then((res) => setImages(res.data)).catch(() => {});
  }, []);

  // Auto-rotate images if there are multiple and not paused
  useEffect(() => {
    if (images.length <= 1 || paused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, paused]);

  // Don't render if no images uploaded
  if (images.length === 0) {
    return <></>;
  }

  return (
    <div className="quote-image-container">
      <div className="quote-image-wrapper">
        <img
          src={images[currentIndex]?.data}
          alt="Device repairs"
          className="quote-image"
        />
        <div className="quote-image-overlay"></div>
        {images.length > 1 && (
          <button
            className="quote-image-pause-btn"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default GetAQuoteImage;
