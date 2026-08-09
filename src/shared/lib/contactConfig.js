/**
 * Single source of truth for contact channels. Three call-to-action spots
 * (hero, Get in Touch, the site-wide floating button) all need the same
 * number/address — keeping it here means updating a phone number is a
 * one-line change instead of a grep across the app.
 */
export const CONTACT_EMAIL = "abdobella977@gmail.com";

// wa.me expects digits only, no leading + or spaces.
const WHATSAPP_NUMBER = "212762549778";

export function getWhatsAppLink(message = "") {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function getMailtoLink(subject = "") {
  const base = `mailto:${CONTACT_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
