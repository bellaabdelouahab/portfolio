import { applyContactSettings } from "./contactConfig";

/**
 * Site-wide settings the back office can edit (see server/siteSettings.mjs).
 * They are overrides on top of the defaults in code, so every reader must cope
 * with a missing section. The server sets them before each render and injects
 * them as `window.__SITE_SETTINGS__`; the client sets them before hydrating.
 *
 * Shape: { strings: {en,fr}, contact: {...}, seo: { pages }, home: { faq, services } }
 */
let current = {};

const SECTIONS = ["strings", "contact", "seo", "home"];

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

export function setSiteSettings(settings) {
  const next = {};
  for (const key of SECTIONS) next[key] = isObject(settings?.[key]) ? settings[key] : {};
  current = next;
  applyContactSettings(next.contact);
}

export function getSiteSettings() {
  return current;
}
