import { auth } from "../../shared/lib/firebase";

/**
 * Client for the site settings API (server side: /api/site-settings).
 * Settings hold overrides only: an empty or missing value means "use the
 * built-in default from code". Sections: strings, contact, seo, home.
 */
export const SETTINGS_SECTIONS = ["strings", "contact", "seo", "home"];

const EMPTY = () => ({ strings: {}, contact: {}, seo: {}, home: {} });

async function request(method, url, body, withAuth) {
  const headers = {};
  if (withAuth) {
    const user = auth?.currentUser;
    if (!user) throw new Error("Not signed in");
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Settings request failed (${res.status})`);
  return data;
}

/** `{ strings, contact, seo, home }`, every section an object (possibly empty). */
export async function loadSiteSettings() {
  const data = await request("GET", "/api/site-settings", null, false);
  const out = EMPTY();
  for (const s of SETTINGS_SECTIONS) {
    if (data && data[s] && typeof data[s] === "object") out[s] = data[s];
  }
  return out;
}

/** Replaces one whole section. Returns `{ ok, section, updatedAt }`. */
export function saveSiteSection(section, data) {
  if (!SETTINGS_SECTIONS.includes(section)) return Promise.reject(new Error(`Unknown section: ${section}`));
  return request("PUT", `/api/site-settings/${encodeURIComponent(section)}`, { data }, true);
}
