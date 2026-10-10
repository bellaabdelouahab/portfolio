import { useMemo, useState } from "react";
import { MAX_DESCRIPTION, MAX_TITLE, SEO_PAGES } from "../../shared/lib/seoPages";
import { Badge, Button, Card, Field, Input, Page, Textarea } from "../ui";
import { LANG_LABEL, SaveActions, SectionLoader, cx, deleteIn, getIn, isBlank, prune, setIn, useSectionEditor } from "./parts";

const LANGS = ["en", "fr"];
const FIELDS = ["title", "description", "keywords"];
const BRAND = " | Abdelouahab Bella";

const defOf = (page, lang, f) => String(page?.defaults?.[lang]?.[f] ?? "");

function normalize(w) {
  const out = { pages: {} };
  for (const page of SEO_PAGES) {
    for (const lang of LANGS) {
      for (const f of FIELDS) {
        const v = getIn(w, ["pages", page.key, lang, f]);
        if (typeof v !== "string" || isBlank(v)) continue;
        if (v.trim() === defOf(page, lang, f).trim()) continue;
        setIn(out, ["pages", page.key, lang, f], v.trim());
      }
    }
  }
  // Keep pages this screen does not know about (older keys), untouched.
  for (const [k, v] of Object.entries(w?.pages || {})) {
    if (!SEO_PAGES.some((p) => p.key === k) && v && typeof v === "object") out.pages[k] = v;
  }
  return prune(out);
}

/** Counter with guidance: ok when within [min, max], warning below, danger above. */
function Counter({ len, min, max, what }) {
  let tone = "text-ink-muted";
  let msg = "";
  if (len > 0 && len < min) {
    tone = "text-amber-400";
    msg = `short, aim for ${min} to ${max}`;
  } else if (len > max) {
    tone = "text-danger";
    msg = `too long, search results cut after ${max}`;
  } else if (len >= min) {
    tone = "text-success";
    msg = "good length";
  } else {
    msg = `aim for ${min} to ${max}`;
  }
  return (
    <span className={cx("text-xs", tone)} aria-label={`${what} length`}>
      {len} characters, {msg}
    </span>
  );
}

function host() {
  try {
    return window.location.host || "example.com";
  } catch {
    return "example.com";
  }
}

function Preview({ lang, page, title, description }) {
  const t = title.trim();
  const withBrand = t ? `${t}${BRAND}` : "";
  const shown = page.brand !== false && withBrand && withBrand.length <= MAX_TITLE ? withBrand : t;
  const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
  const path = `${lang === "fr" ? "/fr" : ""}${page.path === "/" ? "" : page.path}`;
  const crumbs = path.split("/").filter(Boolean).join(" › ");
  return (
    <div className="rounded-md border border-line bg-page p-3" aria-label={`Search result preview (${LANG_LABEL[lang]})`}>
      <p className="truncate text-xs text-[#81c995]">
        {host()}
        {crumbs ? ` › ${crumbs}` : ""}
      </p>
      <p className="mt-0.5 text-[1.05rem] leading-snug text-[#8ab4f8]">{clip(shown, MAX_TITLE) || <span className="italic text-ink-muted">No title</span>}</p>
      <p className="mt-0.5 text-sm leading-snug text-ink-muted">{clip(description.trim(), MAX_DESCRIPTION) || <span className="italic">No description</span>}</p>
    </div>
  );
}

function LangEditor({ lang, page, working, update }) {
  const get = (f) => {
    const v = getIn(working, ["pages", page.key, lang, f]);
    return v !== undefined ? v : defOf(page, lang, f);
  };
  const isEdited = (f) => !isBlank(get(f)) && get(f).trim() !== defOf(page, lang, f).trim();
  const anyEdited = FIELDS.some(isEdited) || FIELDS.some((f) => getIn(working, ["pages", page.key, lang, f]) !== undefined);
  const set = (f, v) => update((w) => setIn(w, ["pages", page.key, lang, f], v));
  const reset = () => update((w) => deleteIn(w, ["pages", page.key, lang]));
  const kw = get("keywords").split(",").map((s) => s.trim()).filter(Boolean).length;
  const titleLen = get("title").trim() ? get("title").trim().length : 0;

  return (
    <Card
      title={LANG_LABEL[lang]}
      actions={
        <>
          {FIELDS.some(isEdited) && <Badge tone="success">Edited</Badge>}
          <Button size="sm" variant="ghost" disabled={!anyEdited} onClick={reset}>Reset to default</Button>
        </>
      }
      bodyClassName="flex flex-col gap-3"
    >
      <Field label="Title" hint={<Counter len={titleLen} min={50} max={60} what="Title" />}>
        <Input value={get("title")} onChange={(e) => set("title", e.target.value)} lang={lang} />
      </Field>
      <Field label="Description" hint={<Counter len={get("description").trim().length} min={120} max={158} what="Description" />}>
        <Textarea rows={3} value={get("description")} onChange={(e) => set("description", e.target.value)} lang={lang} />
      </Field>
      <Field label="Keywords" hint={`${kw} keywords, separated by commas. Search engines mostly ignore them; keep a few.`}>
        <Input value={get("keywords")} onChange={(e) => set("keywords", e.target.value)} lang={lang} />
      </Field>
      <Preview lang={lang} page={page} title={get("title")} description={get("description")} />
    </Card>
  );
}

function Editor({ saved, save }) {
  const editor = useSectionEditor({ saved, save, normalize, label: "SEO" });
  const { working, update, cleaned } = editor;
  const [current, setCurrent] = useState(SEO_PAGES[0]?.key);
  const page = SEO_PAGES.find((p) => p.key === current) || SEO_PAGES[0];
  const editedPages = useMemo(() => new Set(Object.keys(cleaned.pages || {})), [cleaned]);

  return (
    <Page
      className="max-w-none!"
      title="SEO"
      subtitle="Title, description and keywords of each page, in both languages. Empty fields use the built-in text."
      actions={<SaveActions editor={editor} />}
    >
      <div className="grid items-start gap-4 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="Pages" className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SEO_PAGES.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-current={p.key === page.key ? "page" : undefined}
              onClick={() => setCurrent(p.key)}
              className={cx(
                "flex shrink-0 cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm tracking-normal! transition-colors duration-150",
                p.key === page.key ? "border-success/50 bg-success/10 text-success" : "border-line bg-surface text-ink hover:border-success/40"
              )}
            >
              <span className="truncate">{p.label}</span>
              {editedPages.has(p.key) && <span className="size-2 shrink-0 rounded-full bg-success" title="Has edited values" />}
            </button>
          ))}
        </nav>

        {page && (
          <div className="flex min-w-0 flex-col gap-4">
            <p className="text-xs text-ink-muted">
              Page: <span className="font-mono text-ink">{page.path}</span> and <span className="font-mono text-ink">/fr{page.path === "/" ? "" : page.path}</span>. {page.brand === false ? "This title is used as written." : "The site name is added after the title when the result fits in 62 characters."}
            </p>
            <div className="grid gap-4 xl:grid-cols-2">
              {LANGS.map((lang) => (
                <LangEditor key={lang} lang={lang} page={page} working={working} update={update} />
              ))}
            </div>
            <div className="rounded-md border border-line bg-surface px-4 py-3 text-xs text-ink-muted">
              <span className="font-medium text-ink">Tips.</span> Put the main topic and place first in the title. Write the description as one sentence that makes people want to click. Each page needs its own text; the same text on two pages competes with itself.
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

export default function SeoPanel() {
  return (
    <SectionLoader section="seo" title="SEO" subtitle="Title, description and keywords of each page, in both languages.">
      {(saved, save) => <Editor saved={saved} save={save} />}
    </SectionLoader>
  );
}
