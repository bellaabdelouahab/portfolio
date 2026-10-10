import { useState } from "react";
import { Badge, Button, Field, Input, Textarea, useToast } from "../../../ui";
import { FR_FIELDS, frenchFilled, newRowKey } from "../formModel";
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


const clean = (v) => String(v ?? "").trim();

/** The English content as the plain JSON an assistant will translate. */
function englishSource(f) {
  return {
    title: clean(f.title),
    description: clean(f.description),
    client: clean(f.client),
    role: clean(f.role),
    status: clean(f.status),
    summary: clean(f.summary),
    challenge: clean(f.challenge),
    solution: clean(f.solution),
    outcome: clean(f.outcome),
    results: f.results.filter((r) => clean(r.value) || clean(r.label)).map((r) => ({ value: clean(r.value), label: clean(r.label) })),
    features: f.features.map(clean).filter(Boolean),
    captions: f.carousel.map((c) => clean(c.title)),
  };
}

function buildPrompt(f) {
  return [
    "Translate the following portfolio project content from English into French.",
    "",
    "Rules:",
    "- Natural, professional French for a freelance web developer and data analyst. Use \"vous\" where a form of address is needed.",
    "- Keep proper nouns, product and technology names, numbers, units, URLs and code unchanged.",
    "- Keep every text roughly as long as the original. Do not add or remove information.",
    "- In \"results\", \"value\" is a short figure or word (for example \"2nd\" becomes \"2e\", \"Live\" becomes \"En direct\") and \"label\" is its short description.",
    "- Return ONLY one valid JSON object with exactly the same keys and the same number of items in every array. No markdown, no comments, no extra text.",
    "",
    "JSON to translate:",
    JSON.stringify(englishSource(f), null, 2),
  ].join("\n");
}

/** Pulls the JSON object out of a pasted answer, even inside a code fence or prose. */
function parseAnswer(text) {
  const t = String(text || "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON found in the pasted text.");
  return JSON.parse(t.slice(start, end + 1));
}

function LlmHelper({ f, set }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [prompt, setPrompt] = useState("");

  const copy = async () => {
    const text = buildPrompt(f);
    setPrompt(text);
    try {
      await navigator.clipboard.writeText(text);
      toast("Prompt copied. Paste it into your assistant.");
    } catch {
      toast("Could not copy automatically. Select the text below and copy it.", "danger");
    }
  };

  const fill = () => {
    let data;
    try {
      data = parseAnswer(answer);
    } catch (e) {
      toast(e.message || "That is not valid JSON.", "danger");
      return;
    }
    const str = (k) => (typeof data[k] === "string" ? data[k] : null);
    let count = 0;
    const put = (field, key) => {
      const v = str(key);
      if (v !== null && v.trim()) {
        set(field, v.trim());
        count += 1;
      }
    };
    put("fr_title", "title");
    put("fr_description", "description");
    put("fr_client", "client");
    put("fr_role", "role");
    put("fr_status", "status");
    put("fr_summary", "summary");
    put("fr_challenge", "challenge");
    put("fr_solution", "solution");
    put("fr_outcome", "outcome");
    if (Array.isArray(data.results)) {
      const rows = data.results
        .map((r) => ({ value: clean(r?.value), label: clean(r?.label), _k: newRowKey("fr_results") }))
        .filter((r) => r.value || r.label);
      if (rows.length) {
        set("fr_results", rows);
        count += 1;
      }
    }
    if (Array.isArray(data.features)) {
      const rows = data.features.map(clean).filter(Boolean);
      if (rows.length) {
        set("fr_features", rows);
        count += 1;
      }
    }
    if (Array.isArray(data.captions) && f.carousel.length) {
      set(
        "carousel",
        f.carousel.map((c, i) => (clean(data.captions[i]) ? { ...c, frTitle: clean(data.captions[i]) } : c))
      );
      count += 1;
    }
    if (!count) {
      toast("Nothing matched. Check that the JSON uses the same keys as the prompt.", "danger");
      return;
    }
    setAnswer("");
    toast(`French fields filled (${count} groups). Review them below.`);
  };

  return (
    <div className="rounded-md border border-line bg-surface">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm font-medium text-ink-strong">
        <span>Translate with an AI assistant</span>
        <span className="text-xs text-ink-muted">{open ? "Hide" : "Copy prompt, paste answer"}</span>
      </button>
      {open && (
        <div className="grid gap-3 border-t border-line p-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-ink-muted">1. Fill the English text first, then copy the prompt and send it to your assistant.</p>
            <div>
              <Button size="sm" variant="primary" onClick={copy}>Copy prompt</Button>
            </div>
            {prompt && (
              <Textarea readOnly rows={4} value={prompt} onFocus={(e) => e.target.select()} className="font-mono text-xs" aria-label="Prompt" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-ink-muted">2. Paste the JSON it returns here and fill the French fields. Existing French text in those fields is replaced.</p>
            <Textarea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder='{"title": "...", "description": "...", ...}' className="font-mono text-xs" aria-label="Assistant answer" />
            <div>
              <Button size="sm" variant="primary" disabled={!answer.trim()} onClick={fill}>Fill French fields</Button>
            </div>
          </div>
        </div>
      )}
    </div>
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

      <LlmHelper f={f} set={set} />

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
