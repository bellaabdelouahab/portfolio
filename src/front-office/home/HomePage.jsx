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
import { CONTACT_EMAIL } from "../../shared/lib/contactConfig";
import { servicesContent } from "./homeContent";

export default function Home() {
  const { projects: projectHighlight, clients } = useLoaderData();

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

  const site = getAbsoluteUrl("/");
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": getAbsoluteUrl("/#website"),
        url: site,
        name: "Abdelouahab Bella",
        inLanguage: "en",
        publisher: { "@id": getAbsoluteUrl("/#business") },
      },
      {
        "@type": "Person",
        "@id": getAbsoluteUrl("/#person"),
        name: "Abdelouahab Bella",
        jobTitle: "Web Developer and Data Analyst",
        url: site,
        image: getAbsoluteUrl("/profile.webp"),
        email: CONTACT_EMAIL,
        address: { "@type": "PostalAddress", addressLocality: "Agadir", addressCountry: "MA" },
        sameAs: ["https://github.com/bellaabdelouahab", "https://linkedin.com/in/abdelouahab-bella"],
        knowsAbout: ["Web development", "WordPress", "Shopify", "Django", "Next.js", "Power BI", "SQL", "Python", "Data analytics", "SEO"],
      },
      {
        "@type": "ProfessionalService",
        "@id": getAbsoluteUrl("/#business"),
        name: "Abdelouahab Bella, web development and data analytics",
        url: site,
        image: getAbsoluteUrl("/og-default.jpg"),
        description: "Freelance web developer and data analyst in Agadir, Morocco: websites, web applications and Power BI dashboards.",
        founder: { "@id": getAbsoluteUrl("/#person") },
        email: CONTACT_EMAIL,
        telephone: "+212762549778",
        priceRange: "MAD",
        currenciesAccepted: "MAD",
        address: { "@type": "PostalAddress", addressLocality: "Agadir", addressRegion: "Souss-Massa", addressCountry: "MA" },
        areaServed: [{ "@type": "Country", name: "Morocco" }, { "@type": "City", name: "Agadir" }],
        knowsLanguage: ["en", "fr", "ar"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: servicesContent.map((svc) => ({
            "@type": "Offer",
            priceCurrency: "MAD",
            priceSpecification: { "@type": "PriceSpecification", priceCurrency: "MAD", minPrice: svc.priceFrom },
            itemOffered: { "@type": "Service", name: svc.title, url: getAbsoluteUrl(`/services/${svc.id}`), description: svc.description },
          })),
        },
      },
    ],
  };

  return (
    <>
      <SEO
        description="Freelance web developer and data analyst in Agadir, Morocco. Websites, online stores and Power BI dashboards, with a written quote in MAD."
        structuredData={homeStructuredData}
      />
      <IntroductionSection />
      <ProjectsSection projectHighlight={projectHighlight} />
      <AboutMeSection />
      <InternshipProjectsSection />
      <Collaborations />
      <HappyClientsSection clients={clients} />
      <ServicesSection />
      <GithubProgressSection />
      <FAQSection />
      <GetInTouchSection />
    </>
  );
}

export const getHighlightedProjects = async () => {
  const [projectDocs, clientDocs] = await Promise.all([
    getCollectionDocs("projects"),
    getCollectionDocs("clients"),
  ]);
  const projects = projectDocs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .filter((project) => project.showInOverview === true && project.hidden !== true)
    // The back office writes overviewOrder when you drag the featured projects
    // into position (ManageProjects).
    .sort((a, b) => (a.overviewOrder ?? 0) - (b.overviewOrder ?? 0));
  const clients = clientDocs.map((doc) => doc.data());
  return { projects, clients };
};
