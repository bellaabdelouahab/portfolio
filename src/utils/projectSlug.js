/**
 * Turns a Firestore project title into the URL slug used at /projects/<slug>.
 *
 * This MUST stay identical to slugifyTitle() in scripts/generate-sitemap.js,
 * which builds the sitemap entries and the prerender route list. If the two
 * drift, prerendered pages get written at paths the app cannot resolve.
 */
export const slugifyProjectTitle = (title = "") =>
  String(title)
    .replace(/[:|]/g, "")
    .replace(/\s+/g, "-")
    .trim();
