import { useLocation } from "react-router-dom";
import "../assets/css/project.css";
import CodeSamples from "../components/project-components/project-code-samples/CodeSamples";
import Carousel from "../components/project-components/projecct-carousel/Carousel";
import Collaborators from "components/project-components/project-collaborators/Collaborators";
import ProjectOverView from "components/project-components/project-overview/ProjectOverView";
import ProjectTools from "components/project-components/project-tools/ProjectTools";
import ProjectDataSources from "components/project-components/project-datasource/ProjectDataSources";
import axiosInstance from "utils/axios";

export default function Project() {
  const location = useLocation();
  const project = location.state;

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
