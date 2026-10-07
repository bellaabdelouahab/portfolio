# Portfolio

Source of https://abdelouahab.xyz: a server-rendered React site (English and French) for a freelance web developer and data analyst, with a Firestore-backed back office at `/fill-db`.

## Stack

- React 18 and React Router, built with Vite, styled with Tailwind CSS
- Node and Express server (`server/`) that renders pages, serves the sitemap and robots.txt, proxies analytics, and stores uploaded assets
- Firebase Firestore as the content store, Firebase Auth for the back office
- Self-hosted Plausible for analytics, deployed with Coolify on a VPS

## Run locally

```bash
npm ci
cp .env.example .env.local        # fill in the Firebase client values
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
npm start                         # http://localhost:5174
```

`npm run build` creates the production bundles and `npm run serve` runs them.

## Documentation

- `CLAUDE.md`: architecture, deployment and conventions
- `docs/ADDING_PROJECTS.md`: how to add and translate a project from the back office
- `ops/assets-sync/`: backup of uploaded images from the VPS to GitHub
