import { useState, useEffect, useCallback } from "react";
import "./Carousel.css";

export default function Carousel({ carouselImages }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = useCallback(() => {
    if (!carouselImages?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1,
    );
  }, [carouselImages]);

  const goToNext = useCallback(() => {
    if (!carouselImages?.length) return;
    setCurrentIndex((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1,
    );
  }, [carouselImages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  if (!carouselImages || carouselImages.length === 0) return null;

  const current = carouselImages[currentIndex];

  return (
    <div className="carousel">
      <div className="carousel__stage">
        <button
          type="button"
          className="carousel__nav carousel__nav--prev"
          onClick={goToPrev}
          aria-label="Previous image"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="carousel__frame">
          {carouselImages.map((img, index) => (
            <div
              key={img._id ?? index}
              className={`carousel__slide ${index === currentIndex ? "carousel__slide--active" : ""}`}
              style={{ backgroundImage: `url(${img.img})` }}
            />
          ))}
          {current?.title && (
            <div className="carousel__caption">
              <p>{current.title}</p>
            </div>
          )}
          <div className="carousel__counter">
            {currentIndex + 1} / {carouselImages.length}
          </div>
        </div>

        <button
          type="button"
          className="carousel__nav carousel__nav--next"
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <div className="carousel__thumbs">
        {carouselImages.map((img, index) => (
          <button
            type="button"
            key={img._id ?? index}
            className={`carousel__thumb ${index === currentIndex ? "carousel__thumb--active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          >
            <img src={img.img} alt={img.title || `Preview ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === "right" ? "rotate(180deg)" : "none" }}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}
