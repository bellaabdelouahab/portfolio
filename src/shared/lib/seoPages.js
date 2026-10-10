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
    title: `Développeur web et analyste de données, Agadir | ${BRAND}`,
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
  en: "Who delivers your project: Abdelouahab Bella leads, with front-end and security specialists on larger engagements.",
  fr: "Qui réalise votre projet : Abdelouahab Bella pilote, avec des spécialistes front-end et sécurité sur les missions plus importantes.",
};
const TEAM_KEYWORDS = "web development team Morocco, data analytics freelancer, Abdelouahab Bella team";
const PROJECTS_DESC =
  "Web development and data analytics projects by Abdelouahab Bella, each with the problem, the solution and the result.";
const PROJECTS_KEYWORDS = "web development projects, Power BI dashboards, case studies, Abdelouahab Bella";

export const SEO_PAGES = [
  {
    key: "home",
    label: "Home",
    path: "/",
    brand: false,
    defaults: {
      en: {
        title: SITE_FALLBACK.en.title,
        description:
          "Freelance web developer and data analyst in Agadir, Morocco. Websites, online stores and Power BI dashboards, with a written quote in MAD.",
        keywords: SITE_FALLBACK.en.keywords,
      },
      fr: {
        title: SITE_FALLBACK.fr.title,
        description:
          "Développeur web et analyste de données freelance à Agadir, Maroc. Sites web, boutiques en ligne et tableaux de bord Power BI, avec un devis écrit en MAD.",
        keywords: SITE_FALLBACK.fr.keywords,
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
      en: { title: "Projects", description: PROJECTS_DESC, keywords: PROJECTS_KEYWORDS },
      fr: {
        title: "Mes projets",
        description:
          "Projets de développement web et d'analyse de données d'Abdelouahab Bella, chacun avec le problème, la solution et le résultat.",
        keywords: "projets de développement web, tableaux de bord Power BI, études de cas, Abdelouahab Bella",
      },
    },
  },
  {
    key: "certificates",
    label: "Certificates",
    path: "/certificates",
    titleKey: "cert.title",
    defaults: {
      en: { title: STRINGS.en["cert.title"], description: CERT_DESC.en, keywords: CERT_KEYWORDS },
      fr: { title: STRINGS.fr["cert.title"], description: CERT_DESC.fr, keywords: CERT_KEYWORDS },
    },
  },
  {
    key: "my-team",
    label: "Team",
    path: "/my-team",
    titleKey: "team.title",
    defaults: {
      en: { title: STRINGS.en["team.title"], description: TEAM_DESC.en, keywords: TEAM_KEYWORDS },
      fr: { title: STRINGS.fr["team.title"], description: TEAM_DESC.fr, keywords: TEAM_KEYWORDS },
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
