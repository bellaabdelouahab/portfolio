import { useEffect } from "react";
import IntroductionSection from "./sections/introduction/IntroductionSection";
import ProjectsSection from "./sections/featured-projects/ProjectsSection";
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
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, getTelephone } from "../../shared/lib/contactConfig";
import { useLang, withLang } from "../../shared/i18n/i18n";
import { useContent } from "../../shared/i18n/useContent";

export default function Home() {
  const { projects: projectHighlight, clients } = useLoaderData();
  const lang = useLang();
  const { services: servicesContent } = useContent();

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

  const site = getAbsoluteUrl(withLang(lang, "/"));
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": getAbsoluteUrl("/#website"),
        url: site,
        name: "Abdelouahab Bella",
        inLanguage: lang,
        publisher: { "@id": getAbsoluteUrl("/#business") },
      },
      {
        "@type": "Person",
        "@id": getAbsoluteUrl("/#person"),
        name: "Abdelouahab Bella",
        jobTitle: lang === "fr" ? "Développeur web et analyste de données" : "Web Developer and Data Analyst",
        url: site,
        image: getAbsoluteUrl("/profile.webp"),
        email: CONTACT_EMAIL,
        address: { "@type": "PostalAddress", addressLocality: "Agadir", addressCountry: "MA" },
        sameAs: [GITHUB_URL, LINKEDIN_URL],
        knowsAbout: ["Web development", "WordPress", "Shopify", "Django", "Next.js", "Power BI", "SQL", "Python", "Data analytics", "SEO"],
      },
      {
        "@type": "ProfessionalService",
        "@id": getAbsoluteUrl("/#business"),
        name: "Abdelouahab Bella, web development and data analytics",
        url: site,
        image: getAbsoluteUrl("/og-default.jpg"),
        logo: getAbsoluteUrl("/icon-512.png"),
        description: lang === "fr" ? "Développeur web et analyste de données freelance à Agadir, Maroc : sites web, applications et tableaux de bord Power BI." : "Freelance web developer and data analyst in Agadir, Morocco: websites, web applications and Power BI dashboards.",
        founder: { "@id": getAbsoluteUrl("/#person") },
        email: CONTACT_EMAIL,
        telephone: getTelephone(),
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
            itemOffered: { "@type": "Service", name: svc.title, url: getAbsoluteUrl(withLang(lang, `/services/${svc.id}`)), description: svc.description },
          })),
        },
      },
    ],
  };

  return (
    <>
      <SEO
        structuredData={homeStructuredData}
      />
      <IntroductionSection />
      {/* Everything under the hero. In the light theme the alternating section
          colours are swapped here so the first section is white, matching the
          hero fade (see global.css, .home-sections). */}
      <div className="home-sections w-full">
        <ProjectsSection projectHighlight={projectHighlight} />
        <AboutMeSection />
        <InternshipProjectsSection />
        <Collaborations />
        <HappyClientsSection clients={clients} />
        <ServicesSection />
        <FAQSection />
        <GetInTouchSection />
      </div>
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
