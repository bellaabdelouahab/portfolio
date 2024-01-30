import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function ProjectOverView({ project }) {
  return (
    <div className="project-overview">
      <div
        className="project__image"
        style={{
          backgroundImage: `url(http://localhost:5000/${project.image})`,
        }}
      />
      <div className="project__info">
        <h1 className="title">{project.title}</h1>
        <p className="description">{project.description}</p>
        <div className="bottom_options">
          <p className="project__dates">
            {project.startDate} ⇒ {project.endDate} | Duration :{" "}
            {project.durration}
          </p>
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>
    </div>
  );
}
