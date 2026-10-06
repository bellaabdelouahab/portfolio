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
  breadcrumbs = null,
  serviceSchemaBlocks = [],
  noIndex = false,
  noindex = false,
}) {
  const resolvedImage = image
    ? /^https?:\/\//.test(image) ? image : getAbsoluteUrl(image)
    : getAbsoluteUrl("/og-default.png");

  const pageTitle = title
    ? `${title} | Abdelouahab Bella`
    : "Web Developer & Data Analyst in Agadir, Morocco | Abdelouahab Bella";

  const pageDescription =
    description ||
    "Abdelouahab Bella, freelance web developer and data analyst in Agadir, Morocco. Websites, web applications and Power BI dashboards for businesses in Morocco and abroad.";

  const pageKeywords =
    keywords ||
    "web developer Agadir, data analyst Morocco, Power BI dashboards, freelance web developer Morocco, Abdelouahab Bella";

  const shouldNoIndex = Boolean(noIndex || noindex);

  // Always build the canonical from the configured site URL + the current
  // path via React Router's location — NOT window.location, which doesn't
  // exist during SSR (renderToString runs in real Node, no window at all).
  // useLocation() is populated identically by RouterProvider (client) and
  // StaticRouterProvider (server), so this is accurate and SSR-safe either
  // way, and never drags query strings into the canonical.
  const location = useLocation();
  const pageUrl = url || getAbsoluteUrl(location.pathname);

  const finalStructuredData =
    structuredData || {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      description: pageDescription,
      url: pageUrl,
      image: resolvedImage,
      isPartOf: { "@id": getAbsoluteUrl("/#website") },
      about: { "@id": getAbsoluteUrl("/#business") },
    };

  const breadcrumbSchema = breadcrumbs && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: getAbsoluteUrl(path),
    })),
  };

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
      <meta property="og:site_name" content="Abdelouahab Bella" />
      <meta property="og:locale" content="en_US" />

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

      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}

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
