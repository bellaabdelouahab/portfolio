import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSiteStructure } from "../utils/sitemapGenerator";
import "../assets/css/sitemap.css";
import SEO from "../components/common/SEO";

export default function SiteMap() {
  const [siteStructure, setSiteStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiteStructure = async () => {
      try {
        const structure = await getSiteStructure();
        setSiteStructure(structure);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching site structure:", err);
        setError("Failed to load site structure");
        setLoading(false);
      }
    };

    fetchSiteStructure();
  }, []);

  // SEO structured data
  const sitemapStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Abdelouahab Bella Portfolio",
    "url": "https://bellaabdelouahab.github.io",
    "description": "Complete sitemap of Abdelouahab Bella's portfolio website",
    "potentialAction": {
      "@type": "ViewAction",
      "target": "https://bellaabdelouahab.github.io/#/site-map"
    }
  };

  if (loading) {
    return (
      <div className="sitemap-container loading">
        <SEO 
          title="Site Map" 
          description="Complete map of Abdelouahab Bella's portfolio website"
        />
        <h1>Site Map</h1>
        <div className="loading-indicator">Loading site structure...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sitemap-container error">
        <SEO 
          title="Site Map - Error" 
          description="An error occurred while loading the site map"
        />
        <h1>Site Map</h1>
        <div className="error-message">{error}</div>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="sitemap-container">
      <SEO 
        title="Site Map" 
        description="Complete map of Abdelouahab Bella's portfolio website"
        structuredData={sitemapStructuredData}
      />
      <h1>Site Map</h1>
      <p className="sitemap-description">
        This page provides a complete overview of the website structure.
        Use it to easily navigate to any section or page.
      </p>
      
      <div className="sitemap-grid">
        {siteStructure.pages.map((page, index) => (
          <div key={index} className="sitemap-section">
            <h2>
              <Link to={page.url}>{page.title}</Link>
            </h2>
            {page.description && <p>{page.description}</p>}
            
            {page.sections && (
              <div className="sitemap-subsections">
                <h3>Sections:</h3>
                <ul className="section-list">
                  {page.sections.map((section, idx) => (
                    <li key={idx}>
                      <Link to={`${page.url}#${section.toLowerCase().replace(/\s+/g, '-')}`}>
                        {section}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {page.children && page.children.length > 0 && (
              <div className="sitemap-children">
                <h3>{page.title === "Projects" ? "Projects:" : "Items:"}</h3>
                <ul className="children-list">
                  {page.children.slice(0, 10).map((child, idx) => (
                    <li key={idx}>
                      <Link to={child.url}>{child.title}</Link>
                      {child.description && <span className="item-description">{child.description}</span>}
                    </li>
                  ))}
                  {page.children.length > 10 && (
                    <li className="more-items">
                      <Link to={page.url}>...and {page.children.length - 10} more</Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sitemap-xml-link">
        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
          View XML Sitemap for search engines
        </a>
      </div>
    </div>
  );
}
