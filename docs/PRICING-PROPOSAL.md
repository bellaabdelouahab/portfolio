# Pricing: packages for data analytics and web development

Status: agreed structure, implemented on the site (home cards, service pages, FAQ, structured data), English and French. Date: 2026-10-10.

## 1. Why the single "from X MAD" price was replaced
- "From 3,000 MAD" on the data service made a visitor with a large data problem expect 3,000 and then hear 30,000. That feels like a bait and switch.
- The word "dashboard" covers a two-day spreadsheet job and a multi-system platform. Published guidance says the same: a freelancer quoting a few thousand dollars and a consultancy quoting ten times that for "a Power BI dashboard" are not pricing the same deliverable.
- Fix: named packages with what is included, how long it takes, and an honest floor. Big or unclear work shows "custom quote, typically ..." so nobody anchors on a low number.

## 2. The rule: effort-based
No day rate is published. Prices follow effort:
- 3,000 MAD is two or three evenings of work (a landing page, a quick analysis).
- 8,000 MAD is two to three weeks.
- 15,000 MAD is about a month of work.
- 40,000 MAD is three to five months of regular work.
Prices are a guide. Every project gets a written quote after a free 30-minute call.

## 3. Data analytics (service id `data`)
| Package | For | Includes | Time | Price |
| --- | --- | --- | --- | --- |
| **Express analysis** | A file, an export or a spreadsheet; you need answers or an automated workbook. | Data cleaning and checks; the analysis or an automated Excel or Power BI file; formulas and steps documented for reuse; a short written summary of findings and what they mean for decisions; one review call. Not included: ongoing support. | 1 to 3 days | from 3,000 MAD |
| **Dashboard and reporting** | Teams that report from spreadsheets and exports. | Up to 3 data sources; a data model; 3 to 5 report pages; scheduled refresh; KPI definitions agreed with you; a training session; 7 days of support after launch. | 2 to 6 weeks | from 8,000 MAD, typically 8,000 to 15,000 MAD |
| **Data platform** | Large or complex data (millions of rows up to terabytes), several systems, pipelines, real time. | A short paid discovery to map the data and agree a plan; phased delivery with a demo each phase; pipelines and storage (Spark, Kafka, RabbitMQ or MQTT where needed); a warehouse or lake; dashboards; monitoring; documentation; a value review 30, 60 and 90 days after launch. | 1 to 5 months | from 15,000 MAD, custom quote, typically 15,000 to 40,000 MAD and more |

Express carries a note: verified results and an accountable person, not a one-off chatbot answer. This matters because marketplace entry prices (see section 5) make small jobs look cheap; the "what you get" list is what justifies the price.

## 4. Web development (service id `web`)
| Package | Includes | Time | Price |
| --- | --- | --- | --- |
| **Landing page** | WordPress or a theme, contact form, basic SEO, mobile ready. | 2 to 5 days | from 3,000 MAD |
| **Business website** | 5 to 10 pages, a CMS you can edit, French and English, SEO foundations, analytics. | 2 to 4 weeks | from 6,000 MAD, typically 6,000 to 10,000 MAD |
| **Online store** | WooCommerce or Shopify, catalogue, payment such as CMI, delivery rules, product import. | 3 to 6 weeks | from 8,000 MAD, typically 8,000 to 15,000 MAD |
| **Custom web application** | Accounts and roles, database, admin area, integrations, dashboards; Django, Next.js or similar; a working demo every week. | 4 weeks and more | from 15,000 MAD, custom quote, typically 15,000 to 40,000 MAD and more |

## 5. Market jobs (context, indicative)
Typical Moroccan freelance data jobs:
- Excel automation and cleaning.
- Replacing spreadsheets by Power BI dashboards, with alerts.
- E-commerce dashboards.
- ETL and data migration.
- Reporting automation.

Reference points:
- Marketplace entry prices of 10 to 60 USD per small task exist. They are the reason Express needs its "what you get" list and the accountability note: the buyer must see what a 3,000 MAD job contains that a marketplace gig does not (documented, reusable, reviewed, from a registered supplier who issues an invoice).
- Employee analyst salaries in Morocco: 5,000 to 9,000 MAD a month for juniors, 8,000 to 15,000 MAD for experienced analysts. So 15,000 MAD is about a month of an experienced analyst, which is why a "full project" starts there.
- Western price guides (5,000 to 100,000 USD for Power BI projects) overstate what a Moroccan SME pays and are not used as anchors.

## 6. How it appears on the site
- Service pages: a Packages section after "What you get": cards with name, who it is for, included items, time and price, a "Book a call" button per card, and a line "Not sure which one fits? Book a free 30-minute call." with the Book a meeting button.
- Home cards headline: web "Landing pages from 3,000 MAD, applications from 15,000 MAD"; data "Express analysis from 3,000 MAD, full projects from 15,000 MAD".
- FAQ answers (price and duration questions) use the same numbers in English and French.
- Search descriptions say "written quote in MAD" and name no single low number.
- Structured data: the Service JSON-LD has one `Offer` per package with `priceSpecification.minPrice` in MAD; the home OfferCatalog uses the service minimum (`priceFrom`).
- Back office (FAQ and services): `priceFrom` override changes the first number of the headline and the service minimum in the home OfferCatalog. Package prices are edited in `homeContent.js` and `homeContent.fr.js`.

## 7. Open points
1. Monthly support as a public add-on, or kept as a conversation on the call (earlier idea: 2,500 to 6,000 MAD a month).
2. Whether to show the paid discovery fee for the Data platform publicly or only discuss it on the call.
3. Revisit the floors after the first five quotes: if Express jobs regularly take more than three days, raise the floor to 4,000 MAD.
