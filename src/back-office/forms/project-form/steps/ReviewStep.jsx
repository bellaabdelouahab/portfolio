import { Badge, Button, Card } from "../../../ui";
import { STEPS, frenchFilled, FR_FIELDS, parseResults } from "../formModel";
import Thumb from "./Thumb";

const stepLabel = (id) => STEPS.find((s) => s.id === id)?.label || id;

export default function ReviewStep({ v, errors, onJump, coverFile, existingImage, tags, counts, isEdit }) {
  const problems = Object.entries(errors).flatMap(([step, list]) => list.map((e) => ({ step, ...e })));
  const services = [v.cs_web && "Web", v.cs_data && "Data"].filter(Boolean);
  const summary = v.cs_summary.trim() || v.description.trim();
  const rows = [
    ["Kind", v.cs_kind === "personal" ? "Personal project" : "Client work"],
    ["Services", services.join(", ") || "None"],
    ["Dates", v.startDate ? `${v.startDate} to ${v.endDate || "ongoing"}` : "Not set"],
    ["Visibility", [v.hidden ? "Hidden" : "Visible", v.highlighted && "Highlighted"].filter(Boolean).join(", ")],
    ["Case study", `${parseResults(v.cs_results).length} numbers, ${v.cs_features.split("\n").filter((l) => l.trim()).length} features`],
    ["French", `${frenchFilled(v)} of ${FR_FIELDS.length} fields`],
    ["Screenshots", String(counts.screenshots)],
    ["Stack", `${counts.techs} technologies, ${counts.resources} resources, ${counts.code} code samples, ${counts.data} data sources`],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <Card title={problems.length ? `${problems.length} problem(s) to fix before saving` : "Ready to save"}>
          {problems.length === 0 ? (
            <p className="text-sm text-ink">Everything required is filled. {isEdit ? "Saving updates the live project." : "Saving publishes the project."}</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {problems.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-danger">{p.message}</span>
                  <Button size="sm" onClick={() => onJump(p.step)}>Go to {stepLabel(p.step)}</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="What will be published">
          <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[8rem_1fr]">
            {rows.map(([k, val]) => (
              <div key={k} className="contents">
                <dt className="text-xs text-ink-muted">{k}</dt>
                <dd className="text-ink">{val}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink">Card preview</p>
        <div className={`overflow-hidden rounded-lg border bg-surface ${v.highlighted ? "border-[#c39a3b]" : "border-line"}`}>
          <Thumb file={coverFile} src={existingImage} alt="" className="aspect-[16/10] w-full" />
          <div className="flex flex-col gap-2 p-3">
            <h3 className="line-clamp-2 text-sm font-semibold tracking-normal! text-ink-strong">{v.title || "Untitled project"}</h3>
            <p className="line-clamp-3 text-xs text-ink">{summary || "No description yet."}</p>
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
              {tags.length > 3 && <Badge>+{tags.length - 3}</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
