import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { langOf, stripLang, withLang } from "../i18n/i18n";
import { getAbsoluteUrl } from "../lib/siteConfig";
import { composeSeo, pageKeyOf } from "../lib/seoPages";

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
  const lang = langOf(useLocation().pathname);
  const resolvedImage = image
    ? /^https?:\/\//.test(image) ? image : getAbsoluteUrl(image)
    : getAbsoluteUrl("/og-default.jpg");

  // Title, description and keywords come from the back-office override for
  // this page, else the page's own props, else shared/lib/seoPages.js. The
  // brand suffix is dropped past 62 characters and descriptions are clipped at
  // 158 there (search results show about 60 and 155).
  const barePath = stripLang(useLocation().pathname);
  const {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
  } = composeSeo(pageKeyOf(barePath), lang, { title, description, keywords });

  const shouldNoIndex = Boolean(noIndex || noindex);

  // Always build the canonical from the configured site URL + the current
  // path via React Router's location — NOT window.location, which doesn't
  // exist during SSR (renderToString runs in real Node, no window at all).
  // useLocation() is populated identically by RouterProvider (client) and
  // StaticRouterProvider (server), so this is accurate and SSR-safe either
  // way, and never drags query strings into the canonical.
  const location = useLocation();
  const pageUrl = url || getAbsoluteUrl(location.pathname);
  const alternates = {
    en: getAbsoluteUrl(withLang("en", barePath)),
    fr: getAbsoluteUrl(withLang("fr", barePath)),
  };

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
      <html lang={lang} />
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
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_US"} />
      <meta property="og:locale:alternate" content={lang === "fr" ? "en_US" : "fr_FR"} />

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
      {!shouldNoIndex && (
        <link rel="alternate" hrefLang="en" href={alternates.en} />
      )}
      {!shouldNoIndex && (
        <link rel="alternate" hrefLang="fr" href={alternates.fr} />
      )}
      {!shouldNoIndex && (
        <link rel="alternate" hrefLang="x-default" href={alternates.en} />
      )}
    </Helmet>
  );
}
