# SEO notes

Search text for every page is written around what people type, not around the page's name. Defaults live in `src/shared/lib/seoPages.js` (and `seoTitle`/`seoDescription` in `src/front-office/home/homeContent*.js` for the two services); the back office (Website, SEO) overrides any of them per page and language, and each project has its own optional `seo` field in the project wizard.

## What people search (Google autosuggest, Morocco, October 2026)

Autosuggest shows real queries but not volume. Volumes need Search Console (a few weeks of data).

| Intent | Queries seen |
| --- | --- |
| Local, build a site | création site web agadir, agence création site web agadir, création site internet agadir, développeur web agadir, développement web agadir |
| National, build a site | créer un site web maroc, création site web maroc prix, création site web maroc pas cher, création site web vitrine maroc, site e-commerce maroc prix, création site e-commerce maroc, shopify maroc (prix, cmi), développeur web freelance maroc |
| Data, buy | power bi maroc, freelance power bi maroc, consultant data maroc, hire power bi developer, power bi dashboard freelancer |
| Data, examples | dashboard power bi exemple, dashboard power bi template, dashboard power bi design |
| English | web developer morocco, freelance web developer, hire web developer morocco |
| Not your customers | salaire développeur, stage, formation power bi, data analyst jobs, emploi (job seekers and students) |

## What each page targets

- Home: "développeur web freelance Agadir", "création site web Agadir", "web developer Morocco". Brand in the title because people also search the name.
- Web service: "création de site web Agadir / Maroc", site vitrine, boutique en ligne, WordPress, Shopify.
- Data service: "Power BI Maroc", "freelance Power BI", "analyste de données".
- Projects: "exemples de sites web", "exemples de tableaux de bord Power BI", case studies.
- Certificates: people arrive by the name, so the title carries the name and the recognised credentials (IBM Data Analyst).
- Team: "équipe développement web Agadir".
- Project pages: set `seo` on projects that match a real query (Copag: Power BI dashboard example; FastX: parcel delivery software).

## Honest limits

- A new domain has little authority. "agence ... Agadir" queries are dominated by agencies; the realistic wins are long, specific queries ("développeur web freelance Agadir", "créer un site web à Agadir", "tableau de bord Power BI Maroc") and your own name.
- What moves rankings next is outside the code: a Google Business Profile (service area Agadir), profiles on Malt, GoAfrica and LesMRE linking to the site, links from client sites you built, and consistent name and phone everywhere.
- Review Search Console "Performance > Queries" every month and rewrite titles for the queries that already show impressions.
