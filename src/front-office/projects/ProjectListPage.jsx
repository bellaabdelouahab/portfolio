import { useLoaderData } from "react-router-dom";
import { useMemo, useState } from "react";
import { getCollectionDocs } from "../../shared/lib/firestoreAccess";
import { byNewest } from "../../shared/lib/dates";
import SEO from "../../shared/ui/SEO";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";
import { slugifyProjectTitle } from "../../shared/lib/projectSlug";
import { ProjectCard } from "./components/ProjectCard";

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
  const [service, setService] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (service !== "all" && !(p.caseStudy?.services || []).includes(service)) return false;
      if (!q) return true;
      return [p.title, p.description, p.caseStudy?.client, ...(p.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [projects, service, query]);

  const counts = (id) =>
    id === "all" ? projects.length : projects.filter((p) => (p.caseStudy?.services || []).includes(id)).length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects and case studies by Abdelouahab Bella",
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
        title="Projects and case studies"
        description="Web development and data analytics projects by Abdelouahab Bella, each with the problem, the solution and the result."
        keywords="web development projects, Power BI dashboards, case studies, Abdelouahab Bella"
        structuredData={structuredData}
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-8 md:py-10">
        <header className="mb-6 max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">
            Projects and case studies
          </h1>
          <p className="text-base leading-relaxed text-ink">
            Real client and study projects. Each page explains the problem, what was built and the result, with
            screens and the stack used.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-line pb-4">
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

        <div className="mt-12 flex flex-col items-center gap-4 rounded-md border border-success/30 bg-[#1e1e1e] p-7 text-center">
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
