import { useLoaderData } from "react-router-dom";
import { getCollectionDocs } from "../../shared/lib/firestoreAccess";
import { byNewest } from "../../shared/lib/dates";
import { servicesContent } from "../home/homeContent";
import { useLang, useLocalePath, withLang } from "../../shared/i18n/i18n";
import { useT } from "../../shared/i18n/strings";
import { useContent } from "../../shared/i18n/useContent";
import { ProjectCard } from "../projects/components/ProjectCard";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import SEO from "../../shared/ui/SEO";
import BusinessStatus from "../../shared/ui/BusinessStatus";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";
import { BOOKING_URL } from "../../shared/lib/contactConfig";

const RELATED_PROJECTS_LIMIT = 3;

/**
 * Two slow rows of client-project screenshots drifting in opposite directions
 * behind the hero. Opacity is low and a mask fades them out before the content
 * starts, so they read as texture rather than competing with the text. The
 * motion stops for visitors who prefer reduced motion.
 */
function Backdrop({ images }) {
  if (!images?.length) return null;
  const row = [...images, ...images, ...images, ...images];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] overflow-hidden opacity-[0.10] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
    >
      {[0, 1].map((r) => (
        <div
          key={r}
          className={`flex w-max gap-4 pt-4 ${r ? "animate-[drift-reverse_90s_linear_infinite]" : "animate-[drift_90s_linear_infinite]"} motion-reduce:animate-none`}
        >
          {(r ? [...row].reverse() : row).map((src, i) => (
            <img key={`${r}-${i}`} src={src} alt="" loading="lazy" className="h-60 w-[26rem] shrink-0 rounded-md object-cover" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Related projects come from Firestore `projects.tags`, but those tags are
 * freeform and sparse (most appear on a single project — see homeContent.js's
 * comment on relatedProjectTags), so a strict tag filter alone would leave
 * some services with one card or none. Filling up to the limit with the most
 * recent remaining projects keeps the section from looking broken/empty
 * while still favoring genuinely related work when it exists.
 */
export async function getServiceDetail({ params }) {
  const service = servicesContent.find((s) => s.id === params.id);
  if (!service) {
    throw new Response("Service not found", { status: 404 });
  }

  const docs = await getCollectionDocs("projects");
  const allProjects = docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .sort(byNewest("startDate"));

  const visible = allProjects.filter((p) => p.hidden !== true);
  const tagged = visible.filter(
    (p) => (p.caseStudy?.kind || "client") === "client" && (p.caseStudy?.services || []).includes(service.id),
  );

  const relatedProjects =
    tagged.length >= RELATED_PROJECTS_LIMIT
      ? tagged.slice(0, RELATED_PROJECTS_LIMIT)
      : [
          ...tagged,
          ...visible
            .filter((project) => !tagged.some((t) => t._id === project._id))
            .slice(0, RELATED_PROJECTS_LIMIT - tagged.length),
        ];

  const backdrop = allProjects
    .filter((p) => p.hidden !== true && (p.caseStudy?.kind || "client") === "client" && (p.caseStudy?.services || []).includes(service.id) && p.image)
    .map((p) => p.image);

  return { service, relatedProjects, backdrop };
}

export default function ServiceDetailPage() {
  const { service: baseService, relatedProjects, backdrop } = useLoaderData();
  const t = useT();
  const lang = useLang();
  const lp = useLocalePath();
  const { services, experience } = useContent();
  const service = services.find((s) => s.id === baseService.id) || baseService;
  const relevantExperience = experience.filter((exp) =>
    (exp.services || []).includes(service.id),
  );

  const tiers = service.tiers || [];
  const gridCols = tiers.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.seoDescription || service.longDescription || service.description,
    serviceType: service.serviceType,
    provider: { "@id": getAbsoluteUrl("/#business") },
    areaServed: [{ "@type": "Country", name: "Morocco" }, { "@type": "City", name: "Agadir" }],
    url: getAbsoluteUrl(withLang(lang, `/services/${service.id}`)),
    inLanguage: lang,
    // One Offer per package; falls back to a single service-level offer.
    offers: tiers.length
      ? tiers.map((tier) => ({
          "@type": "Offer",
          name: tier.name,
          description: tier.audience,
          priceCurrency: "MAD",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "MAD", minPrice: tier.priceFrom },
        }))
      : {
          "@type": "Offer",
          priceCurrency: "MAD",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "MAD", minPrice: service.priceFrom },
        },
  };

  return (
    <div className="relative">
      <Backdrop images={backdrop} />
    <div className="relative mx-auto w-full max-w-5xl px-5 py-10">
      <SEO
        title={service.seoTitle || service.title}
        description={service.seoDescription || service.longDescription || service.description}
        keywords={`${service.title}, ${service.serviceType}, Agadir, ${lang === "fr" ? "Maroc" : "Morocco"}, freelance`}
        structuredData={structuredData}
        breadcrumbs={[[t("nav.home"), "/"], [service.title, `/services/${service.id}`]]}
      />

      <div className="mb-10 flex flex-col items-center text-center">
        <img src={service.icon} alt="" width="75" height="75" className="mb-5" />
        <h1 className="mb-5 text-4xl leading-snug font-bold text-success">{service.title}</h1>
        <p className="mb-2 text-sm font-bold tracking-[2px]! text-success uppercase">{t("svc.agadir")}</p>
        <p className="max-w-3xl text-lg leading-relaxed text-ink">
          {service.longDescription || service.description}
        </p>
        {service.startingPrice && (
          <p className="mt-4 text-xl font-bold text-ink-strong">
            {service.startingPrice}
            <span className="ml-2 text-sm font-normal text-ink/70">{t("svc.priceNote")}</span>
          </p>
        )}
      </div>

      {service.deliverables?.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl leading-snug font-bold text-ink-strong">{t("svc.get")}</h2>
          <ul className="grid gap-x-8 gap-y-4 rounded-md border border-line bg-surface p-6 md:grid-cols-2">
            {service.deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-base leading-snug text-ink">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-success" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {d}
              </li>
            ))}
          </ul>
        </section>
      )}

      {tiers.length > 0 && (
        <section className="mb-12" aria-labelledby="packages-title">
          <h2 id="packages-title" className="mb-2 text-2xl leading-snug font-bold text-ink-strong">{t("svc.packages")}</h2>
          <p className="mb-5 text-base text-ink">{t("svc.packagesLead")}</p>
          <ul className={`grid gap-4 sm:grid-cols-2 ${gridCols}`}>
            {tiers.map((tier) => (
              <li key={tier.id} className={`flex flex-col rounded-md border bg-surface p-5 ${tier.custom ? "border-success/60" : "border-line"}`}>
                <h3 className="text-lg leading-snug font-bold text-ink-strong">{tier.name}</h3>
                <p className="mt-2 text-xs font-bold tracking-[1px]! text-success uppercase">{t("svc.pkgFor")}</p>
                <p className="mt-1 text-sm leading-snug text-ink">{tier.audience}</p>
                <ul className="mt-4 space-y-2 text-sm leading-snug text-ink">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-success" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {tier.note && <p className="mt-3 text-sm leading-snug text-ink-muted italic">{tier.note}</p>}
                {tier.excludes && (
                  <p className="mt-2 text-sm leading-snug text-ink-muted">{t("svc.pkgNotIncluded")} {tier.excludes}.</p>
                )}
                <div className="mt-auto pt-5">
                  <p className="text-xs text-ink-muted">{t("svc.pkgTime")}: <span className="font-bold text-ink">{tier.duration}</span></p>
                  <p className="mt-2 text-xl leading-snug font-bold text-ink-strong">{tier.priceLabel}</p>
                  {tier.priceNote && <p className="text-sm leading-snug text-ink">{tier.priceNote}</p>}
                  <a
                    href={BOOKING_URL}
                    onClick={() => window.plausible?.("Contact: Book a meeting")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-sm border border-success px-4 py-2 text-sm font-bold tracking-[1px]! text-success! transition-colors hover:bg-success/10"
                  >
                    {t("cta.bookCall")}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-5">
            <p className="text-base text-ink">{t("svc.pkgNotSure")}</p>
            <a
              href={BOOKING_URL}
              onClick={() => window.plausible?.("Contact: Book a meeting")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-success px-5 py-2.5 text-sm font-bold tracking-[1px]! text-black! transition-transform duration-200 hover:scale-105"
            >
              {t("cta.book")}
            </a>
          </div>
        </section>
      )}

      {service.process?.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 text-2xl leading-snug font-bold text-ink-strong">{t("svc.how")}</h2>
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
            <span aria-hidden="true" className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-line md:block" />
            {service.process.map(([title, text], i) => (
              <li key={title} className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-success bg-page font-mono text-sm font-bold text-success">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-ink-strong">{title}</p>
                  <p className="mt-1 text-sm leading-snug text-ink">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {service.relatedSkills?.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl leading-snug font-bold text-ink-strong">{t("svc.tools")}</h2>
          <ul className="flex flex-wrap gap-2.5">
            {service.relatedSkills.map((skill) => (
              <li key={skill} className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-ink">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-2xl leading-snug font-bold text-ink-strong">
            {t("svc.related")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {relevantExperience.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 text-2xl leading-snug font-bold text-ink-strong">{t("svc.experience")}</h2>
          <ul className="border-l border-line">
            {relevantExperience.map((exp) => (
              <li key={exp.title} className="relative pb-6 pl-6 last:pb-0">
                <span aria-hidden="true" className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-success" />
                <p className="text-sm text-ink-muted">{exp.startDate} {t("svc.to")} {exp.endDate}</p>
                <h3 className="text-lg font-bold text-ink-strong">{exp.title}</h3>
                <p className="mt-1 text-ink">{exp.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BusinessStatus className="mb-12" />

      <section className="flex flex-col items-center gap-4 rounded-md border border-success/30 bg-page p-7.5 text-center">
        <h2 className="text-2xl leading-snug font-bold text-ink-strong">
          {t("svc.interested", { service: service.title })}
        </h2>
        <ContactCtaButtons
          className="justify-center"
          whatsappMessage={t("msg.whatsappService", { service: service.title })}
        />
      </section>
    </div>
    </div>
  );
}