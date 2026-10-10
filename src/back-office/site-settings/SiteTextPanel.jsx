import { memo, useCallback, useMemo, useState } from "react";
import { STRINGS } from "../../shared/i18n/strings";
import { Badge, Button, EmptyState, Input, Page, Select, Textarea, useToast } from "../ui";
import { LANG_LABEL, SaveActions, SectionLoader, cx, deleteIn, isBlank, prune, setIn, useSectionEditor } from "./parts";

const LANGS = ["en", "fr"];
const KEYS = Array.from(new Set([...Object.keys(STRINGS.en || {}), ...Object.keys(STRINGS.fr || {})]));
const groupOf = (k) => (k.includes(".") ? `${k.split(".")[0]}.` : "other");
const GROUPS = Array.from(new Set(KEYS.map(groupOf)));
const defaultOf = (lang, key) => STRINGS[lang]?.[key] ?? STRINGS.en?.[key] ?? "";
const placeholdersOf = (s) => Array.from(new Set(String(s || "").match(/\{[A-Za-z0-9_]+\}/g) || []));

/** Keeps only real overrides: not empty, not equal to the built-in text. */
function normalize(w) {
  const out = { en: {}, fr: {} };
  for (const lang of LANGS) {
    for (const [k, v] of Object.entries(w?.[lang] || {})) {
      if (typeof v !== "string" || isBlank(v)) continue;
      if (KEYS.includes(k) && v === defaultOf(lang, k)) continue;
      out[lang][k] = v;
    }
  }
  return prune(out);
}

const rowsFor = (...texts) => Math.min(6, Math.max(1, Math.ceil(Math.max(...texts.map((t) => String(t || "").length)) / 62)));

const Row = memo(function Row({ k, en, fr, onChange, onReset }) {
  const values = { en, fr };
  const edited = LANGS.some((l) => !isBlank(values[l]) && values[l] !== defaultOf(l, k));
  const sameAsEnglish = !isBlank(values.en) && values.fr.trim() === values.en.trim();
  const rows = rowsFor(values.en, values.fr);
  return (
    <div className={cx("rounded-md border bg-surface px-3 py-2.5", edited ? "border-success/40" : "border-line")}>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <code className="font-mono text-xs text-ink-muted">{k}</code>
        {edited && <Badge tone="success">Edited</Badge>}
        {sameAsEnglish && <Badge tone="warning">French same as English</Badge>}
        <Button size="sm" variant="ghost" className="ml-auto" disabled={!edited && !LANGS.some((l) => values[l] !== defaultOf(l, k))} onClick={() => onReset(k)}>
          Reset
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {LANGS.map((lang) => {
          const def = defaultOf(lang, k);
          const val = values[lang];
          const isEdited = !isBlank(val) && val !== def;
          const missing = placeholdersOf(def).filter((p) => !String(val).includes(p));
          return (
            <div key={lang} className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-[0.7rem] font-medium uppercase text-ink-muted">
                <span>{LANG_LABEL[lang]}</span>
                {isEdited && <span className="text-success normal-case">edited</span>}
                {isBlank(val) && <span className="normal-case text-amber-400">empty, the default is used</span>}
              </div>
              <Textarea
                rows={rows}
                lang={lang}
                value={val}
                onChange={(e) => onChange(lang, k, e.target.value)}
                aria-label={`${k} (${LANG_LABEL[lang]})`}
                className={cx("py-1.5! leading-snug", missing.length && "border-amber-500/60!")}
              />
              {missing.length > 0 && (
                <p className="mt-1 text-xs text-amber-400">Missing placeholder: {missing.join(" ")}. It is replaced by a value at runtime.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

function buildPrompt(items) {
  const json = {};
  for (const [k, v] of items) json[k] = v;
  return [
    "Translate the following website interface strings from English into French.",
    "",
    "Rules:",
    "- Natural, professional French for a freelance web developer and data analyst based in Morocco. Use \"vous\".",
    "- Keep proper nouns, product and technology names, numbers, units, URLs and code unchanged.",
    "- Keep every {placeholder} (text between curly braces) exactly as it is.",
    "- Keep each text about as long as the original, they are buttons and headings.",
    "- Return ONLY one valid JSON object with exactly the same keys. No markdown, no comments, no extra text.",
    "",
    "JSON to translate:",
    JSON.stringify(json, null, 2),
  ].join("\n");
}

function parseAnswer(text) {
  const t = String(text || "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON found in the pasted text.");
  return JSON.parse(t.slice(start, end + 1));
}

function AiHelper({ items, onFill }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [prompt, setPrompt] = useState("");

  const copy = async () => {
    const text = buildPrompt(items);
    setPrompt(text);
    try {
      await navigator.clipboard.writeText(text);
      toast(`Prompt copied (${items.length} strings). Paste it into your assistant.`);
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
    const count = onFill(data);
    if (!count) {
      toast("Nothing matched. Check that the JSON uses the same keys as the prompt.", "danger");
      return;
    }
    setAnswer("");
    toast(`French filled for ${count} strings. Review them, then save.`);
  };

  return (
    <div className="rounded-md border border-line bg-surface">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm font-medium text-ink-strong">
        <span>AI assistant</span>
        <span className="text-xs font-normal text-ink-muted">{open ? "Hide" : "Translate the strings in the current list"}</span>
      </button>
      {open && (
        <div className="grid gap-3 border-t border-line p-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-ink-muted">1. The prompt contains the English text of the {items.length} strings in the current list. Use a group filter to keep it short.</p>
            <div>
              <Button size="sm" variant="primary" disabled={!items.length} onClick={copy}>Copy prompt</Button>
            </div>
            {prompt && <Textarea readOnly rows={3} value={prompt} onFocus={(e) => e.target.select()} className="font-mono text-xs" aria-label="Prompt" />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-ink-muted">2. Paste the JSON answer. French values replace the current French text of the matching keys.</p>
            <Textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder='{"nav.home": "Accueil", ...}' className="font-mono text-xs" aria-label="Assistant answer" />
            <div>
              <Button size="sm" variant="primary" disabled={!answer.trim()} onClick={fill}>Paste answer and fill French</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "cursor-pointer rounded-full border px-3 py-1.5 text-xs tracking-normal! transition-colors duration-150",
        active ? "border-success/50 bg-success/10 text-success" : "border-line text-ink hover:border-success/40"
      )}
    >
      {children}
    </button>
  );
}

function Editor({ saved, save }) {
  const editor = useSectionEditor({ saved, save, normalize, label: "Site text" });
  const { working, update, cleaned } = editor;
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [chip, setChip] = useState("all");

  const valueOf = useCallback(
    (lang, k) => (working?.[lang]?.[k] !== undefined ? working[lang][k] : defaultOf(lang, k)),
    [working]
  );

  const rows = useMemo(
    () =>
      KEYS.map((k) => {
        const values = { en: valueOf("en", k), fr: valueOf("fr", k) };
        const edited = LANGS.some((l) => !isBlank(values[l]) && values[l] !== defaultOf(l, k));
        const missingFr = !isBlank(values.en) && values.fr.trim() === values.en.trim();
        return { k, values, edited, missingFr };
      }),
    [valueOf]
  );

  const q = query.trim().toLowerCase();
  const visible = rows.filter((r) => {
    if (group !== "all" && groupOf(r.k) !== group) return false;
    if (chip === "edited" && !r.edited) return false;
    if (chip === "missing" && !r.missingFr) return false;
    if (q && !(r.k.toLowerCase().includes(q) || r.values.en.toLowerCase().includes(q) || r.values.fr.toLowerCase().includes(q))) return false;
    return true;
  });

  const onChange = useCallback((lang, k, v) => update((w) => setIn(w, [lang, k], v)), [update]);
  const onReset = useCallback(
    (k) =>
      update((w) => {
        for (const l of LANGS) deleteIn(w, [l, k]);
      }),
    [update]
  );
  const onFill = (data) => {
    let count = 0;
    update((w) => {
      for (const r of visible) {
        const v = data[r.k];
        if (typeof v === "string" && v.trim()) {
          setIn(w, ["fr", r.k], v.trim());
          count += 1;
        }
      }
    });
    return count;
  };

  const editedCount = new Set([...Object.keys(cleaned.en || {}), ...Object.keys(cleaned.fr || {})]).size;
  const missingCount = rows.filter((r) => r.missingFr).length;

  return (
    <Page
      className="max-w-none!"
      title="Site text"
      subtitle="Buttons, headings and messages used across the site, in English and French. Only changed texts are stored; the rest comes from the code."
      actions={<SaveActions editor={editor} />}
    >
      <div className="flex flex-col gap-3">
        <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center gap-2 bg-page px-1 py-1.5">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search keys or text" aria-label="Search" className="max-w-xs" />
          <Select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Group" className="w-auto!" style={{ width: "auto" }}>
            <option value="all">All groups</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Select>
          <Chip active={chip === "all"} onClick={() => setChip("all")}>All ({KEYS.length})</Chip>
          <Chip active={chip === "edited"} onClick={() => setChip("edited")}>Edited ({editedCount})</Chip>
          <Chip active={chip === "missing"} onClick={() => setChip("missing")}>Missing French ({missingCount})</Chip>
          <span className="ml-auto text-xs text-ink-muted">{visible.length} shown</span>
        </div>

        <AiHelper items={visible.map((r) => [r.k, r.values.en])} onFill={onFill} />

        {visible.length === 0 ? (
          <EmptyState title="No text matches" message="Change the search or the filters." action={<Button onClick={() => { setQuery(""); setGroup("all"); setChip("all"); }}>Clear filters</Button>} />
        ) : (
          <div className="flex flex-col gap-2">
            {visible.map((r) => (
              <Row key={r.k} k={r.k} en={r.values.en} fr={r.values.fr} onChange={onChange} onReset={onReset} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

export default function SiteTextPanel() {
  return (
    <SectionLoader section="strings" title="Site text" subtitle="Buttons, headings and messages used across the site, in English and French.">
      {(saved, save) => <Editor saved={saved} save={save} />}
    </SectionLoader>
  );
}
