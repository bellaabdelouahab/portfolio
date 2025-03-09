import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function ProjectCard({ project }) {
  const { title, description, image, githubLink, highlighted } = project;
  const [imageLoaded, setImageLoaded] = useState(false);

  let truncatedDescription = description.slice(0, 250);
  const lastSpaceIndex = truncatedDescription.lastIndexOf(" ");
  truncatedDescription = truncatedDescription.slice(0, lastSpaceIndex);

  useEffect(() => {
    const img = new Image();
    img.src = `${image}`;
    img.onload = () => setImageLoaded(true);
  }, [image]);

  return (
    <div
      className="home-projects-section__projects__project"
      style={{
        border: highlighted === "star" ? "4px solid #c39a3b" : "none",
      }}
    >
      <div
        className="home-projects-section__projects__project__img"
        style={{
          backgroundImage: imageLoaded
            ? `url(${image})`
            : "none",
          backgroundSize: "100.5% 100%",
        }}
      >
        {!imageLoaded && <Skeleton height="100%" />}
      </div>
      {imageLoaded ? (
        <>
          <h3 className="home-projects-section__projects__project__title">
            {title}
          </h3>
          <p className="home-projects-section__projects__project__description">
            {truncatedDescription}...
          </p>
        </>
      ) : (
        <div>
          <Skeleton
            height={24}
            width={`60%`}
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          />
          <div className="home-projects-section__projects__project__description">
            <Skeleton count={7} />
          </div>
        </div>
      )}
      <div className="home-projects-section__projects__project__buttons">
        <a
          className="home-projects-section__projects__project__buttons__view"
          target="_blank"
          rel="noopener noreferrer"
          href={githubLink}
        >
          View Project
        </a>
        {highlighted === "star" && (
          <a
            className="home-projects-section__projects__project__buttons__sponsor"
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
