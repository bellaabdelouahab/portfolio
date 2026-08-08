import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function ProjectOverView({ project }) {
  const startDate = project.startDate ? project.startDate.slice(0, 10) : "";
  const endDate = project.endDate
    ? project.endDate.slice(0, 10)
    : "Still Working";

  return (
    <div className="project-overview">
      <div
        className="project__image"
        style={{
          background: `url(${project.image})`,
        }}
      />
      <div className="project__info">
        <h1 className="title">{project.title}</h1>
        <p className="description">{project.description}</p>
        <div className="bottom_options">
          <p className="project__dates">
            {startDate} ⇒ {endDate} | Duration : {project?.durration}
          </p>
          <div>
            <a href={project.githubLink} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            Github
          </div>
        </div>
      </div>
    </div>
  );
}
