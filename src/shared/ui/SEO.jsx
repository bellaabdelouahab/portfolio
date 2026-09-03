import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { getAbsoluteUrl } from "../lib/siteConfig";

export default function SEO({
  title,
  description,
  image,
  url,
  keywords,
  type = "website",
  structuredData = null,
  serviceSchemaBlocks = [],
  noIndex = false,
  noindex = false,
}) {
  const resolvedImage = image || getAbsoluteUrl("/logo.jpg");

  // Format the page title
  const pageTitle = title
    ? `${title} | Abdelouahab Bella Portfolio`
    : "Abdelouahab Bella | Data Analyst & Software Engineer Portfolio";

  const pageDescription =
    description ||
    "Portfolio of Abdelouahab Bella, Data Analyst and Software Engineer. Featuring projects in web development, machine learning, and modern software solutions.";

  const pageKeywords =
    keywords ||
    "Abdelouahab Bella, Data Analyst Portfolio, Software Engineer Portfolio, Web Development Projects, Machine Learning Portfolio, Top Software Engineer, React Portfolio, Professional Developer Website";

  const shouldNoIndex = Boolean(noIndex || noindex);

  // Always build the canonical from the configured site URL + the current
  // path via React Router's location — NOT window.location, which doesn't
  // exist during SSR (renderToString runs in real Node, no window at all).
  // useLocation() is populated identically by RouterProvider (client) and
  // StaticRouterProvider (server), so this is accurate and SSR-safe either
  // way, and never drags query strings into the canonical.
  const location = useLocation();
  const pageUrl = url || getAbsoluteUrl(location.pathname);

  // Default structured data for the portfolio
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    image: resolvedImage,
    mainEntity: {
      "@type": "Person",
      name: "Abdelouahab Bella",
      url: getAbsoluteUrl("/"),
      jobTitle: "Data Analyst & Software Engineer",
      knowsAbout: [
        "Data Science",
        "Machine Learning",
        "React",
        "Web Development",
        "Software Engineering",
      ],
    },
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {/* Open Graph Meta Tags (for social media) */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* Additional SEO Meta Tags */}
      <meta
        name="robots"
        content={shouldNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      />
      <meta name="author" content="Abdelouahab Bella" />
      <meta
        name="copyright"
        content={`© ${new Date().getFullYear()} Abdelouahab Bella`}
      />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Service Schema Blocks */}
      {serviceSchemaBlocks.map((block, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}

      {/* Canonical URL to prevent duplicate content issues */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
}
