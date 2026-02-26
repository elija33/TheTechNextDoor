import { JSX, useState, useEffect } from "react";
import "../style/GetAQuoteImage.css";

interface QuoteImage {
  id: string;
  name: string;
  data: string;
}

function GetAQuoteImage(): JSX.Element {
  const [images, setImages] = useState<QuoteImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("quoteImages");
    if (saved) {
      setImages(JSON.parse(saved));
    }
  }, []);

  // Auto-rotate images if there are multiple
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

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
      </div>
    </div>
  );
}

export default GetAQuoteImage;
