// Sitemap, redirects for removed pages, and robots, served by the SSR server so
// they always match what is in Firestore (no build step has to be re-run when a
// project is added in the back office).
import { initializeApp, cert, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://abdelouahab.xyz").replace(/\/+$/, "");

// Pages that used to exist and may still be indexed. 301 keeps their ranking
// and sends visitors somewhere useful instead of a 404.
export const REDIRECTS = {
  "/services/ai": "/services/data",
  "/services/learning": "/services/web",
  "/site-map": "/",
  "/reports": "/",
};

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services/web", priority: "0.9", changefreq: "monthly" },
  { path: "/services/data", priority: "0.9", changefreq: "monthly" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/certificates", priority: "0.5", changefreq: "monthly" },
  { path: "/my-team", priority: "0.4", changefreq: "monthly" },
];

// Same transform as src/shared/lib/projectSlug.js. They must stay identical.
const slug = (title = "") => String(title).replace(/[:|]/g, "").replace(/\s+/g, "-").trim();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => (/^https?:\/\//.test(p) ? p : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

function db() {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: process.env.GOOGLE_APPLICATION_CREDENTIALS
          ? applicationDefault()
          : cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")),
      });
  return getFirestore(app);
}

let cached = { at: 0, xml: "" };

const frPath = (path) => (path === "/" ? "/fr" : `/fr${path}`);

async function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const pages = STATIC_PAGES.map((p) => ({ ...p, lastmod: today, images: [] }));
  try {
    const snap = await db().collection("projects").get();
    snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.hidden !== true && p.title)
      .forEach((p) => {
        pages.push({
          path: `/projects/${slug(p.title)}`,
          lastmod: typeof p.updatedAt === "string" ? p.updatedAt.slice(0, 10) : today,
          priority: (p.caseStudy?.kind || "client") === "client" ? "0.8" : "0.6",
          changefreq: "monthly",
          images: [p.image, ...(p.carouselImages || []).map((c) => c.img)].filter(Boolean).slice(0, 6).map((src) => ({
            loc: abs(src),
            title: p.title,
          })),
        });
      });
  } catch (e) {
    console.error("sitemap: could not read projects", e.message);
  }
  // Every page exists in English and French; each entry lists both so search
  // engines show the right language to the right visitor.
  const entry = (u, path) =>
    `  <url>\n    <loc>${esc(abs(path))}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(abs(u.path))}"/>\n    <xhtml:link rel="alternate" hreflang="fr" href="${esc(abs(frPath(u.path)))}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(u.path))}"/>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>` +
    u.images.map((i) => `\n    <image:image><image:loc>${esc(i.loc)}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`).join("") +
    `\n  </url>`;
  const body = pages.flatMap((u) => [entry(u, u.path), entry(u, frPath(u.path))]).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

export function seoRoutes(app) {
  app.get(["/sitemap.xml", "/sitemaps/sitemap.xml"], async (_req, res) => {
    if (!cached.xml || Date.now() - cached.at > 60 * 60 * 1000) {
      cached = { at: Date.now(), xml: await buildSitemap() };
    }
    res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(cached.xml);
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").set("Cache-Control", "public, max-age=3600").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /fill-db",
        "Disallow: /fr/fill-db",
        "Disallow: /api/",
        "Disallow: /site-map",
        "",
        "# AI crawlers are welcome",
        "User-agent: GPTBot",
        "Allow: /",
        "User-agent: ChatGPT-User",
        "Allow: /",
        "User-agent: Google-Extended",
        "Allow: /",
        "User-agent: PerplexityBot",
        "Allow: /",
        "User-agent: ClaudeBot",
        "Allow: /",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        "",
      ].join("\n"),
    );
  });

  app.use((req, res, next) => {
    const target = REDIRECTS[req.path.replace(/\/+$/, "")];
    if (target) return res.redirect(301, target);
    next();
  });
}
