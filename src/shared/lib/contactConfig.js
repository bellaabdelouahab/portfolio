/**
 * Single source of truth for contact channels. Three call-to-action spots
 * (hero, Get in Touch, the site-wide floating button) all need the same
 * number/address — keeping it here means updating a phone number is a
 * one-line change instead of a grep across the app.
 *
 * The values below are defaults. The back office can override them
 * (shared/lib/siteSettings.js calls `applyContactSettings`), so the exported
 * `let` bindings are live: read them at render time, never copy them into a
 * module-level constant.
 */
export const CONTACT_DEFAULTS = {
  // wa.me expects digits only, no leading + or spaces.
  whatsappNumber: "212762549778",
  phoneDisplay: "+212 762 549 778",
  email: "abdobella977@gmail.com",
  bookingUrl: "https://calendly.com/abdobella977/30min",
  // The 15-digit business identifier on invoices; hidden while empty.
  ice: "003832227000062",
  githubUrl: "https://github.com/bellaabdelouahab",
  linkedinUrl: "https://linkedin.com/in/abdelouahab-bella",
};

export let CONTACT_EMAIL = CONTACT_DEFAULTS.email;
export let BOOKING_URL = CONTACT_DEFAULTS.bookingUrl;
export let GITHUB_URL = CONTACT_DEFAULTS.githubUrl;
export let LINKEDIN_URL = CONTACT_DEFAULTS.linkedinUrl;
export let PHONE_DISPLAY = CONTACT_DEFAULTS.phoneDisplay;
let whatsappNumber = CONTACT_DEFAULTS.whatsappNumber;

/**
 * Legal status shown across the site. `ice` follows the override; it stays
 * hidden while empty rather than showing a placeholder.
 */
export const BUSINESS = {
  status: "Registered auto-entrepreneur",
  ice: CONTACT_DEFAULTS.ice,
};

const text = (v) => (typeof v === "string" && v.trim() ? v.trim() : "");

/** Applies the `contact` settings section over the defaults. Safe with anything. */
export function applyContactSettings(contact) {
  const c = contact && typeof contact === "object" ? contact : {};
  const pick = (key) => text(c[key]) || CONTACT_DEFAULTS[key];
  const digits = text(c.whatsappNumber).replace(/\D/g, "");
  whatsappNumber = digits || CONTACT_DEFAULTS.whatsappNumber;
  PHONE_DISPLAY = pick("phoneDisplay");
  CONTACT_EMAIL = pick("email");
  BOOKING_URL = pick("bookingUrl");
  GITHUB_URL = pick("githubUrl");
  LINKEDIN_URL = pick("linkedinUrl");
  BUSINESS.ice = text(c.ice) || CONTACT_DEFAULTS.ice;
}

export function getWhatsAppLink(message = "") {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function getMailtoLink(subject = "") {
  const base = `mailto:${CONTACT_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** International format for structured data: "+212762549778". */
export function getTelephone() {
  return `+${whatsappNumber}`;
}
