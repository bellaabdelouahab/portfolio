import { useLang } from "./i18n";
import { getSiteSettings } from "../lib/siteSettings";
import { aboutContent, servicesContent, faqData, professionalExperience } from "../../front-office/home/homeContent";
import { aboutFr, servicesFr, faqFr, experienceFr, frDate } from "../../front-office/home/homeContent.fr";

const nonEmpty = (v) => (typeof v === "string" && v.trim() ? v : null);

/** Re-formats the number in a price label ("From 6,000 MAD") for a new amount. */
function relabelPrice(label, amount) {
  if (typeof label !== "string") return label;
  return label.replace(/\d[\d,.\s  ]*\d|\d/, (run) => {
    const sep = run.match(/[,.\s  ]/)?.[0] ?? ",";
    return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  });
}

/** Applies `home.services` / `home.faq` back-office overrides (only provided fields).
 * `priceFrom` is the service-level minimum: it re-labels the first number of the
 * `startingPrice` headline and feeds the home OfferCatalog. Tier prices are not
 * overridable from the back office. */
function applyOverrides(base, lang, home) {
  const svc = home?.services;
  const faq = home?.faq;
  const services = svc && typeof svc === "object"
    ? base.services.map((s) => {
        const o = svc[s.id]?.[lang];
        if (!o || typeof o !== "object") return s;
        const next = { ...s };
        const title = nonEmpty(o.title);
        const description = nonEmpty(o.description);
        if (title) next.title = title;
        if (description) next.description = description;
        if (typeof o.priceFrom === "number" && Number.isFinite(o.priceFrom) && o.priceFrom >= 0) {
          next.priceFrom = o.priceFrom;
          next.startingPrice = relabelPrice(s.startingPrice, o.priceFrom);
        }
        return next;
      })
    : base.services;
  const faqs = faq && typeof faq === "object"
    ? base.faq.map((f) => {
        const o = faq[f.id]?.[lang];
        if (!o || typeof o !== "object") return f;
        const question = nonEmpty(o.question);
        const answer = nonEmpty(o.answer);
        return question || answer ? { ...f, ...(question && { question }), ...(answer && { answer }) } : f;
      })
    : base.faq;
  return { ...base, services, faq: faqs };
}

/** Page content in the language of the current URL. English is the base data. */
export function localizeContent(lang) {
  const base = lang !== "fr"
    ? { about: aboutContent, services: servicesContent, faq: faqData, experience: professionalExperience }
    : {
        about: { ...aboutContent, ...aboutFr },
        services: servicesContent.map((s) => {
          const { tiers: frTiers, ...frRest } = servicesFr[s.id] || {};
          // Tier numbers and flags stay English-side; only the text is replaced.
          return { ...s, ...frRest, tiers: (s.tiers || []).map((t) => ({ ...t, ...frTiers?.[t.id] })) };
        }),
        faq: faqData.map((f) => ({ ...f, question: faqFr[f.id]?.[0] ?? f.question, answer: faqFr[f.id]?.[1] ?? f.answer })),
        experience: professionalExperience.map((e, i) => ({
          ...e,
          ...experienceFr[i],
          startDate: frDate(e.startDate),
          endDate: frDate(e.endDate),
        })),
      };
  try {
    return applyOverrides(base, lang, getSiteSettings().home);
  } catch {
    return base; // malformed settings must never break a page
  }
}

// The same object is returned while the settings and language are unchanged, so
// components that use the result as a dependency do not re-run on every render.
let memo = { lang: null, home: null, value: null };

export function useContent() {
  const lang = useLang();
  const home = getSiteSettings().home;
  if (memo.value && memo.lang === lang && memo.home === home) return memo.value;
  memo = { lang, home, value: localizeContent(lang) };
  return memo.value;
}
