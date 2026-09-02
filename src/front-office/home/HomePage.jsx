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
      "jobTitle": "Data Analyst & Software Engineer",
      "description": "Accomplished Data Analyst with extensive experience in data science, computer systems engineering, and software development.",
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
      "serviceType": "Digital Adoption Consulting",
      "provider": { "@type": "Person", "name": "Abdelouahab Bella" },
      "areaServed": ["Agadir", "Morocco"],
      "description": "WalkMe implementation and digital adoption consulting for enterprise platforms including SAP Ariba, Salesforce, ServiceNow, and Oracle.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Data Analytics & Power BI Dashboards",
      "provider": { "@type": "Person", "name": "Abdelouahab Bella" },
      "areaServed": ["Agadir", "Morocco"],
      "description": "Power BI dashboard development, GA4 analytics, and enterprise data analytics consulting for actionable business insights.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Full-Stack Web Development",
      "provider": { "@type": "Person", "name": "Abdelouahab Bella" },
      "areaServed": ["Agadir", "Morocco"],
      "description": "Custom web application development with React front-end, Django/FastAPI back-end, REST APIs, and SEO optimization.",
    },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Portfolio of Abdelouahab Bella, a Data Analyst & Software Engineer with expertise in web development and machine learning"
        keywords="Abdelouahab Bella, Data Science, Software Engineering, Portfolio, Projects, Machine Learning, Web Development"
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
    .filter((project) => project.showInOverview === true)
    // The back office writes overviewOrder when you drag the featured projects
    // into position (ManageProjects). Without this sort that ordering was never
    // applied here, so the arrangement had no effect and Firestore's own
    // unspecified document order won. Same comparator ManageProjects uses.
    .sort((a, b) => (a.overviewOrder ?? 0) - (b.overviewOrder ?? 0));
  return data;
};









