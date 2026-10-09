import { Badge, Button, Field, Input, Textarea } from "../../../ui";
import { FR_FIELDS, frenchFilled } from "../formModel";
import { Group, PairRows, StringRows } from "./parts";
import { storyLabels } from "./StoryStep";

function Ref({ text }) {
  return (
    <div className="max-h-20 overflow-y-auto rounded-md border border-dashed border-line bg-page/40 px-2 py-1 text-xs whitespace-pre-line text-ink-muted">
      {String(text || "").trim() ? text : <span className="italic">English is empty</span>}
    </div>
  );
}

/** One French field with its English reference above it. */
function Pair({ label, en, value, onChange, rows, className = "" }) {
  return (
    <Field label={`${label} (French)`} className={className}>
      <Ref text={en} />
      {rows ? <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /> : <Input value={value} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

const pairText = (r) => `${r.value} | ${r.label}`;

export default function FrenchStep({ f, set, copyEnglish }) {
  const filled = frenchFilled(f);
  const L = storyLabels(f.kind);
  const refsFor = (list) => list.map(pairText);
  const missing = FR_FIELDS.length - filled;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          An empty field shows the English text on the French site. The dashed box is the English reference. Screenshot captions are in the Media step.
        </p>
        <div className="flex items-center gap-2">
          <Badge tone={filled ? "success" : "neutral"}>{filled} of {FR_FIELDS.length} filled</Badge>
          <Button size="sm" disabled={missing === 0} onClick={copyEnglish}>Copy English into empty fields</Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Pair label="Title" en={f.title} value={f.fr_title} onChange={(v) => set("fr_title", v)} />
        <Pair label="Short description" en={f.description} value={f.fr_description} onChange={(v) => set("fr_description", v)} rows={2} className="md:col-span-2" />
        <Pair label="Client or context" en={f.client} value={f.fr_client} onChange={(v) => set("fr_client", v)} />
        <Pair label="Role" en={f.role} value={f.fr_role} onChange={(v) => set("fr_role", v)} />
        <Pair label="Status" en={f.status} value={f.fr_status} onChange={(v) => set("fr_status", v)} />
        <Pair label="Summary" en={f.summary} value={f.fr_summary} onChange={(v) => set("fr_summary", v)} rows={2} className="md:col-span-3" />
        <Pair label={L.challenge} en={f.challenge} value={f.fr_challenge} onChange={(v) => set("fr_challenge", v)} rows={5} />
        <Pair label={L.solution} en={f.solution} value={f.fr_solution} onChange={(v) => set("fr_solution", v)} rows={5} />
        <Pair label={L.outcome} en={f.outcome} value={f.fr_outcome} onChange={(v) => set("fr_outcome", v)} rows={5} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Group title="Key numbers (French)" hint="Same order as the English numbers; the English row is shown above each one.">
          <PairRows
            items={f.fr_results}
            onChange={(v) => set("fr_results", v)}
            label="French number"
            valuePlaceholder="2e"
            labelPlaceholder="place au hackathon"
            addLabel="Add number"
            refs={refsFor(f.results)}
          />
        </Group>
        <Group title="Key features (French)" hint="Same order as the English features.">
          {f.features.some((x) => x.trim()) && (
            <ol className="mb-2 list-decimal space-y-0.5 pl-5 text-xs text-ink-muted">
              {f.features.filter((x) => x.trim()).map((x, i) => <li key={i} className="truncate">{x}</li>)}
            </ol>
          )}
          <StringRows items={f.fr_features} onChange={(v) => set("fr_features", v)} label="French feature" addLabel="Add feature" />
        </Group>
      </div>
    </div>
  );
}
