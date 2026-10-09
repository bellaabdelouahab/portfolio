import { useEffect, useState } from "react";
import { Badge, Button, Field, Input, Select, Textarea } from "../../../ui";
import { fieldError, newRowKey } from "../formModel";
import TagInput from "../components/tag-input/TagInput";
import { Group, RemoveButton } from "./parts";

const FALLBACK_SCOPES = [
  "source.js", "source.ts", "source.tsx", "source.python", "source.sql", "source.json",
  "source.css", "text.html.basic", "source.shell", "source.yaml", "source.java", "source.cs",
];
const DATA_TYPES = ["excel", "csv", "json", "sql-server", "mysql", "mongodb", "python", "xml"];
const scopeLabel = (s) => s.replace(/^source\./, "").replace(/^text\.html\.basic$/, "html").replace(/\b\w/g, (l) => l.toUpperCase());

/** Heading of an optional block: name, count, one line on where it appears, add button. */
function Extra({ title, count, hint, addLabel, onAdd, children }) {
  return (
    <section className="rounded-md border border-line bg-page/30 p-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-normal! text-ink-strong">
            {title} <Badge tone={count ? "success" : "neutral"}>{count}</Badge>
          </h3>
          <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>
        </div>
        <Button size="sm" onClick={onAdd}>+ {addLabel}</Button>
      </header>
      {count > 0 && <div className="mt-2.5 flex flex-col gap-2">{children}</div>}
    </section>
  );
}

/** Editable row of single-line inputs. `cols` is [{ key, placeholder, width? , options? }]. */
function InlineRow({ row, cols, onChange, onRemove, rowLabel, error }) {
  const template = cols.map((c) => c.width || "minmax(0,1fr)").join(" ");
  return (
    <div>
      <div className="grid items-center gap-1.5" style={{ gridTemplateColumns: `${template} auto` }}>
        {cols.map((c) =>
          c.options ? (
            <Select key={c.key} value={row[c.key] ?? ""} aria-label={c.label} onChange={(e) => onChange({ [c.key]: e.target.value })} className="py-2!">
              {c.options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
            </Select>
          ) : (
            <Input key={c.key} value={row[c.key] ?? ""} placeholder={c.placeholder} aria-label={c.label} error={!!error && c.required && !String(row[c.key] ?? "").trim()} onChange={(e) => onChange({ [c.key]: e.target.value })} />
          ),
        )}
        <RemoveButton label={`Remove ${rowLabel}`} onClick={onRemove} />
      </div>
      {error && <p className="mt-0.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

function RowsEditor({ name, rows, setRows, cols, rowLabel, errors }) {
  return rows.map((r, i) => (
    <InlineRow
      key={r._k}
      row={r}
      cols={cols}
      rowLabel={`${rowLabel} ${i + 1}`}
      error={fieldError(errors, `${name}-${i}`)}
      onChange={(p) => setRows(rows.map((x, j) => (j === i ? { ...x, ...p } : x)))}
      onRemove={() => setRows(rows.filter((_, j) => j !== i))}
    />
  ));
}

export default function TechStep({ f, set, errors }) {
  const [openCode, setOpenCode] = useState({});
  const [scopes, setScopes] = useState(FALLBACK_SCOPES);
  const hasCode = f.codeSamples.length > 0;

  // The full language list is large: load it only once a code sample exists.
  useEffect(() => {
    if (!hasCode) return undefined;
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
  }, [hasCode]);

  const langOptions = (() => {
    const known = new Set(scopes);
    const extra = f.codeSamples.map((c) => c.language).filter((l) => l && !known.has(l));
    return [{ value: "", label: "Language" }, ...[...scopes, ...new Set(extra)].map((s) => ({ value: s, label: scopeLabel(s) }))];
  })();

  const setTags = (v) => set("tags", typeof v === "function" ? v(f.tags) : v);
  const add = (name, row) => set(name, [...f[name], { ...row, _k: newRowKey(name) }]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Group title="Links">
          <div className="flex flex-col gap-3">
            <Field label="Live site" error={fieldError(errors, "liveUrl")} hint="Adds a Live demo button. Same field as on Facts.">
              <Input value={f.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://" error={!!fieldError(errors, "liveUrl")} />
            </Field>
            <Field label="Source code" hint="Shown as a Source code button when it is a GitHub link; leave empty for private repos.">
              <Input value={f.githubLink} onChange={(e) => set("githubLink", e.target.value)} placeholder="https://github.com/you/repo" />
            </Field>
          </div>
        </Group>

        <Group title="Stack" hint="Tags and technologies are chips in the Stack section. Tags also show on the card.">
          <div className="flex flex-col gap-3">
            <Field label="Tags">
              <TagInput tags={f.tags} setTags={setTags} />
            </Field>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-ink">Technologies <span className="text-ink-muted">(name, then what it was used for; only the name is public)</span></span>
                <Button size="sm" onClick={() => add("techs", { title: "", description: "" })}>+ Add technology</Button>
              </div>
              <div className="flex flex-col gap-2">
                <RowsEditor
                  name="techs"
                  rows={f.techs}
                  setRows={(v) => set("techs", v)}
                  rowLabel="technology"
                  errors={errors}
                  cols={[
                    { key: "title", label: "Technology name", placeholder: "React", width: "minmax(0,1fr)", required: true },
                    { key: "description", label: "What it was used for", placeholder: "UI and routing", width: "minmax(0,2fr)" },
                  ]}
                />
                {f.techs.length === 0 && <p className="text-xs text-ink-muted">None yet. Tags alone are enough for most projects.</p>}
              </div>
            </div>
          </div>
        </Group>
      </div>

      <h3 className="mt-1 text-xs font-semibold tracking-wide! text-ink-muted uppercase">Extras (optional)</h3>

      <Extra
        title="Resources"
        count={f.resources.length}
        hint="Reference links and documents behind the project. Saved with the project; not shown on the public page at the moment."
        addLabel="Add resource"
        onAdd={() => add("resources", { title: "", description: "" })}
      >
        <RowsEditor
          name="resources"
          rows={f.resources}
          setRows={(v) => set("resources", v)}
          rowLabel="resource"
          errors={errors}
          cols={[
            { key: "title", label: "Resource title", placeholder: "Documentation", width: "minmax(0,2fr)", required: true },
            { key: "description", label: "Description or link", placeholder: "Description or link", width: "minmax(0,3fr)" },
          ]}
        />
      </Extra>

      <Extra
        title="Code samples"
        count={f.codeSamples.length}
        hint="Highlighted code blocks in a Code Samples section near the bottom of the project page."
        addLabel="Add code sample"
        onAdd={() => {
          const row = { title: "", language: "source.js", code: "", _k: newRowKey("codeSamples") };
          set("codeSamples", [...f.codeSamples, row]);
          setOpenCode((o) => ({ ...o, [row._k]: true }));
        }}
      >
        {f.codeSamples.map((c, i) => {
          const open = !!openCode[c._k];
          const upd = (p) => set("codeSamples", f.codeSamples.map((x, j) => (j === i ? { ...x, ...p } : x)));
          const err = fieldError(errors, `codeSamples-${i}`);
          return (
            <div key={c._k} className="rounded-md border border-line bg-surface p-2">
              <div className="grid grid-cols-[minmax(0,1fr)_11rem_auto_auto] items-center gap-1.5">
                <Input value={c.title ?? ""} placeholder="Title, e.g. Authentication function" aria-label={`Code sample ${i + 1} title`} onChange={(e) => upd({ title: e.target.value })} />
                <Select value={c.language ?? ""} aria-label="Language" onChange={(e) => upd({ language: e.target.value })} className="py-2!">
                  {langOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
                <Button size="sm" variant="ghost" onClick={() => setOpenCode((o) => ({ ...o, [c._k]: !open }))}>
                  {open ? "Hide code" : `Edit code (${String(c.code || "").split("\n").length} lines)`}
                </Button>
                <RemoveButton label={`Remove code sample ${i + 1}`} onClick={() => set("codeSamples", f.codeSamples.filter((_, j) => j !== i))} />
              </div>
              {open && <Textarea rows={8} value={c.code ?? ""} onChange={(e) => upd({ code: e.target.value })} className="mt-1.5 font-mono text-xs" spellCheck={false} />}
              {err && <p className="mt-0.5 text-xs text-danger">{err}</p>}
            </div>
          );
        })}
      </Extra>

      <Extra
        title="Data sources"
        count={f.dataSources.length}
        hint="A table of the datasets used, in a Data Sources section near the bottom of the project page."
        addLabel="Add data source"
        onAdd={() => add("dataSources", { type: "csv", name: "", size: "", link: "" })}
      >
        <RowsEditor
          name="dataSources"
          rows={f.dataSources}
          setRows={(v) => set("dataSources", v)}
          rowLabel="data source"
          errors={errors}
          cols={[
            { key: "type", label: "Type", width: "9rem", options: [...new Set([...DATA_TYPES, ...f.dataSources.map((d) => d.type).filter(Boolean)])] },
            { key: "name", label: "Name", placeholder: "Name", required: true },
            { key: "size", label: "Size", placeholder: "Size, e.g. 2 GB", width: "8rem" },
            { key: "link", label: "Link", placeholder: "Link" },
          ]}
        />
      </Extra>
    </div>
  );
}
