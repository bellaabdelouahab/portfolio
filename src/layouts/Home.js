import { useEffect } from "react";
import axios from "axios";
import IntroductionSection from "../components/home_components/IntroductionSection";
import ProjectsSection from "../components/home_components/ProjectsSection";
import GithubProgressSection from "../components/home_components/GithubProgressSection";
import InternshipProjectsSection from "../components/home_components/InternshipProjectsSection";
import AboutMeSection from "../components/home_components/AboutMeSection";
import GetInTouchSection from "../components/home_components/GetInTouchSection";
import HappyClientsSection from "../components/home_components/HappyClientsSection";
import { useLoaderData } from "react-router-dom";
import "../assets/css/internship/index.css";

export default function Home() {
  const projectHighlight = useLoaderData();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });

    const hiddenAreas = document.querySelectorAll(".hidden-area");
    hiddenAreas.forEach((el) => {
      observer.observe(el);
    });
  }, []);

  return (
    <>
      <IntroductionSection />
      <ProjectsSection projectHighlight={projectHighlight} />
      <AboutMeSection />
      <GithubProgressSection />
      <InternshipProjectsSection />
      <HappyClientsSection />
      <GetInTouchSection />

      {/* <iframe id="jsoncrackEmbed" src="https://jsoncrack.com/widget" width="70%" height="600px"></iframe> */}
    </>
  );
}

export const getHighlightedProjects = async () => {
  console.log("getProjects");
  return await axios
    .get(
      "http://localhost:5000/api/projects?limit=3&fields=title,description,githubLink,highlight"
    )
    .then((res) => {
      console.log(res.data.data);
      return res.data.data;
    });
};









