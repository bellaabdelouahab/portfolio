import { useState, useEffect, useCallback } from "react";

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
    // The stacked green shadows stay an arbitrary value: at 0.05 alpha they are
    // a faint halo, not an elevation cue, so shadow-md would be a different
    // effect rather than a rounding of this one.
    <div className="mx-auto my-4 flex w-full flex-col gap-3 rounded-md border border-line p-2 shadow-[rgba(45,184,17,0.05)_0px_2px_8px,rgba(45,184,17,0.05)_0px_4px_12px,rgba(45,184,17,0.05)_0px_8px_28px] md:w-4/5 md:max-w-[1100px] md:p-3 md:pt-8">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className={NAV_BUTTON}
          onClick={goToPrev}
          aria-label="Previous image"
        >
          <ChevronIcon direction="left" />
        </button>

        {/* `group` replaces the old `.carousel__frame:hover .carousel__caption`
            descendant rule. */}
        <div className="group relative aspect-[4/3] flex-1 overflow-hidden rounded-md bg-black md:aspect-video">
          {carouselImages.map((img, index) => (
            <div
              key={img._id ?? index}
              className={[
                "absolute inset-0 bg-contain bg-center bg-no-repeat",
                "transition-[opacity,transform] duration-500 ease-standard",
                index === currentIndex ? "scale-100 opacity-100" : "scale-[1.02] opacity-0",
              ].join(" ")}
              style={{ backgroundImage: `url(${img.img})` }}
            />
          ))}
          {current?.title && (
            // Always visible below md — a hover-only caption is unreachable on
            // touch, which is what the old max-width:768px override said too.
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-4 py-3 opacity-100 transition-opacity duration-300 ease-standard md:opacity-0 md:group-hover:opacity-100">
              <p className="text-xs leading-snug font-normal text-ink-strong md:text-sm">
                {current.title}
              </p>
            </div>
          )}
          <div className="absolute top-2 right-2.5 rounded-full bg-black/60 px-1.5 py-0.5 text-xs leading-none text-ink">
            {currentIndex + 1} / {carouselImages.length}
          </div>
        </div>

        <button
          type="button"
          className={NAV_BUTTON}
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* The scrollbar is hidden through an arbitrary variant rather than a
          leftover stylesheet; ::-webkit-scrollbar is the only rule that would
          have kept this component's CSS file alive. */}
      <div className="flex justify-center gap-2.5 overflow-x-auto rounded-sm bg-surface-raised p-2.5 [&::-webkit-scrollbar]:hidden">
        {carouselImages.map((img, index) => (
          <button
            type="button"
            key={img._id ?? index}
            className={[
              "h-[70px] w-[100px] shrink-0 cursor-pointer overflow-hidden rounded-sm border-4 p-0",
              "transition-all duration-200 ease-standard md:h-[85px] md:w-[150px]",
              index === currentIndex
                ? "border-[#2db811] opacity-100"
                : "border-transparent opacity-55 hover:opacity-85",
            ].join(" ")}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          >
            <img
              src={img.img}
              alt={img.title || `Preview ${index + 1}`}
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const NAV_BUTTON = [
  "flex size-[26px] shrink-0 cursor-pointer items-center justify-center",
  "rounded-sm border border-transparent bg-transparent text-ink-strong",
  "transition-all duration-200 ease-standard md:size-8",
  "hover:border-[#2db811] hover:bg-[#2db811]/10 hover:text-[#2db811]",
].join(" ");

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
