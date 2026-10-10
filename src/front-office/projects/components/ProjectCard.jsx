import { Link } from "react-router-dom";
import { slugifyProjectTitle } from "../../../shared/lib/projectSlug";
import { localizeProject } from "../../../shared/lib/localize";
import { useLang, useLocalePath } from "../../../shared/i18n/i18n";
import { useT } from "../../../shared/i18n/strings";

const SERVICE = {
  web: { key: "proj.tagWeb", dot: "bg-sky-400" },
  data: { key: "proj.tagData", dot: "bg-amber-400" },
};

/**
 * Compact project card: 16:10 image, title, three-line summary, up to three
 * tags and one clear action. Sized with a fluid grid (min 17rem) so three
 * fit across a 14-inch laptop and two across a tablet. The link uses the
 * English title for the slug, so a project has the same URL in both languages.
 */
export function ProjectCard({ project: raw }) {
  const lang = useLang();
  const lp = useLocalePath();
  const t = useT();
  const project = localizeProject(raw, lang);
  const { title, description, image, highlighted, tags = [], caseStudy = {} } = project;
  const summary = caseStudy.summary || description || "";
  const services = (caseStudy.services || []).map((id) => SERVICE[id]).filter(Boolean);
  const personal = caseStudy.kind === "personal";
  const href = lp(`/projects/${slugifyProjectTitle(raw.title)}`);

  return (
    <Link
      to={href}
      aria-label={t(personal ? "proj.viewProjectAria" : "proj.viewCaseAria", { title })}
      className={[
        "group flex w-full flex-col overflow-hidden rounded-lg border bg-surface shadow-md",
        "transition-all duration-200 ease-standard hover:-translate-y-1 hover:shadow-xl",
        highlighted === "star" ? "border-[#c39a3b]" : "border-line hover:border-success/50",
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-main">
        <img
          src={image}
          alt={t("proj.imageAlt", { title })}
          loading="lazy"
          decoding="async"
          width="1440"
          height="900"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-3 text-[0.68rem] font-bold tracking-[2px]! text-ink-muted uppercase">
          {services.map((svc) => (
            <span key={svc.key} className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${svc.dot}`} aria-hidden="true" />
              {t(svc.key)}
            </span>
          ))}
          <span className="ml-auto font-normal tracking-[1px]! normal-case">
            {t(personal ? "proj.personalProject" : "proj.clientProject")}
          </span>
        </p>
        <h3 className="text-base leading-snug font-bold text-ink-strong">{title}</h3>
        <p className="line-clamp-3 text-sm leading-snug text-ink">{summary}</p>
        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.slice(0, 3).map((tag) => (
              <li key={tag} className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-ink-muted">{tag}</li>
            ))}
          </ul>
        )}
        <span className="pt-1 text-sm font-bold text-success group-hover:underline">
          {t(personal ? "proj.viewProject" : "proj.viewCase")}
        </span>
      </div>
    </Link>
  );
}
