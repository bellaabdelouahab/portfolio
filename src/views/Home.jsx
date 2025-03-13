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
import SEO from "../components/common/SEO";

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

  // Create structured data for home page
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Abdelouahab Bella",
      "jobTitle": "Data Scientist & Software Engineer",
      "description": "Accomplished data scientist with extensive experience in data science, computer systems engineering, and software development.",
      "url": "https://abdelouahab.xyz",
      "sameAs": [
        "https://github.com/bellaabdelouahab",
        "https://linkedin.com/in/abdelouahab-bella"
      ],
      "knowsAbout": [
        "Data Science",
        "Machine Learning",
        "Web Development",
        "Software Engineering"
      ]
    }
  };

  return (
    <>
      <SEO 
        title="Home"
        description="Portfolio of Abdelouahab Bella, a Data Scientist & Software Engineer with expertise in web development and machine learning"
        keywords="Abdelouahab Bella, Data Science, Software Engineering, Portfolio, Projects, Machine Learning, Web Development"
        structuredData={homeStructuredData}
      />
      <IntroductionSection />
      <ProjectsSection projectHighlight={projectHighlight} />
      <AboutMeSection />
      <GithubProgressSection />
      <InternshipProjectsSection />
      <Collaborations />
      <HappyClientsSection />
      <ServicesSection/>
      <GetInTouchSection />
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









