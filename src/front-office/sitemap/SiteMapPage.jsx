import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSiteStructure } from "../../shared/lib/sitemapGenerator";
import SEO from "../../shared/ui/SEO";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

// The three render branches (loading / error / loaded) all open with the same
// shell and heading, so the utility lists live here instead of being repeated.
const containerClass = "mx-auto max-w-300 px-2.5 py-5 text-ink-strong";
const headingClass = "mb-2.5 border-b-2 border-line pb-1.5 text-2xl text-accent";
const statusClass = "p-5 text-center text-xs leading-normal";

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
    "url": getAbsoluteUrl("/"),
    "description": "Complete sitemap of Abdelouahab Bella's portfolio website",
    "potentialAction": {
      "@type": "ViewAction",
      "target": getAbsoluteUrl("/site-map")
    }
  };

  if (loading) {
    // `loading` and `loading-indicator` carry no styling any more, but
    // scripts/prerender.js queries for both to decide the page is still
    // settling. Removing them would let the prerenderer snapshot this page
    // empty. Keep them.
    return (
      <div className={`${containerClass} loading`}>
        <SEO
          title="Site Map"
          description="Complete map of Abdelouahab Bella's portfolio website"
        />
        <h1 className={headingClass}>Site Map</h1>
        <div className={`loading-indicator ${statusClass}`}>Loading site structure...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClass}>
        <SEO
          title="Site Map - Error"
          description="An error occurred while loading the site map"
        />
        <h1 className={headingClass}>Site Map</h1>
        <div className={`${statusClass} text-danger`}>{error}</div>
        <p className="text-center text-xs leading-normal">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <SEO
        title="Site Map"
        description="Complete map of Abdelouahab Bella's portfolio website"
        structuredData={sitemapStructuredData}
      />
      <h1 className={headingClass}>Site Map</h1>
      <p className="mb-5 text-xs leading-normal text-ink">
        This page provides a complete overview of the website structure. Use it
        to easily navigate to any section or page.
      </p>

      {/* One column below md, then as many 300px-or-wider tracks as fit. */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {siteStructure.pages.map((page, index) => (
          <div
            key={index}
            className="rounded-md bg-[#1a1a1a] p-4 shadow-sm transition-[transform,box-shadow] duration-300 ease-standard hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="mb-2.5 text-base text-[#61dafb]">
              <Link
                to={page.url}
                className="text-inherit transition-colors duration-200 hover:text-accent"
              >
                {page.title}
              </Link>
            </h2>
            {page.description && (
              <p className="mb-2.5 text-xs leading-snug text-ink">{page.description}</p>
            )}

            {page.sections && (
              <div className="mt-4">
                <h3 className="mb-1.5 text-xs text-ink">Sections:</h3>
                <ul>
                  {page.sections.map((section, idx) => (
                    <li
                      key={idx}
                      className="mb-1.5 border-l-2 border-line pl-1.5 transition-colors duration-200 hover:border-accent"
                    >
                      <Link
                        className="block py-0.5 text-ink transition-colors duration-200 hover:text-ink-strong"
                        to={`${page.url}/${section
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {section}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {page.children && page.children.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-1.5 text-xs text-ink">
                  {page.title === "Projects" ? "Projects:" : "Items:"}
                </h3>
                <ul>
                  {page.children.slice(0, 10).map((child, idx) => (
                    <li
                      key={idx}
                      className="mb-1.5 border-l-2 border-line pl-1.5 transition-colors duration-200 hover:border-accent"
                    >
                      <Link
                        to={child.url}
                        className="block py-0.5 text-ink transition-colors duration-200 hover:text-ink-strong"
                      >
                        {child.title}
                      </Link>
                      {child.description && (
                        <span className="mt-0.5 block truncate text-xs text-ink-muted">
                          {child.description}
                        </span>
                      )}
                    </li>
                  ))}
                  {page.children.length > 10 && (
                    <li className="mt-1.5 mb-1.5 border-l-2 border-line pl-1.5 italic transition-colors duration-200 hover:border-accent">
                      <Link
                        to={page.url}
                        className="block py-0.5 text-ink transition-colors duration-200 hover:text-ink-strong"
                      >
                        ...and {page.children.length - 10} more
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
