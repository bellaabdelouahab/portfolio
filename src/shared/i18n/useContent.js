import { useLang } from "./i18n";
import { getSiteSettings } from "../lib/siteSettings";
import { aboutContent, servicesContent, faqData, professionalExperience } from "../../front-office/home/homeContent";
import { aboutFr, servicesFr, faqFr, experienceFr, frDate } from "../../front-office/home/homeContent.fr";

const nonEmpty = (v) => (typeof v === "string" && v.trim() ? v : null);

const NBSP = "\u00a0";

/** 6000 -> "6,000" (English) or "6 000" with a no-break space (French). Fixed, not Intl, so SSR and browser agree. */
export function formatPrice(amount, lang) {
  return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "fr" ? NBSP : ",");
}

const validPrice = (v) => typeof v === "number" && Number.isFinite(v) && v > 0;

/** The tier's price: the back-office override when valid, else the built-in one. */
export function tierPrice(tier, override) {
  return validPrice(override?.priceFrom) ? override.priceFrom : tier.priceFrom;
}

/**
 * Applies the price rules to one service. Returns its tiers with the effective
 * `priceFrom` / `priceLabel` / `priceNote`, the derived headline (`startingPrice`)
 * and the service minimum (`priceFrom`).
 *   headline: {from} = first tier price, {to} = last tier price
 *   priceNote: the override for this language, else the built-in text unchanged
 */
function applyPricing(service, lang, svcOverride) {
  const tiers = (service.tiers || []).map((t) => {
    const o = svcOverride?.tiers?.[t.id];
    const price = tierPrice(t, o);
    const note = o && typeof o === "object" ? nonEmpty(o[lang]?.priceNote) : null;
    return {
      ...t,
      priceFrom: price,
      priceLabel: String(t.priceLabel || "").replace("{price}", formatPrice(price, lang)),
      priceNote: note ? note.trim() : t.priceNote,
    };
  });
  if (!tiers.length) return service;
  const first = tiers[0].priceFrom;
  const last = tiers[tiers.length - 1].priceFrom;
  return {
    ...service,
    tiers,
    priceFrom: Math.min(...tiers.map((t) => t.priceFrom)),
    startingPrice: String(service.startingPrice || "")
      .replace("{from}", formatPrice(first, lang))
      .replace("{to}", formatPrice(last, lang)),
  };
}

/** Applies `home.services` / `home.faq` back-office overrides (only provided fields).
 * Services: `[lang].title` / `.description`, and per tier `priceFrom` (number, both
 * languages) and `[lang].priceNote`. An older stored `[lang].priceFrom` is ignored:
 * the service minimum and the headline are derived from the tier prices. */
function applyOverrides(base, lang, home) {
  const svc = home?.services && typeof home.services === "object" ? home.services : {};
  const faq = home?.faq;
  const services = base.services.map((s) => {
    const entry = svc[s.id] && typeof svc[s.id] === "object" ? svc[s.id] : null;
    const o = entry?.[lang];
    let next = s;
    if (o && typeof o === "object") {
      const title = nonEmpty(o.title);
      const description = nonEmpty(o.description);
      if (title || description) next = { ...s, ...(title && { title }), ...(description && { description }) };
    }
    return applyPricing(next, lang, entry);
  });
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

/** Page content in a language with the given `home` settings applied (also used for the back-office preview). */
export function buildContent(lang, home) {
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
    return applyOverrides(base, lang, home);
  } catch {
    return applyOverrides(base, lang, {}); // malformed settings must never break a page
  }
}

/** Page content in the language of the current URL, with the current site settings. English is the base data. */
export function localizeContent(lang) {
  return buildContent(lang, getSiteSettings().home);
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
