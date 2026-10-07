import { useLang } from "./i18n";
import { aboutContent, servicesContent, faqData, professionalExperience } from "../../front-office/home/homeContent";
import { aboutFr, servicesFr, faqFr, experienceFr, frDate } from "../../front-office/home/homeContent.fr";

/** Page content in the language of the current URL. English is the base data. */
export function localizeContent(lang) {
  if (lang !== "fr") {
    return { about: aboutContent, services: servicesContent, faq: faqData, experience: professionalExperience };
  }
  return {
    about: { ...aboutContent, ...aboutFr },
    services: servicesContent.map((s) => ({ ...s, ...servicesFr[s.id] })),
    faq: faqData.map((f) => ({ ...f, question: faqFr[f.id]?.[0] ?? f.question, answer: faqFr[f.id]?.[1] ?? f.answer })),
    experience: professionalExperience.map((e, i) => ({
      ...e,
      ...experienceFr[i],
      startDate: frDate(e.startDate),
      endDate: frDate(e.endDate),
    })),
  };
}

export function useContent() {
  return localizeContent(useLang());
}
