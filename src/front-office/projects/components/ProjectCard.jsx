import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function ProjectCard({ project }) {
  const { title, description, image, githubLink, highlighted } = project;
  const [imageLoaded, setImageLoaded] = useState(false);

  let truncatedDescription = description.slice(0, 150);
  const lastSpaceIndex = truncatedDescription.lastIndexOf(" ");
  truncatedDescription = truncatedDescription.slice(0, lastSpaceIndex);

  useEffect(() => {
    const img = new Image();
    img.src = `${image}`;
    img.onload = () => setImageLoaded(true);
  }, [image]);

  return (
    <div
      className="relative h-120 w-110 overflow-hidden rounded-lg bg-surface shadow-md transition-all duration-200 ease-standard hover:transform-[rotate(-1.5deg)_scale(1.05)] hover:shadow-[5px_7px_9px_rgba(0,0,0,0.2)]"
      style={{
        border:
          highlighted === "star"
            ? "4px solid #c39a3b"
            : "1px solid oklch(1 0 0 / 10%)",
      }}
    >
      <div
        className="h-60 w-full rounded-t-[10px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: imageLoaded ? `url(${image})` : "none",
          backgroundSize: "100.5% 100%",
        }}
      >
        {!imageLoaded && <Skeleton height="100%" />}
      </div>
      {/* Title/description used to be gated behind imageLoaded too, on the
          theory of not showing "half loaded" content — but they don't
          actually depend on the image at all, and gating them meant every
          card shipped as an empty skeleton in the raw SSR HTML with zero
          indexable text (the image preload's useEffect never runs during
          SSR). Only the image itself needs its own loading state. */}
      <h3 className="mt-[2vh] mb-[2vh] ml-[1.5vw] text-2xl font-bold text-ink-strong">
        {title}
      </h3>
      <p className="mx-auto w-[90%] text-base leading-normal tracking-[2px]! text-ink">
        {truncatedDescription}...
      </p>
      <div className="absolute bottom-[0.5vh] left-0 flex h-[10%] w-full items-center justify-around">
        <a
          className="rounded-[5px] bg-accent px-5 py-2.5 text-base font-bold tracking-[2px]! text-white"
          target="_blank"
          rel="noopener noreferrer"
          href={githubLink}
        >
          View Project
        </a>
        {highlighted === "star" && (
          <a
            className="rounded-[5px] border-[3px] border-dotted bg-[#474747e2] px-5 py-2.5 text-base font-bold tracking-[2px]! text-[gray]"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/bellaabdelouahab/"
          >
            1$/Sponsor
          </a>
        )}
      </div>
    </div>
  );
}
