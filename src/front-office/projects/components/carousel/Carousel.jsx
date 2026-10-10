import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useT } from "../../../../shared/i18n/strings";
import {
  faChevronLeft,
  faChevronRight,
  faExpand,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ARROW =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-success";

/**
 * Screenshot viewer: one large image, previous/next arrows, a thumbnail strip,
 * swipe on touch, arrow keys, and a full-screen view on click. Images are shown
 * whole (object-contain) because they are screenshots, and cropping a UI hides
 * the part the client wants to see.
 */
export default function Carousel({ carouselImages = [] }) {
  const t = useT();
  const images = carouselImages.filter((i) => i?.img);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchX = useRef(null);
  const thumbs = useRef(null);
  const count = images.length;

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  // Keep the active thumbnail in view without scrolling the whole page.
  useEffect(() => {
    const el = thumbs.current?.children[index];
    if (el && thumbs.current) {
      thumbs.current.scrollTo({
        left: el.offsetLeft - thumbs.current.clientWidth / 2 + el.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [index]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  if (count === 0) return null;
  const current = images[index];

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("car.region")}
      className="w-full"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-md border border-line bg-main"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("car.open")}
          className="absolute inset-0 cursor-zoom-in"
        >
          <img loading="lazy" decoding="async"
            key={current.img}
            src={current.img}
            alt={current.title || `Screenshot ${index + 1}`}
            className="h-full w-full object-contain"
          />
        </button>
        {count > 1 && (
          <>
            <button type="button" aria-label={t("car.prev")} onClick={() => go(-1)} className={`${ARROW} left-3`}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button type="button" aria-label={t("car.next")} onClick={() => go(1)} className={`${ARROW} right-3`}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 pt-10 pb-3 text-sm text-white">
          <span>{current.title}</span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="tabular-nums opacity-80">{index + 1} / {count}</span>
            <FontAwesomeIcon icon={faExpand} className="opacity-70" />
          </span>
        </div>
      </div>

      {count > 1 && (
        <div ref={thumbs} className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((img, i) => (
            <button
              key={img.img}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}${img.title ? `: ${img.title}` : ""}`}
              aria-current={i === index}
              className={[
                "h-16 w-28 shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 bg-main transition-opacity",
                i === index ? "border-success opacity-100" : "border-transparent opacity-60 hover:opacity-100",
              ].join(" ")}
            >
              <img src={img.img} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("car.viewer")}
          className="fixed inset-0 z-[1000] flex flex-col bg-black/95"
          onClick={() => setOpen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-5 py-3 text-sm text-white">
            <span>{current.title} <span className="ml-2 opacity-60">{index + 1} / {count}</span></span>
            <button type="button" aria-label={t("car.close")} onClick={() => setOpen(false)} className="cursor-pointer text-xl">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <img loading="lazy" decoding="async" src={current.img} alt={current.title || ""} className="max-h-full max-w-full object-contain" />
            {count > 1 && (
              <>
                <button type="button" aria-label={t("car.prev")} onClick={() => go(-1)} className={`${ARROW} left-4`}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button type="button" aria-label={t("car.next")} onClick={() => go(1)} className={`${ARROW} right-4`}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
