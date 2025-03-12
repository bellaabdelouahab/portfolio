import { Helmet } from "react-helmet";

export default function SEO({ 
  title, 
  description, 
  image = "https://bellaabdelouahab.github.io/logo.jpg", 
  url, 
  keywords,
  type = "website",
  structuredData = null
}) {
  // Format the page title
  const pageTitle = title ? `${title} | Abdelouahab Bella Portfolio` : "Abdelouahab Bella | Data Scientist & Software Engineer";
  // Set default description if none provided
  const pageDescription = description || "Portfolio of Abdelouahab Bella, Data Scientist and Software Engineer with experience in web development, machine learning, and software development.";
  // Set default keywords if none provided
  const pageKeywords = keywords || "Abdelouahab Bella, Data Scientist, Software Engineer, Web Development, Machine Learning, Portfolio";
  // Get current URL or use provided one
  const pageUrl = url || typeof window !== 'undefined' ? window.location.href : 'https://bellaabdelouahab.github.io';

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
      
      {/* Structured Data - JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Canonical URL to prevent duplicate content issues */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
}
