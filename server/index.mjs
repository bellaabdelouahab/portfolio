// .mjs, not .js: the rest of this repo is ESM-via-Vite-transform, but
// scripts/generate-sitemap.js is deliberately CommonJS, so package.json
// can't carry "type": "module" without breaking it. .mjs opts this one file
// into real ESM (needed for top-level `import`/await) without that change.
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import { assetRoutes, uploadsStatic } from "./assets.mjs";
import { draftRoutes } from "./drafts.mjs";
import { seoRoutes } from "./seo.mjs";
import { contentRoutes } from "./content.mjs";
import { statsRoutes } from "./stats.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5174;
const base = process.env.BASE || "/";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(compression());
seoRoutes(app);
contentRoutes(app);
statsRoutes(app);

// Back-office asset API and uploaded files (see server/assets.mjs).
app.use("/api/assets", assetRoutes());
// Back-office drafts: unfinished project edits kept on the server (server/drafts.mjs).
app.use("/api/drafts", draftRoutes());
// The directory only ever contains images/ and reports/ (dotfiles are not served).
app.use(uploadsStatic());

let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  app.use(
    base,
    express.static(path.resolve(__dirname, "../build/client"), {
      index: false,
      // Vite fingerprints everything under /assets, so it can be cached for a
      // year. Other files (images, icons) are revalidated after a week.
      setHeaders(res, file) {
        res.setHeader(
          "Cache-Control",
          file.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=31536000, immutable" : "public, max-age=604800",
        );
      },
    })
  );
}

// Express 5's router (path-to-regexp v8) dropped bare "*" wildcard support —
// a RegExp route is the version-agnostic catch-all.
app.use(/.*/, async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "/");
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    let template;
    let render;
    if (!isProduction) {
      template = await fs.readFile(path.resolve(__dirname, "../index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = await fs.readFile(
        path.resolve(__dirname, "../build/client/index.html"),
        "utf-8"
      );
      render = (await import("../build/server/entry-server.mjs")).render;
    }

    const result = await render(fullUrl, req.headers);

    if (result.redirect) {
      res.redirect(result.redirect.status, result.redirect.headers.get("Location"));
      return;
    }

    const { appHtml, helmet, statusCode, hydrationData } = result;

    // Serialize with < escaped: hydrationData can legitimately contain user
    // text (e.g. project descriptions) with a literal "</script>" substring,
    // which would otherwise terminate this script tag early.
    const hydrationScript = `<script>window.__staticRouterHydrationData = ${JSON.stringify(
      hydrationData
    ).replace(/</g, "\\u003c")};</script>`;

    const lang = /^\/fr(\/|\?|$)/.test(req.originalUrl) ? "fr" : "en";
    const html = template
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace(
        "<!--app-head-->",
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}`
      )
      .replace("<!--app-html-->", appHtml)
      .replace("<!--hydration-data-->", hydrationScript);

    res.status(statusCode).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`SSR server listening on http://localhost:${port}`);
});
