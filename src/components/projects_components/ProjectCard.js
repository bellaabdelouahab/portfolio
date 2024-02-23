const backendUploadsApi = process.env.REACT_APP_BACKEND_UPLOADS_API;
export function ProjectCard({ project }) {
  const { title, description, image, githubLink, highlighted } = project;
  let truncatedDescription = description.slice(0, 250);
  const lastSpaceIndex = truncatedDescription.lastIndexOf(" ");
  truncatedDescription = truncatedDescription.slice(0, lastSpaceIndex);

  return (
    <div
      className="home-projects-section__projects__project"
      style={{
        border: highlighted === "star" ? "2px solid #ffda59" : "none",
      }}
    >
      <div
        className="home-projects-section__projects__project__img"
        style={{ backgroundImage: `url(${backendUploadsApi}${image})` }}
      />
      <h3 className="home-projects-section__projects__project__title">
        {title}
      </h3>
      <p className="home-projects-section__projects__project__description">
        {truncatedDescription}...
      </p>
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
