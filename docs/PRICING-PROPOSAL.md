# Pricing proposal: tiers for data analytics and web (draft, 2026-10-10)

Status: proposal. Nothing on the site has changed yet.

## 1. Why the current numbers hurt
- The data service shows "from 3,000 MAD". A visitor with a large, complex need reads that as the price level of the whole service and expects 3,000; the real quote (30,000 or 60,000) then feels like a bait-and-switch.
- The same word "dashboard" covers a two-day spreadsheet job and a multi-source platform. Published guidance says the same: a freelancer quoting about $6,000 and a consultancy quoting $60,000 for "a Power BI dashboard" are not pricing the same deliverable (Perceptive Analytics).

## 2. What the market says (indicative, sources are blogs and platforms)
| Signal | Figure | Source type |
| --- | --- | --- |
| Morocco-based Power BI / data analyst day rates | about 180 to 250 EUR/day (about 2,000 to 2,700 MAD) | Malt profiles |
| Full-stack freelance day rate, Morocco | 2,500 to 6,000 MAD | Jobsquare guide |
| Data engineer with Spark and Kafka, Paris | 600 to 800 EUR/day | Malt profile (France, not Morocco) |
| SME Power BI dashboards (1 to 4 dashboards, 1 source) | 5,000 to 25,000 USD | Ecosire, Perceptive |
| Mid-size (8 to 15 dashboards, 2 to 3 sources, governance) | 35,000 to 100,000 USD | Perceptive |
| Data preparation share of effort | about 40% of hours | Ecosire |
| Fixed vs day rate | fixed for defined scope, day rate or retainer for evolving platforms | several guides |
| Showcase website, Casablanca, freelance | 12,000 to 30,000 MAD (agency-written, biased) | Kolonell |

Limits: no reliable Moroccan data for big-data day rates or for WordPress prices in MAD was found; Western figures overstate what a Moroccan SME pays, and Moroccan freelance marketplace prices understate what a documented, registered supplier can charge.

## 3. Principles
1. Price by deliverable and scope, in fixed packages; big or unclear work starts with a paid discovery.
2. Check every package against days x day rate: standard work 2,500 MAD/day, big data and architecture 3,500 MAD/day. A package that is below days x rate is a discount you chose.
3. Show a "from" price only for packages whose floor is honest. For the platform tier show "custom quote" with a typical range, so nobody anchors on a low number.
4. Large engagements include a value review meeting (30, 60 or 90 days after launch) to show what the data produced.

## 4. Data analytics (proposal)
| Tier | For | Scope | Time | Price |
| --- | --- | --- | --- | --- |
| **Express analysis** | You hand over a file or an export and want answers or an automated workbook. | One data source, a clear question, cleaned data, an analysis or an automated Excel/Power BI file, a short written summary. One review round. No follow-up. | 1 to 3 days | from 3,000 MAD |
| **Dashboard and reporting** | A team that reports from spreadsheets or exports. | Up to 3 sources, a data model, 3 to 5 report pages, scheduled refresh, KPI definitions, training, 7 days of support (hypercare) included. | 2 to 6 weeks | from 10,000 MAD, typically 10,000 to 30,000 MAD |
| **Data platform** | Large or complex data: millions of rows to terabytes, several systems, pipelines, real time. | Paid discovery first (data mapping, architecture, plan). Then pipelines and storage (for example Spark, Kafka, RabbitMQ or MQTT), a warehouse or lake, dashboards, monitoring, documentation, value review. | 6 weeks and more | discovery 5,000 to 10,000 MAD, then custom quote, typically 40,000 MAD and up |
| **Monthly support** (add-on) | Keep it running and evolve it. | A fixed number of hours per month, priority answers, monitoring. | monthly | 2,500 to 6,000 MAD per month |

Sanity check: Express = 1 to 3 days = 2,500 to 7,500 MAD at standard rate (3,000 is the floor). Dashboard = 4 to 12 days of work plus data preparation. Platform = 15 days and more at 3,500 MAD = 52,500 MAD and up, so 15,000 MAD would be a loss; hence "typically 40,000 and up" after a discovery.

## 5. Web development (proposal)
| Tier | Scope | Time | Price |
| --- | --- | --- | --- |
| **Landing page** | One page, WordPress or a theme, contact form, basic SEO, mobile ready. | 2 to 5 days | from 3,000 MAD |
| **Business website** | 5 to 10 pages, CMS you can edit, blog or news, French and English, SEO foundations, analytics. | 2 to 4 weeks | from 6,000 MAD, typically 6,000 to 15,000 MAD |
| **Online store** | WooCommerce or Shopify, catalogue, payment (CMI or local gateway), delivery rules, product import. | 3 to 6 weeks | from 12,000 MAD |
| **Custom web application** | Accounts and roles, database, admin area, integrations, dashboards. Built with Django, Next.js or similar. Phased delivery with a demo each week. | 6 weeks and more | from 20,000 MAD, custom quote |

Compared with the current site (websites from 6,000, web apps from 15,000): the new floor of 3,000 is real only for a landing page, and the custom application floor rises to 20,000 because 15,000 MAD is about 6 days of work.

## 6. How it would appear on the site
- Each service page shows its tiers as cards: name, who it is for, what is included, time, price ("from ..." or "custom quote").
- The home services section and the FAQ answers ("How much does a website cost?") use the same numbers and wording, English and French, editable from the back office (FAQ and services).
- Search results: descriptions mention "written quote in MAD" but not a single low number.
- Structured data: one Offer per tier with `priceSpecification.minPrice` (custom-quote tiers use the floor only for the discovery).

## 7. Decisions needed
1. Tier names and the number of tiers per service.
2. Data platform: publish "custom quote, typically 40,000 MAD and up", or only "custom quote"?
3. Data Express floor: keep 3,000 MAD as an "Express" tier (my recommendation), or raise to 4,000?
4. Dashboard floor: 8,000 or 10,000 MAD?
5. Show the discovery fee publicly, or only discuss it on the call?
6. Add the monthly support tier publicly or keep it as a sales conversation?
