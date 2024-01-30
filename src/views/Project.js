import "../assets/css/project.css";
import CodeSamples from "../components/project-components/project-code-samples/CodeSamples";
import Carousel from "../components/project-components/projecct-carousel/Carousel";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import Collaborators from "components/project-components/project-collaborators/Collaborators";
import ProjectOverView from "components/project-components/project-overview/ProjectOverView";
import ProjectTools from "components/project-components/project-tools/ProjectTools";
import ProjectDataSource from "components/project-components/project-datasource/ProjectDataSource";

export default function Project() {
  const project = useLoaderData();

  const dataSources = [
    "https://img.icons8.com/color/250/000000/microsoft-excel-2019--v1.png",
    "https://img.icons8.com/color/250/000000/csv.png",
    "https://img.icons8.com/color/250/000000/json--v1.png",
    "https://img.icons8.com/color/250/000000/microsoft-sql-server.png",
    "https://img.icons8.com/color/250/000000/mysql-logo.png",
    "https://img.icons8.com/color/250/000000/mongodb.png",
    "https://img.icons8.com/color/250/000000/python.png",
    "https://img.icons8.com/color/250/000000/xml.png",
  ];

  console.log("project", project);

  return (
    <section className="project-page">
      <ProjectOverView project={project} />
      <CodeSamples codeSamples={project.codeSamples} />
      <ProjectTools tools={project.tools} />
      <ProjectDataSource dataSources={project.dataSources} />
      <Carousel carouselImages={project.carouselImages} />
      <Collaborators collaborators={project.collaborators} />
    </section>
  );
}

export async function getProject({ params }) {
  const response = await axios.get(
    `http://localhost:5000/api/projects/${params.id}`
  );
  return response.data.data;
}
