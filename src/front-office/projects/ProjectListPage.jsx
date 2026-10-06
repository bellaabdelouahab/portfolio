import { useLoaderData } from "react-router-dom";
import { useMemo, useState } from "react";
import { getCollectionDocs } from "../../shared/lib/firestoreAccess";
import { byNewest } from "../../shared/lib/dates";
import SEO from "../../shared/ui/SEO";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";
import { slugifyProjectTitle } from "../../shared/lib/projectSlug";
import { ProjectCard } from "./components/ProjectCard";

const KINDS = [
  ["client", "Client work", "Delivered for clients, each with the problem, the solution and the result."],
  ["personal", "Personal projects", "Products, experiments and study projects built on my own time."],
];

const SERVICE_FILTERS = [
  ["all", "All work"],
  ["web", "Web development"],
  ["data", "Data analytics"],
];

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors duration-200",
        active
          ? "border-success bg-success/15 text-success"
          : "border-line bg-surface text-ink hover:border-success/40 hover:text-ink-strong",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Projects() {
  const projects = useLoaderData();
  const [kind, setKind] = useState("client");
  const [service, setService] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if ((p.caseStudy?.kind || "client") !== kind) return false;
      if (service !== "all" && !(p.caseStudy?.services || []).includes(service)) return false;
      if (!q) return true;
      return [p.title, p.description, p.caseStudy?.client, ...(p.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [projects, kind, service, query]);

  const ofKind = projects.filter((p) => (p.caseStudy?.kind || "client") === kind);
  const counts = (id) =>
    id === "all" ? ofKind.length : ofKind.filter((p) => (p.caseStudy?.services || []).includes(id)).length;
  const kindCount = (id) => projects.filter((p) => (p.caseStudy?.kind || "client") === id).length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects by Abdelouahab Bella",
    description: "Web development and data analytics projects with the problem, the solution and the result for each.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: getAbsoluteUrl(`/projects/${slugifyProjectTitle(p.title)}`),
        name: p.title,
      })),
    },
  };

  return (
    <>
      <SEO
        title="Projects"
        description="Web development and data analytics projects by Abdelouahab Bella, each with the problem, the solution and the result."
        keywords="web development projects, Power BI dashboards, case studies, Abdelouahab Bella"
        structuredData={structuredData}
        breadcrumbs={[["Home", "/"], ["Projects", "/projects"]]}
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-8 md:py-10">
        <header className="mb-6 max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">
            Projects
          </h1>
          <p className="text-base leading-relaxed text-ink">
            {KINDS.find(([id]) => id === kind)[2]}
          </p>
        </header>

        <div role="tablist" aria-label="Project type" className="mb-5 flex gap-6 border-b border-line">
          {KINDS.map(([id, text]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={kind === id}
              onClick={() => { setKind(id); setService("all"); }}
              className={[
                "-mb-px cursor-pointer border-b-2 pb-3 text-base font-bold tracking-[1px]! transition-colors",
                kind === id ? "border-success text-ink-strong" : "border-transparent text-ink-muted hover:text-ink-strong",
              ].join(" ")}
            >
              {text} <span className="font-normal opacity-60">({kindCount(id)})</span>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2 pb-2">
          {SERVICE_FILTERS.map(([id, label]) => (
            <Chip key={id} active={service === id} onClick={() => setService(id)}>
              {label} <span className="opacity-60">({counts(id)})</span>
            </Chip>
          ))}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, client or tool"
            aria-label="Search projects"
            className="ml-auto w-full rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-ink-strong focus:border-success focus:outline-none sm:w-64"
          />
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-ink">No project matches this filter.</p>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 rounded-md border border-success/30 bg-[#202020] p-7 text-center">
          <h2 className="text-xl font-bold text-ink-strong">Have a project in mind?</h2>
          <ContactCtaButtons className="justify-center" whatsappMessage="Hi Abdelouahab, I saw your projects and would like to discuss mine." />
        </div>
      </section>
    </>
  );
}

export const getProjects = async () => {
  const docs = await getCollectionDocs("projects");
  return docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .filter((p) => p.hidden !== true)
    .sort(byNewest("startDate"));
};
