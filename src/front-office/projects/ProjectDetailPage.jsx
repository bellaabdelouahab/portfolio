import { Link, useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { getCollectionDocs } from "../../shared/lib/firestoreAccess";
import { byNewest } from "../../shared/lib/dates";
import { slugifyProjectTitle } from "../../shared/lib/projectSlug";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";
import { BOOKING_URL, getWhatsAppLink } from "../../shared/lib/contactConfig";
import { useLang, useLocalePath, withLang, dateLocale } from "../../shared/i18n/i18n";
import { useT } from "../../shared/i18n/strings";
import { useContent } from "../../shared/i18n/useContent";
import { localizeProject } from "../../shared/lib/localize";
import SEO from "../../shared/ui/SEO";
import CodeSamples from "./components/code-samples/CodeSamples";
import Carousel from "./components/carousel/Carousel";
import Collaborators from "./components/collaborators/Collaborators";
import ProjectDataSources from "./components/datasource/ProjectDataSources";

const BTN =
  "inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold tracking-[1px]! transition-transform duration-200 ease-standard hover:scale-105";

/** Slug first (lossy-safe), then raw Firestore id, so old shared links keep working. */
export async function getProject({ params }) {
  const docs = await getCollectionDocs("projects");
  const all = docs.map((d) => ({ _id: d.id, ...d.data() }));
  const project =
    all.find((p) => slugifyProjectTitle(p.title) === params.title) ||
    all.find((p) => p.title === params.title.replace(/-/g, " ")) ||
    all.find((p) => p._id === params.title);
  if (!project) throw new Response("Project not found", { status: 404 });
  const others = all
    .filter((p) => p._id !== project._id && p.hidden !== true)
    .sort(byNewest("startDate"));
  const kindOf = (p) => p.caseStudy?.kind || "client";
  const sameKind = others.filter((p) => kindOf(p) === kindOf(project));
  const sameService = (p) => (p.caseStudy?.services || []).some((s) => (project.caseStudy?.services || []).includes(s));
  const related = [...sameKind.filter(sameService), ...sameKind.filter((p) => !sameService(p))].slice(0, 3);
  return { project, related };
}

const fmt = (iso, lang) =>
  iso ? new Date(iso).toLocaleDateString(dateLocale(lang), { month: "short", year: "numeric" }) : "";

function Meta({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs tracking-[2px]! text-ink-muted uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-ink-strong">{children}</dd>
    </div>
  );
}

function Block({ title, children }) {
  if (!children) return null;
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-ink-strong">{title}</h2>
      <div className="text-base leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export default function ProjectDetailPage() {
  const { project: rawProject, related } = useLoaderData();
  const t = useT();
  const lang = useLang();
  const lp = useLocalePath();
  const { services } = useContent();
  const project = localizeProject(rawProject, lang);
  const cs = project.caseStudy || {};
  const slug = slugifyProjectTitle(rawProject.title);
  const techs = [
    ...new Set([
      ...(project.tags || []),
      ...((project.tools?.techs || []).map((tech) => tech?.title).filter(Boolean)),
    ]),
  ];
  const period = project.startDate
    ? `${fmt(project.startDate, lang)} ${t("svc.to")} ${project.endDate ? fmt(project.endDate, lang) : t("proj.present")}`
    : "";
  const personal = cs.kind === "personal";
  const serviceId = (cs.services || [])[0];
  const service = services.find((s) => s.id === serviceId);
  const summary = cs.summary || project.description;

  // Per-project search-engine text from the back office (`seo.<lang>`); an empty
  // field means "use the automatic value". Strings only, anything else is ignored.
  const seoOverride = (k) => {
    const v = rawProject.seo?.[lang]?.[k];
    return typeof v === "string" ? v.trim() : "";
  };
  const seoTitle =
    seoOverride("title") || `${project.title}${lang === "fr" ? " : " : ": "}${t(personal ? "proj.project" : "proj.caseStudy")}`;
  const seoDescription = seoOverride("description") || String(summary).substring(0, 160);
  const seoKeywords = seoOverride("keywords") || [project.title, t("proj.caseStudy"), ...techs].join(", ");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: seoOverride("description") || summary,
    datePublished: project.startDate || undefined,
    keywords: techs.join(", "),
    url: getAbsoluteUrl(withLang(lang, `/projects/${slug}`)),
    inLanguage: lang,
    author: { "@type": "Person", name: "Abdelouahab Bella" },
  };

  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-8 md:py-12">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={project.image || getAbsoluteUrl("/logo.jpg")}
        type="article"
        structuredData={structuredData}
        breadcrumbs={[[t("nav.home"), "/"], [t("proj.title"), "/projects"], [project.title, `/projects/${slug}`]]}
      />

      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-muted">
        <Link to={lp("/projects")} className="hover:text-success">{t(personal ? "proj.breadcrumbPersonal" : "proj.breadcrumbClient")}</Link>
        <span className="mx-2">/</span>
        <span>{project.title}</span>
      </nav>

      <header className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          {service && (
            <p className="mb-2 text-xs font-bold tracking-[3px]! text-success uppercase">{service.title}</p>
          )}
          <h1 className="mb-4 text-3xl leading-tight font-bold text-ink-strong md:text-4xl">{project.title}</h1>
          <p className="mb-6 text-lg leading-relaxed text-ink">{summary}</p>
          <div className="flex flex-wrap gap-3">
            {cs.liveUrl && (
              <a href={cs.liveUrl} target="_blank" rel="noopener noreferrer" className={`${BTN} bg-success text-black`}>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> {t("proj.liveDemo")}
              </a>
            )}
            {project.githubLink && /github\.com/.test(project.githubLink) && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={`${BTN} border border-line text-ink-strong!`}>
                <FontAwesomeIcon icon={faGithub} /> {t("proj.source")}
              </a>
            )}
            {project.githubLink && !/github\.com/.test(project.githubLink) && !cs.liveUrl && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={`${BTN} bg-success text-black`}>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> {t("proj.visit")}
              </a>
            )}
          </div>
        </div>
        <img
          src={project.image}
          fetchpriority="high"
          decoding="async"
          width="1440"
          height="900"
          alt={t("proj.imageAlt", { title: project.title })}
          className="aspect-[16/10] w-full rounded-md border border-line bg-[#111] object-contain shadow-lg"
        />
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-5 rounded-md border border-line bg-surface p-5 md:grid-cols-4">
        <Meta label={t(personal ? "proj.metaType" : "proj.metaClient")}>{cs.client}</Meta>
        <Meta label={t("proj.metaRole")}>{cs.role}</Meta>
        <Meta label={t("proj.metaPeriod")}>{period}</Meta>
        <Meta label={t("proj.metaStatus")}>{cs.status}</Meta>
      </dl>

      {cs.results?.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {cs.results.map((r) => (
            <li key={r.label} className="rounded-md border border-success/30 bg-[#202020] p-4 text-center">
              <p className="text-2xl font-bold text-success md:text-3xl">{r.value}</p>
              <p className="mt-1 text-xs leading-snug text-ink">{r.label}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <Block title={t(personal ? "proj.idea" : "proj.challenge")}>{cs.challenge}</Block>
        <Block title={t("proj.built")}>{cs.solution}</Block>
        <Block title={t(personal ? "proj.result" : "proj.outcome")}>{cs.outcome}</Block>
      </div>

      {cs.features?.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-ink-strong">{t("proj.features")}</h2>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {cs.features.map((f) => (
              <li key={f} className="rounded-sm border border-line bg-surface p-3 text-sm text-ink">{f}</li>
            ))}
          </ul>
        </section>
      )}

      {project.carouselImages?.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-ink-strong">{t("proj.screens")}</h2>
          <Carousel carouselImages={project.carouselImages} />
        </section>
      )}

      {techs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-ink-strong">{t("proj.stack")}</h2>
          <ul className="flex flex-wrap gap-2">
            {techs.map((t) => (
              <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink">{t}</li>
            ))}
          </ul>
        </section>
      )}

      <ProjectDataSources dataSources={project.dataSources} />
      <CodeSamples codeSamples={project.codeSamples} />
      <Collaborators collaborators={project.collaborators} />

      <section className="mt-12 flex flex-col items-center gap-4 rounded-md border border-success/30 bg-[#202020] p-7 text-center">
        <h2 className="text-2xl font-bold text-ink-strong">{t(personal ? "proj.builtLike" : "proj.similar")}</h2>
        <p className="max-w-xl text-ink">
          {t("proj.similarText")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={BOOKING_URL} onClick={() => window.plausible?.("Contact: Book a meeting")} target="_blank" rel="noopener noreferrer" className={`${BTN} bg-success text-black`}>
            <FontAwesomeIcon icon={faCalendarCheck} /> {t("cta.book")}
          </a>
          <a href={getWhatsAppLink(t("msg.whatsappProject", { title: project.title }))} target="_blank" rel="noopener noreferrer" className={`${BTN} border border-success text-success!`}>
            WhatsApp
          </a>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink-strong">{t("proj.more")}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p._id}
                to={lp(`/projects/${slugifyProjectTitle(p.title)}`)}
                className="group overflow-hidden rounded-md border border-line bg-surface transition-colors hover:border-success/50"
              >
                <img src={p.image} alt="" loading="lazy" className="aspect-[16/10] w-full bg-[#111] object-contain" />
                <p className="p-3 text-sm font-bold text-ink-strong group-hover:text-success">{localizeProject(p, lang).title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
