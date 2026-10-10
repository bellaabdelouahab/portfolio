import { STRINGS, translate } from "../i18n/strings";
import { getSiteSettings } from "./siteSettings";
import { servicesContent } from "../../front-office/home/homeContent";
import { servicesFr } from "../../front-office/home/homeContent.fr";

/**
 * Search-result text for the static pages: the single source for page titles,
 * descriptions and keywords. The back office can override any field per page
 * and language (`seo.pages[key][lang]`), and SEO.jsx applies the override.
 *
 * `key` is the path without the leading slash (`home` for the root). `titleKey`
 * marks titles that follow an interface string. `brand: false` means the title
 * already carries the brand and is used as written.
 */

const BRAND = "Abdelouahab Bella";

/** Text for any page that does not provide its own (articles, 404, ...). */
export const SITE_FALLBACK = {
  en: {
    title: `Web Developer & Data Analyst, Agadir | ${BRAND}`,
    description:
      "Abdelouahab Bella, freelance web developer and data analyst in Agadir, Morocco. Websites, web applications and Power BI dashboards for businesses in Morocco and abroad.",
    keywords:
      "web developer Agadir, data analyst Morocco, Power BI dashboards, freelance web developer Morocco, Abdelouahab Bella",
  },
  fr: {
    title: `Développeur web et data analyst, Agadir | ${BRAND}`,
    description:
      "Abdelouahab Bella, développeur web et analyste de données freelance à Agadir, Maroc. Sites web, applications et tableaux de bord Power BI pour des entreprises au Maroc et à l'étranger.",
    keywords:
      "développeur web Agadir, analyste de données Maroc, tableaux de bord Power BI, développeur web freelance Maroc, Abdelouahab Bella",
  },
};

const service = (id) => {
  const en = servicesContent.find((s) => s.id === id);
  const fr = { ...en, ...servicesFr[id] };
  const build = (s, region) => ({
    title: s.seoTitle || s.title,
    description: s.seoDescription || s.longDescription || s.description,
    keywords: `${s.title}, ${s.serviceType}, Agadir, ${region}, freelance`,
  });
  return { en: build(en, "Morocco"), fr: build(fr, "Maroc") };
};

const CERT_DESC = {
  en: "Verified certifications by Abdelouahab Bella in data analytics, machine learning and software engineering, including the IBM Data Analyst Professional Certificate.",
  fr: "Certifications d'Abdelouahab Bella en analyse de données, machine learning et génie logiciel, dont le certificat professionnel IBM Data Analyst.",
};
const CERT_KEYWORDS = "IBM Data Analyst Professional Certificate, data analyst certifications, Abdelouahab Bella";
const TEAM_DESC = {
  en: "Web development and data analytics team in Agadir: Abdelouahab Bella leads each project, with front-end and security specialists on larger engagements.",
  fr: "Équipe de développement web et d'analyse de données à Agadir : Abdelouahab Bella pilote chaque projet, avec des spécialistes front-end et sécurité sur les missions plus importantes.",
};
const TEAM_KEYWORDS = "web development team Agadir, équipe développement web Agadir, data analytics team Morocco, Abdelouahab Bella";
const PROJECTS_DESC =
  "Case studies of websites, web platforms and Power BI dashboards built for clients in Morocco: the problem, what was built and the result.";
const PROJECTS_KEYWORDS =
  "website examples, Power BI dashboard examples, web development case studies, web developer Morocco, Abdelouahab Bella";

export const SEO_PAGES = [
  {
    key: "home",
    label: "Home",
    path: "/",
    brand: false,
    defaults: {
      // Written around what people type: "web developer Agadir", "création site
      // web Agadir", "Power BI Maroc" (see docs/SEO.md for the research).
      en: {
        title: `Freelance Web Developer in Agadir, Morocco | ${BRAND}`,
        description:
          "Websites, online stores and Power BI dashboards for businesses in Agadir and across Morocco. Free 30-minute call, written quote in MAD.",
        keywords:
          "freelance web developer Agadir, web developer Morocco, website development Morocco, Power BI dashboard freelancer, data analyst Morocco",
      },
      fr: {
        title: `Développeur web freelance à Agadir | ${BRAND}`,
        description:
          "Création de site web, boutique en ligne et tableaux de bord Power BI à Agadir et partout au Maroc. Appel gratuit de 30 minutes, devis écrit en MAD.",
        keywords:
          "création site web Agadir, développeur web freelance Agadir, développeur web Maroc, tableau de bord Power BI Maroc, analyste de données freelance, boutique en ligne Maroc",
      },
    },
  },
  { key: "services/web", label: "Web development service", path: "/services/web", defaults: service("web") },
  { key: "services/data", label: "Data analytics service", path: "/services/data", defaults: service("data") },
  {
    key: "projects",
    label: "Projects",
    path: "/projects",
    defaults: {
      en: { title: "Web Development and Power BI Projects: Case Studies", description: PROJECTS_DESC, keywords: PROJECTS_KEYWORDS },
      fr: {
        title: "Réalisations web et Power BI : études de cas",
        description:
          "Études de cas de sites web, plateformes et tableaux de bord Power BI réalisés pour des clients au Maroc : le problème, la solution et le résultat.",
        keywords: "exemples de sites web, exemples de tableaux de bord Power BI, études de cas, développeur web Maroc, Abdelouahab Bella",
      },
    },
  },
  {
    key: "certificates",
    label: "Certificates",
    path: "/certificates",
    // Visitors reach this page by searching the name (and a credential they
    // were told about), so the title leads with both.
    brand: false,
    defaults: {
      en: { title: `${BRAND}'s Certifications: IBM Data Analyst, SQL`, description: CERT_DESC.en, keywords: CERT_KEYWORDS },
      fr: { title: `Certifications d'${BRAND} : IBM Data Analyst, SQL`, description: CERT_DESC.fr, keywords: CERT_KEYWORDS },
    },
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    brand: false,
    defaults: {
      en: {
        title: `Contact a Web Developer in Agadir | ${BRAND}`,
        description:
          "Contact Abdelouahab Bella, freelance web developer and data analyst in Agadir: WhatsApp, email or a free 30-minute call. Written quote in MAD.",
        keywords: "contact web developer Agadir, hire web developer Morocco, freelance developer contact, Abdelouahab Bella",
      },
      fr: {
        title: `Contacter un développeur web à Agadir | ${BRAND}`,
        description:
          "Contactez Abdelouahab Bella, développeur web et analyste de données freelance à Agadir : WhatsApp, email ou appel gratuit de 30 minutes. Devis écrit en MAD.",
        keywords: "contacter développeur web Agadir, développeur web freelance Maroc, devis site web Agadir, Abdelouahab Bella",
      },
    },
  },
  {
    key: "my-team",
    label: "Team",
    path: "/my-team",
    brand: false,
    defaults: {
      en: { title: `Web Development and Data Team in Agadir | ${BRAND}`, description: TEAM_DESC.en, keywords: TEAM_KEYWORDS },
      fr: { title: `Équipe web et data à Agadir | ${BRAND}`, description: TEAM_DESC.fr, keywords: TEAM_KEYWORDS },
    },
  },
];

const clean = (v) => (typeof v === "string" && v.trim() ? v.trim() : "");

/** `/fr/my-team/` is already stripped of its language; returns `my-team`, `home`, ... */
export function pageKeyOf(barePath = "/") {
  const key = String(barePath).replace(/^\/+|\/+$/g, "");
  return key || "home";
}

export const findSeoPage = (key) => SEO_PAGES.find((p) => p.key === key) || null;

export const MAX_TITLE = 62;
export const MAX_DESCRIPTION = 158;

function clip(text, max = MAX_DESCRIPTION) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * The text a page shows in search results. Priority per field: back-office
 * override, then what the page passed in `props`, then the page's defaults,
 * then the site fallback. Titles get the brand suffix when it fits in 62
 * characters; descriptions are clipped at 158.
 */
export function composeSeo(pageKey, lang, props = {}) {
  const l = lang === "fr" ? "fr" : "en";
  const entry = pageKey ? findSeoPage(pageKey) : null;
  let override = {};
  try {
    const o = getSiteSettings().seo?.pages?.[pageKey]?.[l];
    if (entry && o && typeof o === "object") override = o;
  } catch {
    override = {};
  }
  const defaults = entry?.defaults?.[l] || {};
  const defaultTitle = entry?.titleKey ? translate(l, entry.titleKey) : defaults.title;
  const fallback = SITE_FALLBACK[l];

  const rawTitle = clean(override.title) || clean(props.title) || clean(defaultTitle);
  let title;
  if (!rawTitle) title = fallback.title;
  else if (entry?.brand === false) title = rawTitle;
  else {
    const withBrand = `${rawTitle} | ${BRAND}`;
    title = withBrand.length <= MAX_TITLE ? withBrand : rawTitle;
  }
  const description = clip(clean(override.description) || clean(props.description) || clean(defaults.description) || fallback.description);
  const keywords = clean(override.keywords) || clean(props.keywords) || clean(defaults.keywords) || fallback.keywords;
  return { title, description, keywords };
}

/** Effective `{ title, description, keywords }` for one page, for the admin preview. */
export function resolveSeo(pageKey, lang) {
  return composeSeo(pageKey, lang, {});
}
