import { useState } from "react";
import { faqData, servicesContent } from "../../front-office/home/homeContent";
import { faqFr, servicesFr } from "../../front-office/home/homeContent.fr";
import { Badge, Button, Field, Input, Page, Textarea } from "../ui";
import { LANG_LABEL, SaveActions, SectionLoader, Segmented, cx, deleteIn, getIn, isBlank, prune, setIn, useSectionEditor } from "./parts";

const LANGS = ["en", "fr"];

/** Built-in values per section, id and language. */
const DEFAULTS = {
  faq: Object.fromEntries(
    faqData.map((q) => [
      q.id,
      {
        en: { question: q.question, answer: q.answer },
        fr: { question: faqFr[q.id]?.[0] ?? q.question, answer: faqFr[q.id]?.[1] ?? q.answer },
      },
    ])
  ),
  services: Object.fromEntries(
    servicesContent.map((s) => [
      s.id,
      {
        en: { title: s.title, description: s.description, priceFrom: s.priceFrom },
        fr: { title: servicesFr[s.id]?.title ?? s.title, description: servicesFr[s.id]?.description ?? s.description, priceFrom: s.priceFrom },
      },
    ])
  ),
};
const FIELDS = { faq: ["question", "answer"], services: ["title", "description", "priceFrom"] };

const validPrice = (v) => /^\d{1,7}$/.test(String(v).trim()) && Number(v) > 0;

function normalize(w) {
  const out = { faq: {}, services: {} };
  for (const section of ["faq", "services"]) {
    for (const [id, langs] of Object.entries(DEFAULTS[section])) {
      for (const lang of LANGS) {
        for (const f of FIELDS[section]) {
          const raw = getIn(w, [section, id, lang, f]);
          if (raw === undefined || raw === null || isBlank(raw)) continue;
          const def = langs[lang][f];
          if (f === "priceFrom") {
            if (!validPrice(raw) || Number(raw) === Number(def)) continue;
            setIn(out, [section, id, lang, f], Number(raw));
          } else {
            const v = String(raw).trim();
            if (v === String(def).trim()) continue;
            setIn(out, [section, id, lang, f], v);
          }
        }
      }
    }
    // Keep ids this screen does not list.
    for (const [id, v] of Object.entries(w?.[section] || {})) {
      if (!DEFAULTS[section][id] && v && typeof v === "object") out[section][id] = v;
    }
  }
  return prune(out);
}

function Item({ section, id, working, update }) {
  const defs = DEFAULTS[section][id];
  const get = (lang, f) => {
    const v = getIn(working, [section, id, lang, f]);
    return v !== undefined && v !== null ? String(v) : String(defs[lang][f]);
  };
  const changed = (lang, f) => {
    const v = get(lang, f);
    return !isBlank(v) && v.trim() !== String(defs[lang][f]).trim();
  };
  const edited = LANGS.some((l) => FIELDS[section].some((f) => changed(l, f)));
  const touched = LANGS.some((l) => FIELDS[section].some((f) => getIn(working, [section, id, l, f]) !== undefined));
  const set = (lang, f, v) => update((w) => setIn(w, [section, id, lang, f], v));
  const reset = () => update((w) => deleteIn(w, [section, id]));

  return (
    <div className={cx("rounded-md border bg-surface px-3 py-2.5", edited ? "border-success/40" : "border-line")}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <code className="font-mono text-xs text-ink-muted">{id}</code>
        {edited && <Badge tone="success">Edited</Badge>}
        <Button size="sm" variant="ghost" className="ml-auto" disabled={!touched} onClick={reset}>Reset</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {LANGS.map((lang) => (
          <div key={lang} className="flex min-w-0 flex-col gap-2.5">
            <span className="text-[0.7rem] font-medium uppercase text-ink-muted">{LANG_LABEL[lang]}</span>
            {section === "faq" ? (
              <>
                <Field label="Question">
                  <Input lang={lang} value={get(lang, "question")} onChange={(e) => set(lang, "question", e.target.value)} />
                </Field>
                <Field label="Answer">
                  <Textarea lang={lang} rows={3} value={get(lang, "answer")} onChange={(e) => set(lang, "answer", e.target.value)} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Title">
                  <Input lang={lang} value={get(lang, "title")} onChange={(e) => set(lang, "title", e.target.value)} />
                </Field>
                <Field label="Description">
                  <Textarea lang={lang} rows={3} value={get(lang, "description")} onChange={(e) => set(lang, "description", e.target.value)} />
                </Field>
                {lang === "en" ? (
                  <Field
                    label="Starting price (MAD, same on the English and French site)"
                    error={!isBlank(get("en", "priceFrom")) && !validPrice(get("en", "priceFrom")) ? "Use a whole number above 0." : ""}
                    hint={`Built-in: ${defs.en.priceFrom} MAD`}
                  >
                    <Input
                      inputMode="numeric"
                      value={get("en", "priceFrom")}
                      error={!isBlank(get("en", "priceFrom")) && !validPrice(get("en", "priceFrom"))}
                      onChange={(e) => {
                        set("en", "priceFrom", e.target.value);
                        set("fr", "priceFrom", e.target.value);
                      }}
                      className="max-w-40"
                    />
                  </Field>
                ) : (
                  <p className="text-xs text-ink-muted">The starting price is shared with the English version.</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ saved, save }) {
  const editor = useSectionEditor({ saved, save, normalize, label: "Home content" });
  const { working, update } = editor;
  const [tab, setTab] = useState("faq");

  let priceError = false;
  for (const id of Object.keys(DEFAULTS.services)) {
    for (const lang of LANGS) {
      const v = getIn(working, ["services", id, lang, "priceFrom"]);
      if (v !== undefined && !isBlank(v) && !validPrice(v)) priceError = true;
    }
  }
  const view = { ...editor, canSave: editor.dirty && !priceError && !editor.saving };

  return (
    <Page
      className="max-w-none!"
      title="Home content"
      subtitle="Frequently asked questions and services shown on the home page, in English and French."
      actions={<SaveActions editor={view} />}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Segmented
            label="Content type"
            value={tab}
            onChange={setTab}
            options={[
              { id: "faq", label: `FAQ (${Object.keys(DEFAULTS.faq).length})` },
              { id: "services", label: `Services (${Object.keys(DEFAULTS.services).length})` },
            ]}
          />
          {tab === "services" && (
            <p className="text-xs text-ink-muted">The starting price is shown in MAD on the site and in search results (structured data).</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {Object.keys(DEFAULTS[tab]).map((id) => (
            <Item key={`${tab}-${id}`} section={tab} id={id} working={working} update={update} />
          ))}
        </div>
      </div>
    </Page>
  );
}

export default function HomeContentPanel() {
  return (
    <SectionLoader section="home" title="Home content" subtitle="Frequently asked questions and services, in English and French.">
      {(saved, save) => <Editor saved={saved} save={save} />}
    </SectionLoader>
  );
}
