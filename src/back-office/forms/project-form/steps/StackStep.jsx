import { useEffect, useState } from "react";
import { Badge, Button, Field, Input, Select, Textarea } from "../../../ui";
import TagInput from "../components/tag-input/TagInput";

const FALLBACK_SCOPES = [
  "source.js", "source.ts", "source.tsx", "source.python", "source.sql", "source.json",
  "source.css", "text.html.basic", "source.shell", "source.yaml", "source.java", "source.cs",
];
const DATA_TYPES = ["excel", "csv", "json", "sql-server", "mysql", "mongodb", "python", "xml"];
const SPAN = { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4" };
const RESOURCE_PRESETS = ["Documentation", "Tutorial", "API reference", "Article"];

/** Collapsible section with a count in the header. */
function Section({ title, count, open, onToggle, children }) {
  return (
    <div className="rounded-md border border-line bg-surface">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left">
        <span className="text-sm font-semibold tracking-normal! text-ink-strong">{title}</span>
        <span className="flex items-center gap-2">
          {count !== undefined && <Badge tone={count ? "success" : "neutral"}>{count}</Badge>}
          <span className="text-xs text-ink-muted">{open ? "Hide" : "Edit"}</span>
        </span>
      </button>
      {open && <div className="border-t border-line p-4">{children}</div>}
    </div>
  );
}

/**
 * Inline list editor. `fields` is [{ key, label, kind?: "text"|"area"|"select", options?, required?, span? }].
 * Clicking Edit loads the row into the draft form above the list; Save writes it back.
 */
function ListEditor({ items, onChange, fields, summary, addLabel, normalize = (x) => x }) {
  const blank = Object.fromEntries(fields.map((f) => [f.key, f.default ?? ""]));
  const [draft, setDraft] = useState(blank);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setDraft(blank);
    setEditIndex(null);
    setError("");
  };
  const submit = () => {
    const missing = fields.find((f) => f.required && !String(draft[f.key] || "").trim());
    if (missing) return setError(`${missing.label} is required.`);
    const entry = normalize(Object.fromEntries(fields.map((f) => [f.key, String(draft[f.key] ?? "").trim()])));
    // Keep unknown keys on edited rows.
    if (editIndex !== null) onChange(items.map((it, i) => (i === editIndex ? { ...it, ...entry } : it)));
    else onChange([...items, entry]);
    reset();
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <ul className="flex max-h-44 flex-col gap-1.5 overflow-y-auto pr-1">
          {items.map((it, i) => (
            <li key={i} className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-xs ${editIndex === i ? "border-success/60" : "border-line"} bg-page/40`}>
              <span className="min-w-0 truncate text-ink">{summary(it)}</span>
              <span className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" onClick={() => { setDraft({ ...blank, ...it }); setEditIndex(i); setError(""); }}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => { onChange(items.filter((_, j) => j !== i)); if (editIndex === i) reset(); }}>Remove</Button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="grid gap-3 md:grid-cols-4">
        {fields.map((f) => (
          <Field key={f.key} label={f.label} required={f.required} className={SPAN[f.span]}>
            {f.kind === "area" ? (
              <Textarea rows={f.rows || 4} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} placeholder={f.placeholder} className={f.mono ? "font-mono text-xs" : ""} />
            ) : f.kind === "select" ? (
              <Select value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}>
                {f.options.map((o) => (<option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>))}
              </Select>
            ) : (
              <Input value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} placeholder={f.placeholder} list={f.list} />
            )}
          </Field>
        ))}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" variant="primary" onClick={submit}>{editIndex !== null ? "Update" : addLabel}</Button>
        {(editIndex !== null || fields.some((f) => String(draft[f.key] || "") && draft[f.key] !== f.default)) && (
          <Button size="sm" variant="ghost" onClick={reset}>Cancel</Button>
        )}
      </div>
    </div>
  );
}

export default function StackStep({ tags, setTags, techs, setTechs, resources, setResources, codeSamples, setCodeSamples, dataSources, setDataSources }) {
  const [open, setOpen] = useState({ tags: true });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const [scopes, setScopes] = useState(FALLBACK_SCOPES);

  // Load the full language list only when the code section is opened.
  useEffect(() => {
    if (!open.code) return undefined;
    let alive = true;
    (async () => {
      try {
        const { createStarryNight, common } = await import("@wooorm/starry-night");
        const list = (await createStarryNight(common)).scopes();
        if (alive && list.length) setScopes(list);
      } catch (e) {
        console.error("Could not load languages", e);
      }
    })();
    return () => { alive = false; };
  }, [open.code]);

  const scopeOptions = scopes.map((s) => ({ value: s, label: s.replace(/^source\./, "").replace(/\b\w/g, (l) => l.toUpperCase()) }));
  const codeScopes = [{ value: "", label: "Select a language" }, ...scopeOptions];
  // A stored language that is not in the list must still render as an option.
  const withStored = (opts, items, key) => {
    const known = new Set(opts.map((o) => o.value ?? o));
    const extra = items.map((i) => i[key]).filter((x) => x && !known.has(x));
    return [...opts, ...new Set(extra)];
  };

  return (
    <div className="flex max-h-[calc(100vh-15rem)] flex-col gap-2 overflow-y-auto pr-1">
      <Section title="Tags" count={tags.length} open={!!open.tags} onToggle={() => toggle("tags")}>
        <TagInput tags={tags} setTags={setTags} />
      </Section>

      <Section title="Technologies" count={techs.length} open={!!open.techs} onToggle={() => toggle("techs")}>
        <ListEditor
          items={techs}
          onChange={setTechs}
          addLabel="Add technology"
          summary={(t) => `${t.title}${t.description ? ` - ${t.description}` : ""}`}
          fields={[
            { key: "title", label: "Name", required: true, placeholder: "React", span: 1 },
            { key: "description", label: "What it was used for", required: true, placeholder: "UI and routing", span: 3 },
          ]}
        />
      </Section>

      <Section title="Resources" count={resources.length} open={!!open.resources} onToggle={() => toggle("resources")}>
        <datalist id="resource-presets">{RESOURCE_PRESETS.map((p) => <option key={p} value={p} />)}</datalist>
        <ListEditor
          items={resources}
          onChange={setResources}
          addLabel="Add resource"
          summary={(r) => `${r.title}${r.description ? ` - ${r.description}` : ""}`}
          fields={[
            { key: "title", label: "Title", required: true, placeholder: "Documentation", list: "resource-presets", span: 1 },
            { key: "description", label: "Description or link", required: true, span: 3 },
          ]}
        />
      </Section>

      <Section title="Code samples" count={codeSamples.length} open={!!open.code} onToggle={() => toggle("code")}>
        <ListEditor
          items={codeSamples}
          onChange={setCodeSamples}
          addLabel="Add sample"
          summary={(c) => `${c.title} (${String(c.language || "").replace(/^source\./, "")})`}
          fields={[
            { key: "title", label: "Title", required: true, placeholder: "Authentication function", span: 2 },
            {
              key: "language", label: "Language", kind: "select", required: true, span: 2,
              default: "source.js",
              options: withStored(codeScopes, codeSamples, "language").map((o) => (typeof o === "string" ? { value: o, label: o } : o)),
            },
            { key: "code", label: "Code", kind: "area", required: true, span: 4, rows: 6, mono: true },
          ]}
        />
      </Section>

      <Section title="Data sources" count={dataSources.length} open={!!open.data} onToggle={() => toggle("data")}>
        <ListEditor
          items={dataSources}
          onChange={setDataSources}
          addLabel="Add data source"
          summary={(d) => `${d.name} (${d.type}${d.size ? `, ${d.size}` : ""})`}
          fields={[
            { key: "type", label: "Type", kind: "select", required: true, default: "csv", options: DATA_TYPES },
            { key: "name", label: "Name", required: true },
            { key: "size", label: "Size", placeholder: "2 GB" },
            { key: "link", label: "Link" },
          ]}
        />
      </Section>
    </div>
  );
}
