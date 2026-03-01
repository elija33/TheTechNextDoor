import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JSX } from "react/jsx-runtime";
import { getCarouselImages } from "../utils/carouselStorage";
import "../style/carousel.css";

function Carousel(): JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  // Load uploaded images from IndexedDB
  useEffect(() => {
    getCarouselImages().then((stored) => {
      if (stored.length > 0) {
        setImages(stored.map((img) => img.data));
      }
    });
  }, []);

  const next = useCallback((): void => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback((): void => {
    setCurrent(
      (prev) => (prev - 1 + images.length) % images.length,
    );
  }, [images.length]);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Show fallback hero when no images have been uploaded yet
  if (images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div
            className="carousel"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e3a5f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "1rem",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <img
              src="logo.png"
              alt="The Tech Next Door"
              style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "50%", background: "rgba(255,255,255,0.1)", padding: "0.5rem" }}
            />
            <h1 style={{ color: "#ffffff", fontSize: "2.5rem", fontWeight: 700, fontFamily: "serif", margin: 0 }}>
              The Tech Next Door
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "500px", margin: 0 }}>
              Professional phone repair services in Columbus, Ohio. Fast, reliable, and affordable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel">
          {/* Carousel Images */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                className={idx === current ? "carousel-slide-active" : ""}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: idx === current ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                  zIndex: idx === current ? 1 : 0,
                }}
              >
                <img
                  src={img}
                  alt={`Slide ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="carousel-nav carousel-prev"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="carousel-nav carousel-next"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "0.5rem",
              zIndex: 10,
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`carousel-dot ${idx === current ? "active" : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
