import "./wide-screen.css"
import { ProjectCard } from "../../projects_components/ProjectCard";

export default function ProjectsSection({ projectHighlight }) {
    return <section className="home-projects-section hidden-area">
        <h2 className="home-projects-section__title">❤️ Projects Highlights</h2>
        <hr className="home-projects-section__hr" />
        <div className="home-projects-section__projects">
            {projectHighlight &&
                projectHighlight.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
        </div>
    </section>;
}