import { Helmet } from "react-helmet";

export default function SEO({
  title,
  description,
  image = "https://abdelouahab.xyz/logo.jpg",
  url,
  keywords,
  type = "website",
  structuredData = null,
}) {
  // Format the page title
  const pageTitle = title
    ? `${title} | Abdelouahab Bella Portfolio`
    : "Abdelouahab Bella | Data Scientist & Software Engineer Portfolio 2025";

  const pageDescription =
    description ||
    "portfolio of Abdelouahab Bella, Data Scientist and Software Engineer. Featuring best projects in web development, machine learning, and innovative software solutions for 2025.";

  const pageKeywords =
    keywords ||
    "Abdelouahab Bella, Best Portfolio 2025, Data Scientist Portfolio, Software Engineer Portfolio, Web Development Projects, Machine Learning Portfolio, Top Software Engineer, React Portfolio, Professional Developer Website";

  // Get current URL or use provided one
  const pageUrl =
    url ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://abdelouahab.xyz");

  // Default structured data for the portfolio
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    image: image,
    mainEntity: {
      "@type": "Person",
      name: "Abdelouahab Bella",
      url: "https://abdelouahab.xyz",
      jobTitle: "Data Scientist & Software Engineer",
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
      <meta property="og:image" content={image} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="author" content="Abdelouahab Bella" />
      <meta
        name="copyright"
        content={`© ${new Date().getFullYear()} Abdelouahab Bella`}
      />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Canonical URL to prevent duplicate content issues */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
}
