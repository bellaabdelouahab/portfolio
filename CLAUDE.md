# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                 # Vite dev server on http://localhost:3000
npm run build             # vite build -> ./build, then prerenders every route
npm run build:only        # vite build with no prerender pass (faster; not deployable)
npm run prerender         # prerender an existing ./build in place
npm run serve             # Preview the production build
npm run generate-sitemap  # Firestore -> public/sitemaps/sitemap.xml + prerender-routes.json
npm run deploy            # gh-pages -d build (predeploy runs the build)
```

Run `generate-sitemap` **before** `build` for a fully correct output — it writes the route
manifest that tells the prerenderer which project detail pages exist. Without it the
prerenderer falls back to static routes only and warns. CI does this in the right order.

There is **no test runner configured**. `@testing-library/*` is in `dependencies` and `README.md` is unmodified Create React App boilerplate — both are stale leftovers from the CRA-to-Vite migration. `README.md` describes commands (`npm test`, `npm run eject`) that do not exist; don't trust it.

`npm run clean` uses Windows `rmdir /s /q` and only works on Windows.

## Architecture

Vite + React 18 SPA, deployed as a static bundle to GitHub Pages (`abdelouahab.xyz`, see `CNAME`). **Firebase Firestore is the CMS** — there is no backend server of this repo's own.

### Data flow

All content (projects, certificates, reports, clients, visitor stats) lives in Firestore and is read directly from the browser via the modular `firebase/firestore` SDK. `src/firebase.js` initializes the singleton `db` and `auth`.

Two fetching patterns coexist:
- **React Router loaders** — `src/App.jsx` attaches loaders to routes (`getHighlightedProjects` from `views/Home.jsx`, `getProjects` from `views/Projects.jsx`, `getReports` from `views/Reports.jsx`, `getAllCertificates` from `utils/firebaseQueries.js`). Note the loader functions are exported from the view files themselves, not from a data layer.
- **`useEffect` + local state** — `views/Project.jsx` fetches by URL slug, using `location.state` as an optimistic first paint before refetching.

`views/Project.jsx` resolves a project from the URL slug in two steps: an indexed `where("title", "==", slug.replace(/-/g, " "))` fast path, then a fallback that fetches the collection and compares `slugifyProjectTitle(doc.title)` against the slug. The fallback is not optional — slugging is **lossy** (it strips `:` and `|` and collapses whitespace), so titles like `FastX: Revolutionizing Parcel Delivery Operations` and `ICAMAI 2024 | Conference Website` can never be recovered by swapping dashes back to spaces. Both previously rendered "Project Not Found".

`src/utils/projectSlug.js` and `slugifyTitle()` in `scripts/generate-sitemap.js` implement the same transform for the client and the build. **They must stay identical** — if they drift, the prerenderer writes pages at paths the app cannot resolve.

`utils/axios.jsx` points at a `BACKEND_API` that is not part of the current architecture; treat it as legacy.

### Routing

`src/App.jsx` is the single source of route truth: `createBrowserRouter` (clean URLs, no hash) with every view `React.lazy`-loaded behind a shared `Suspense` fallback. `views/Root.jsx` is the layout shell (navbar + `<Outlet>` + global Helmet tags).

Static hosting needs a SPA fallback — `_redirects` handles Netlify-style hosts; GitHub Pages relies on the 404 fallback pattern.

`/fill-db` is the admin back-office (`views/back-office/BackOffice.jsx`). It gates on Firebase Auth and hard-codes the single allowed owner email; any other signed-in user is immediately signed out. It carries `noIndex`.

### SEO layer

This is the most actively-worked part of the repo. Read `SEO_STATE_HANDOFF.md` (audit + what's fixed) and `SEO_REMAINING_TASKS.md` (open work) before touching anything SEO-related.

- `src/components/common/SEO.jsx` is the shared per-route metadata component (React Helmet): title/description/keywords, OG + Twitter tags, canonical, robots, JSON-LD, and an optional `serviceSchemaBlocks` array for extra `Service` schema. It accepts both `noIndex` and `noindex`.
- **All absolute URLs must go through `utils/siteConfig.js` (`getAbsoluteUrl`, `normalizeSiteUrl`)** — never hardcode the domain.
- `index.html` holds the baseline metadata shell; keep it consistent with what `SEO.jsx` injects at runtime.
- `src/content/homeContent.js` holds the marketing copy (about, services) that also feeds structured data — edit copy there, not inline in components.
### Static generation (this is what makes the site indexable)

GitHub Pages has no server-side rewrite: it answers any path that isn't a real file with `404.html` at **HTTP status 404**. Googlebot stops at a 404 and never runs JS, so client-side routes cannot be indexed no matter what the SPA renders. The `spa-github-pages` redirect in `public/404.html` fixes navigation for humans but not for crawlers.

`scripts/prerender.js` (runs as part of `npm run build`) solves this by writing a real `build/<route>/index.html` for every route, so `/projects` is served as a genuine 200 with fully rendered markup. It boots the built bundle against a local static server and drives real Chrome via puppeteer.

Things to know before touching it:
- **Routes come from `prerender-routes.json`**, written by `scripts/generate-sitemap.js` from the same Firestore query that builds the sitemap. This is deliberate — generated pages and advertised URLs cannot drift apart. Add a route to `staticRoutes` there, not to the prerenderer.
- It waits on the DOM, **not** `networkidle` — the Firestore SDK holds a long-lived connection, so network idle never fires. The wait must reject every *intermediate* state, not just the empty one: a skeleton screen has a populated `#root` and visible text, so a naive check silently bakes `Loading Project` into the deployed HTML. It currently rejects `.preloader`, `.react-loading-skeleton`, and any `document.title` starting with `Loading`. Add to that list when you add a new loading state.
- Its static server serves real files only for asset-looking requests (paths with an extension); navigation requests always get the un-prerendered shell. Otherwise re-running the prerender over an existing build feeds it its own stale output.
- `window.__PRERENDER__` is set during the pass; `src/App.jsx` checks it to skip `trackVisitor()`, which would otherwise write a fake visitor record per route on every build and every nightly cron run.
- A failed route fails the build. That's intentional — silently shipping a 404-ing route is the bug this replaced.
- The previous `vite-plugin-prerender` + jsdom setup silently produced nothing (jsdom snapshotted before the lazy chunks and Firestore reads resolved) and shipped an empty `<div id="root">` on every deploy. Don't reintroduce it.

`#static-seo-copy` in `index.html` is removed on `DOMContentLoaded`, so it never appears in prerendered output — it only serves non-JS fetchers of the raw shell. Keep it that way; leaving it in rendered output alongside the real content would be duplicate/cloaked copy.

`scripts/generate-sitemap.js` is CommonJS (the rest of the repo is ESM), runs under Node in CI via `.github/workflows/deploy.yml`, and uses **firebase-admin**, not the client SDK. It exits non-zero if it had to fall back to stub data. `src/utils/sitemapGenerator.js` + `src/views/api/SitemapXml.jsx` are a separate client-side dev helper — not the production pipeline.

## Conventions and gotchas

**Env vars are read two different ways, and both matter:**
- `vite.config.js` `define`s the whole `process.env` object from a manually-parsed `.env` / `.env.production` / `.env.example`. `src/firebase.js` reads `process.env.VITE_FIREBASE_*` through this mechanism.
- `utils/siteConfig.js` reads `import.meta.env.VITE_SITE_URL` (Vite's native mechanism).

Adding a var may require accounting for both paths. In CI, `deploy.yml` writes `.env.production` from GitHub secrets.

**No `import React` needed** — `vite.config.js` sets `esbuild.jsxInject`, so React is injected into every file. Existing files that import it explicitly are harmless but redundant.

**Path aliases** (`vite.config.js`): `components`, `views`, `assets`, `utils` map to the matching `src/` dirs. The codebase mixes these with relative imports freely, sometimes within the same file — match whatever the file already does.

**Styling** is plain CSS/SCSS with no framework: global `src/index.css` + `src/minw-1000.css`, per-page stylesheets in `src/assets/css/`, and a couple of CSS Modules (`MusicPicks.module.css`). Imports are side-effectful (`import "../assets/css/project.css"`), so class names are global — check for collisions before adding generic selectors.

**Direct DOM manipulation** appears in several views (star-field generation in `Project.jsx`, `IntersectionObserver` reveal animations in `Home.jsx`, scroll reset in `Root.jsx`). It's the established pattern here, not an accident.

**`serviceAccountKey.json` sits untracked in the repo root and is not covered by `.gitignore`.** Don't `git add` it, and don't reference it from committed code — `migrate.js` (a one-off Firestore import script) references another such key file by name.
