import { useEffect } from "react";
import IntroductionSection from "../components/home_components/introduction/IntroductionSection";
import ProjectsSection from "../components/home_components/projects/ProjectsSection";
import GithubProgressSection from "../components/home_components/github-progress/GithubProgressSection";
import InternshipProjectsSection from "../components/home_components/internship-projects/InternshipProjectsSection";
import AboutMeSection from "../components/home_components/about-me/AboutMeSection";
import GetInTouchSection from "../components/home_components/get-in-touch/GetInTouchSection";
import HappyClientsSection from "../components/home_components/happy-clients/HappyClientsSection";
import { useLoaderData } from "react-router-dom";
import ServicesSection from "../components/home_components/sevices/ServicesSection";
import Collaborations from "../components/home_components/collaborations/Collaborations";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
// import "../assets/css/internship/intership-wide-screen.css";

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
      <Collaborations />
      <HappyClientsSection />
      <ServicesSection/>
      <GetInTouchSection />

      {/* <iframe id="jsoncrackEmbed" src="https://jsoncrack.com/widget" width="70%" height="600px"></iframe> */}
    </>
  );
}

export const getHighlightedProjects = async () => {
  const colRef = collection(db, "projects");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .filter((project) => project.showInOverview === true);
  return data;
};









