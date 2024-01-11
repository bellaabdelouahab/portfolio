export function ProjectCard({ project }) {
  const { title, description, image, githubLink, highlighted } = project;

  return (
    <div
      className="home-second-sections__projects__project"
      style={{
        border: highlighted === "star" ? "2px solid #ffda59" : "none",
        borderRadius: "5px",
      }}
    >
      <div
        className="home-second-sections__projects__project__img"
        style={{ backgroundImage: `url(http://localhost:5000/${image})` }} />
      <h3 className="home-second-sections__projects__project__title">
        {title}
      </h3>
      <p className="home-second-sections__projects__project__description">
        {description}
      </p>
      <div className="home-second-sections__projects__project__buttons">
        <a
          className="home-second-sections__projects__project__buttons__view"
          target="_blank"
          rel="noopener noreferrer"
          href={githubLink}
        >
          View Project
        </a>
        {highlighted === "star" && (
          <a
            className="home-second-sections__projects__project__buttons__sponsor"
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
