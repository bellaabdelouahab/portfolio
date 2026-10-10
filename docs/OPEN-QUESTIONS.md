# Open questions and follow-ups (parked 2026-10-10)

Parked so the mobile work and the pricing rework can go first. Nothing here blocks the site.

## A. Decisions waiting for the owner
1. **Business name for Google Business Profile.** Keep "Abdelouahab Bella" (zero risk, matches ICE, invoices, site) or adopt a brand. Candidates checked: Bella Digital (.com taken, .ma looked free), Bella Data & Web, Souss Digital (.com and .ma looked free). Before any rebrand: ask the RNAE (ae.gov.ma) or an accountant whether an auto-entrepreneur may trade under a name other than their own, and check OMPIC (ompic.ma). Google rule: the profile name must be the real-world name used everywhere; no city or service keywords in the name.
2. **`tools.resources` on project pages.** The field is saved but never shown on the public project page. Show it (as a "Resources" list) or drop the field from the wizard?
3. **Pricing structure** (see docs/PRICING-PROPOSAL.md): approve tiers, then implement.
4. **Certificates still hidden:** "Train a Supervised Machine Learning Model" and "Create a Web Application With React.js" (OpenClassrooms needs a premium plan to show the certificate). Show them again only with a real link.
5. **Home projects board:** only three can be on the home page. Keep three, or allow four?
6. **French wording:** reviewed by the assistant only; proofread anything legal or price-related before relying on it (devis, auto-entrepreneur, ICE line).

## B. Things only the owner can do
1. In Search Console, URL inspection then Request indexing for: `/`, `/fr`, `/services/web`, `/services/data`, `/fr/services/web`, `/fr/services/data`, `/contact`, `/projects` (about 10 per day allowed).
2. Re-check Search Console in 3 to 4 weeks (Performance, Queries) and send what appears; titles get tuned from real queries.
3. Create the Google Business Profile (service area Agadir, address hidden) with the same name, phone and website as everywhere else.
4. Create or update profiles that link to the site: Malt, GoAfrica, LesMRE, Telecontact.ma, LinkedIn website field, Upwork or Fiverr if used.
5. Ask public client sites for a small "Site by Abdelouahab Bella" credit: S-Maint, NidInnovation, the ICAMAI conference site.
6. Optional: ask GitHub support to purge cached views of the six rewritten repos (SM-project-fork, innovation-site, CF-ENSA, masser-ahmed-pfe, Ibee, CREJA).

## C. Things to test or verify
1. Publish one real project edit from the wizard (real Firestore write and image upload were not tested in a browser).
2. Drag and drop on the home board with a real mouse and on a phone.
3. The "leave without saving" confirmation was only compiled, not clicked through.
4. After the soft-404 fix: URL inspection live test on `/fr` should say "available to Google".

## D. Product ideas parked
1. iBee load test to state a real capacity (hives per server, readings per minute).
2. Per-project SEO text for the remaining projects (four done: Copag, FastX, CRJEA, ICAMAI).
3. Wasp or ant attack detection is not possible from the current sensors; robbing and predator attacks are covered by the entrance-activity rule.
4. A shared "credit" link or badge for client sites.
5. Search Console: monthly review of queries and impressions; rewrite titles for pages with impressions but no clicks.

## E. Known limits (documented, accepted)
- Content edits (site text, SEO, contact) show on the site within about 30 seconds; an open tab needs a refresh.
- The phone number is now public on the home page (Get in touch); it can be removed from the string "contact.phoneLine".
