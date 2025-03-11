import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../assets/css/project.css";
import CodeSamples from "../components/project-components/project-code-samples/CodeSamples";
import Carousel from "../components/project-components/projecct-carousel/Carousel";
import Collaborators from "components/project-components/project-collaborators/Collaborators";
import ProjectOverView from "components/project-components/project-overview/ProjectOverView";
import ProjectTools from "components/project-components/project-tools/ProjectTools";
import ProjectDataSources from "components/project-components/project-datasource/ProjectDataSources";

export default function Project() {
  const location = useLocation();
  const project = location.state;
    useEffect(() => {
      // Create stars in the background
      const starsContainer = document.createElement("div");
      starsContainer.className = "stars-container";
      document.querySelector(".project-page").appendChild(starsContainer);

      // Generate random stars
      const numberOfStars = 500;
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.className = "star";

        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        // Random size
        const size = Math.random() * 3 + 1;

        // Random opacity
        const opacity = Math.random() * 0.7 + 0.3;

        // Random animation duration and delay
        const duration = Math.random() * 50 + 50;
        const delay = Math.random() * 50;

        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = opacity;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
      }

      return () => {
        // Clean up stars when component unmounts
        if (starsContainer.parentNode) {
          starsContainer.parentNode.removeChild(starsContainer);
        }
      };
    }, []);

  return (
    <section className="project-page">
      <ProjectOverView project={project} />
      <ProjectTools tools={project.tools} />
      <ProjectDataSources dataSources={project.dataSources} />
      <Carousel carouselImages={project.carouselImages} />
      <CodeSamples codeSamples={project.codeSamples} />
      <Collaborators collaborators={project.collaborators} />
    </section>
  );
}
