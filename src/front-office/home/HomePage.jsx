import { useEffect } from "react";
import IntroductionSection from "./sections/introduction/IntroductionSection";
import ProjectsSection from "./sections/featured-projects/ProjectsSection";
import GithubProgressSection from "./sections/github-progress/GithubProgressSection";
import InternshipProjectsSection from "./sections/internship-projects/InternshipProjectsSection";
import AboutMeSection from "./sections/about-me/AboutMeSection";
import GetInTouchSection from "./sections/get-in-touch/GetInTouchSection";
import HappyClientsSection from "./sections/happy-clients/HappyClientsSection";
import { useLoaderData } from "react-router-dom";
import ServicesSection from "./sections/services/ServicesSection";
import Collaborations from "./sections/collaborations/Collaborations";
import FAQSection from "./sections/faq/FAQSection";
import { getCollectionDocs } from "../../shared/lib/firestoreAccess";
import SEO from "../../shared/ui/SEO";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

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
      "jobTitle": "Web Developer & Data Analyst",
      "description": "Freelance web developer and data analyst in Agadir, Morocco. Builds business websites and web applications, and turns data into dashboards and reports.",
      "url": getAbsoluteUrl("/"),
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

  // Service schema blocks — one per distinct offering
  const serviceSchemaBlocks = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Web Development",
      "provider": { "@type": "Person", "name": "Abdelouahab Bella" },
      "areaServed": ["Agadir", "Morocco"],
      "description": "Business websites, web applications and internal tools built with React, Django and FastAPI, deployed on the client's domain.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Data Analytics and Business Intelligence",
      "provider": { "@type": "Person", "name": "Abdelouahab Bella" },
      "areaServed": ["Agadir", "Morocco"],
      "description": "Power BI dashboards, SQL and Python data pipelines, and web analytics for actionable business reporting.",
    },
  ];
  return (
    <>
      <SEO
        title="Home"
        description="Abdelouahab Bella, freelance web developer and data analyst in Agadir, Morocco. Websites, web applications and Power BI dashboards, with fixed prices in MAD."
        keywords="web developer Agadir, data analyst Morocco, Power BI dashboards, freelance web development, Abdelouahab Bella"
        structuredData={homeStructuredData}
        serviceSchemaBlocks={serviceSchemaBlocks}
      />
      <IntroductionSection />
      <ProjectsSection projectHighlight={projectHighlight} />
      <AboutMeSection />
      <InternshipProjectsSection />
      <Collaborations />
      <HappyClientsSection />
      <ServicesSection />
      <GithubProgressSection />
      <FAQSection />
      <GetInTouchSection />
    </>
  );
}

export const getHighlightedProjects = async () => {
  const docs = await getCollectionDocs("projects");
  const data = docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .filter((project) => project.showInOverview === true && project.hidden !== true)
    // The back office writes overviewOrder when you drag the featured projects
    // into position (ManageProjects). Without this sort that ordering was never
    // applied here, so the arrangement had no effect and Firestore's own
    // unspecified document order won. Same comparator ManageProjects uses.
    .sort((a, b) => (a.overviewOrder ?? 0) - (b.overviewOrder ?? 0));
  return data;
};









