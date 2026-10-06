import { Link } from "react-router-dom";
import { slugifyProjectTitle } from "../../../shared/lib/projectSlug";

const SERVICE = {
  web: { label: "Web", dot: "bg-sky-400" },
  data: { label: "Data", dot: "bg-amber-400" },
};

/**
 * Compact project card: 16:9 image, title, three-line summary, up to three
 * tags and one clear action. Sized with a fluid grid (min 17rem) so three
 * fit across a 14-inch laptop and two across a tablet, instead of the old
 * fixed 440x480px box that left one card per row on 1366px screens.
 */
export function ProjectCard({ project }) {
  const { title, description, image, highlighted, tags = [], caseStudy = {} } = project;
  const summary = caseStudy.summary || description || "";
  const services = (caseStudy.services || []).map((id) => SERVICE[id]).filter(Boolean);
  const personal = caseStudy.kind === "personal";
  const href = `/projects/${slugifyProjectTitle(title)}`;

  return (
    <Link
      to={href}
      aria-label={`View ${personal ? "project" : "case study"}: ${title}`}
      className={[
        "group flex w-full flex-col overflow-hidden rounded-lg border bg-surface shadow-md",
        "transition-all duration-200 ease-standard hover:-translate-y-1 hover:shadow-xl",
        highlighted === "star" ? "border-[#c39a3b]" : "border-line hover:border-success/50",
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111]">
        <img
          src={image}
          alt={`${title} preview`}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-3 text-[0.68rem] font-bold tracking-[2px]! text-ink-muted uppercase">
          {services.map((svc) => (
            <span key={svc.label} className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${svc.dot}`} aria-hidden="true" />
              {svc.label}
            </span>
          ))}
          <span className="ml-auto font-normal tracking-[1px]! normal-case">{personal ? "Personal project" : "Client project"}</span>
        </p>
        <h3 className="text-base leading-snug font-bold text-ink-strong">{title}</h3>
        <p className="line-clamp-3 text-sm leading-snug text-ink">{summary}</p>
        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-ink-muted">{t}</li>
            ))}
          </ul>
        )}
        <span className="pt-1 text-sm font-bold text-success group-hover:underline">{personal ? "View project →" : "View case study →"}</span>
      </div>
    </Link>
  );
}
