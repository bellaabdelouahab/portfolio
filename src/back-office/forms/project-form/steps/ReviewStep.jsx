import { Badge, Button, Card } from "../../../ui";
import { STEPS, frenchFilled, FR_FIELDS } from "../formModel";
import Thumb from "./Thumb";

const stepLabel = (id) => STEPS.find((s) => s.id === id)?.label || id;

export default function ReviewStep({ f, errors, onJump, isEdit }) {
  const problems = Object.entries(errors).flatMap(([step, list]) => list.map((e) => ({ step, ...e })));
  const services = [f.web && "Web", f.data && "Data"].filter(Boolean);
  const summary = f.description.trim();
  const shots = f.carousel.length;
  const frShots = f.carousel.filter((c) => c.frTitle.trim()).length;
  const rows = [
    ["Kind", f.kind === "personal" ? "Personal project" : "Client work"],
    ["Services", services.join(", ") || "None"],
    ["Dates", f.startDate ? `${f.startDate} to ${f.endDate || "ongoing"}` : "Not set"],
    ["Visibility", [f.hidden ? "Hidden" : "Visible", f.highlighted && "Highlighted"].filter(Boolean).join(", ")],
    ["Facts", `${f.results.filter((r) => r.value.trim() && r.label.trim()).length} key numbers, ${f.features.filter((x) => x.trim()).length} features`],
    ["French", `${frenchFilled(f)} of ${FR_FIELDS.length} fields, ${frShots} of ${shots} captions`],
    ["Screenshots", String(shots)],
    ["Technical", `${f.tags.length} tags, ${f.techs.length} technologies, ${f.resources.length} resources, ${f.codeSamples.length} code samples, ${f.dataSources.length} data sources`],
    ["Links", [f.liveUrl.trim() && "live site", f.githubLink.trim() && "source code"].filter(Boolean).join(", ") || "None"],
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_19rem]">
      <div className="flex min-w-0 flex-col gap-3">
        <Card title={problems.length ? `${problems.length} problem(s) to fix before publishing` : "Ready to publish"}>
          {problems.length === 0 ? (
            <p className="text-sm text-ink">Everything required is filled. {isEdit ? "Publishing updates the live project." : "Publishing adds the project to the site."}</p>
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
          <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[6.5rem_1fr]">
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
        <div className={`overflow-hidden rounded-lg border bg-surface ${f.highlighted ? "border-[#c39a3b]" : "border-line"}`}>
          <Thumb src={f.cover} alt="" className="aspect-[16/10] w-full" />
          <div className="flex flex-col gap-2 p-3">
            <h3 className="line-clamp-2 text-sm font-semibold tracking-normal! text-ink-strong">{f.title || "Untitled project"}</h3>
            <p className="line-clamp-3 text-xs text-ink">{summary || "No description yet."}</p>
            <div className="flex flex-wrap gap-1">
              {f.tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
              {f.tags.length > 3 && <Badge>+{f.tags.length - 3}</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
