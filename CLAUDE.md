# CLAUDE.md

Guidance for working in this repository.

## Commands

```bash
npm start        # SSR dev server (Vite middleware) on http://localhost:5174
npm run build    # client + server bundles into ./build
npm run serve    # production server from ./build
```

There is no test runner. Pages need Firebase admin credentials to render (`GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT`) and the client values in `.env.local` (see `.env.example`).

## Architecture

React 18 + React Router, built with Vite, styled with Tailwind plus a few legacy global stylesheets. An Express server (`server/index.mjs`) renders every page with `renderToString`, so crawlers get full HTML. **Firestore is the CMS.** The browser never loads the Firebase SDK on public pages; it reads `/api/content/:collection` (cached JSON, `server/content.mjs`). Only the back office (`/fill-db`) loads Firebase.

```
src/
  routes.jsx            route table, used by server and client; mounted at / and /fr
  entry-client.jsx      hydration
  entry-server.jsx      SSR render
  front-office/         public pages (home, projects, services, certificates, team, articles)
  back-office/          /fill-db admin: overview, project wizard, project list, certificates, testimonials, storage, analytics link. Screens are built from the kit in back-office/ui
  shared/               lib/, ui/, styles/, i18n/
server/                 index.mjs (SSR), assets.mjs, content.mjs, seo.mjs, stats.mjs
ops/assets-sync/        VPS backup scripts
docs/                   ADDING_PROJECTS.md
```

Rules: a page is the one component a route renders, named `<Feature>Page.jsx`; everything else lives in the feature that owns it; move code to `shared/` only when a second feature needs it.

## Deployment

Coolify builds the `Dockerfile` on the owner's VPS from `master`; a push redeploys. Build variables: `VITE_*` (Firebase client config, `VITE_SITE_URL`). Runtime: `FIREBASE_SERVICE_ACCOUNT_B64`, `SITE_URL`.

- `server/assets.mjs`: back-office uploads go to the persistent volume `/data/uploads` and are served before the built-in files. `ops/assets-sync/sync.sh` (cron, every 5 minutes) backs them up to the `uploads` branch, commits at most once an hour with a dedicated identity, and writes `.sync-status.json` for the back office Storage tab. It never deletes from the backup; `restore.sh` restores.
- `server/seo.mjs`: `/sitemap.xml` (from Firestore, English and French with hreflang), `/robots.txt`, 301 redirects for removed pages. Add new static pages to `STATIC_PAGES`.
- `server/stats.mjs`: first-party proxy for the self-hosted Plausible (`/_s/a.js`, `/_s/e`) so ad blockers do not drop it.

## Content and languages

- Projects live in Firestore. The `caseStudy` field drives the card and the page (kind client or personal, services, client, role, status, liveUrl, summary, challenge, solution, outcome, results, features). `hidden: true` removes a project from every page. See `docs/ADDING_PROJECTS.md`.
- English and French: `/fr/...` is French. The language comes from the URL (`shared/i18n/i18n.js`). Interface strings are in `shared/i18n/strings.js`; services, FAQ and experience in `front-office/home/homeContent.js` (English) and `homeContent.fr.js`; each project has its French text in the `fr` field. Always build links with `useLocalePath()`.
- Slugs come from `slugifyProjectTitle()` (`shared/lib/projectSlug.js`) using the English title; `server/seo.mjs` has the same function and the two must stay identical.

## SEO

`shared/ui/SEO.jsx` is rendered by every page: title (brand suffix dropped past 62 characters), description (clipped at 158), canonical, hreflang, Open Graph, JSON-LD, breadcrumbs. Absolute URLs go through `shared/lib/siteConfig.js` (`getAbsoluteUrl`), never hardcoded. Business facts (name, phone, prices) live in `shared/lib/contactConfig.js` and `homeContent.js`.

## Conventions

- No `import React` needed (`esbuild.jsxInject`). Aliases: `assets`, `shared`, `front-office`, `back-office`.
- Tailwind v4 utilities for new work. `legacy-base.css`, `global.css` and `minw-1000.css` are unlayered and outrank utilities: when a utility loses, add `!` (for example `tracking-[1px]!`, `text-success!` on links).
- CSS `url()` to images uses the `assets/` alias, never a file-relative path.
- Images: WebP, 1440 px wide at most, `loading="lazy"` below the fold. Hero images use `fetchpriority="high"`.
- Never commit `serviceAccountKey.json` or `.env*`.
