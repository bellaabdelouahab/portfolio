import { Button } from "../../ui";
import { relativeTime } from "./projectMeta";

/** Unfinished wizard sessions saved on the server. Renders nothing without drafts. */
export default function DraftsSection({ drafts, projectTitles, busyId, onContinue, onDiscard }) {
  if (!drafts.length) return null;
  return (
    <section aria-label="Drafts" className="mb-5">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-sm font-semibold tracking-normal! text-ink-strong">Drafts</h2>
        <span className="text-xs text-ink-muted">{drafts.length} unfinished</span>
      </div>
      <ul className="grid grid-cols-2 gap-2.5 min-[1200px]:grid-cols-3">
        {drafts.map((d) => {
          const isEdit = d.kind === "edit";
          const target = isEdit ? projectTitles[d.projectId] || d.title : "";
          const title = d.title || "Untitled project";
          return (
            <li key={d.id} className="flex min-w-0 items-center gap-3 rounded-md border border-dashed border-line bg-surface p-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm leading-snug font-medium text-ink-strong" title={title}>{title}</p>
                <p className="mt-1 flex min-w-0 items-center gap-2 text-xs text-ink-muted">
                  <span
                    className={`inline-block max-w-[10rem] shrink truncate rounded-full border px-2 py-0.5 ${
                      isEdit ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-success/40 bg-success/10 text-success"
                    }`}
                    title={isEdit ? `Edit of ${target || "a project"}` : "New project"}
                  >
                    {isEdit ? `Edit of ${target || "a project"}` : "New project"}
                  </span>
                  <span className="shrink-0">{relativeTime(d.updatedAt)}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button size="sm" variant="primary" disabled={busyId === d.id} onClick={() => onContinue(d.id)} className="focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:outline-none">
                  Continue
                </Button>
                <Button size="sm" variant="ghost" disabled={busyId === d.id} loading={busyId === d.id} onClick={() => onDiscard(d)} className="focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:outline-none">
                  Discard
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
