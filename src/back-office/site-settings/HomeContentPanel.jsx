import { useState } from "react";
import { faqData, servicesContent } from "../../front-office/home/homeContent";
import { faqFr, servicesFr } from "../../front-office/home/homeContent.fr";
import { buildContent, formatPrice } from "../../shared/i18n/useContent";
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
        en: { title: s.title, description: s.description },
        fr: { title: servicesFr[s.id]?.title ?? s.title, description: servicesFr[s.id]?.description ?? s.description },
        tiers: (s.tiers || []).map((t) => ({
          id: t.id,
          name: { en: t.name, fr: servicesFr[s.id]?.tiers?.[t.id]?.name ?? t.name },
          price: t.priceFrom,
          note: { en: t.priceNote || "", fr: servicesFr[s.id]?.tiers?.[t.id]?.priceNote ?? t.priceNote ?? "" },
        })),
      },
    ])
  ),
};
const FIELDS = { faq: ["question", "answer"], services: ["title", "description"] };

const validPrice = (v) => /^\d{1,7}$/.test(String(v).trim()) && Number(v) > 0;

function normalize(w) {
  const out = { faq: {}, services: {} };
  for (const section of ["faq", "services"]) {
    for (const [id, langs] of Object.entries(DEFAULTS[section])) {
      for (const lang of LANGS) {
        for (const f of FIELDS[section]) {
          const raw = getIn(w, [section, id, lang, f]);
          if (raw === undefined || raw === null || isBlank(raw)) continue;
          const v = String(raw).trim();
          if (v === String(langs[lang][f]).trim()) continue;
          setIn(out, [section, id, lang, f], v);
        }
      }
      if (section === "services") {
        for (const t of langs.tiers) {
          const base = ["services", id, "tiers", t.id];
          const price = getIn(w, [...base, "priceFrom"]);
          if (!isBlank(price) && validPrice(price) && Number(price) !== Number(t.price)) {
            setIn(out, [...base, "priceFrom"], Number(price));
          }
          for (const lang of LANGS) {
            const note = getIn(w, [...base, lang, "priceNote"]);
            if (isBlank(note)) continue;
            const v = String(note).trim();
            if (v !== t.note[lang].trim()) setIn(out, [...base, lang, "priceNote"], v);
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

function Item({ section, id, working, update, children }) {
  const defs = DEFAULTS[section][id];
  const get = (lang, f) => {
    const v = getIn(working, [section, id, lang, f]);
    return v !== undefined && v !== null ? String(v) : String(defs[lang][f]);
  };
  const changed = (lang, f) => {
    const v = get(lang, f);
    return !isBlank(v) && v.trim() !== String(defs[lang][f]).trim();
  };
  const edited =
    LANGS.some((l) => FIELDS[section].some((f) => changed(l, f))) ||
    (section === "services" && Boolean(normalize(working).services?.[id]?.tiers));
  const touched =
    LANGS.some((l) => FIELDS[section].some((f) => getIn(working, [section, id, l, f]) !== undefined)) ||
    (section === "services" && getIn(working, [section, id, "tiers"]) !== undefined);
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
              </>
            )}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

/** Packages of one service: from price (shared) and typical range text per language, plus the derived headlines. */
function Packages({ id, working, update, cleaned }) {
  const defs = DEFAULTS.services[id];
  const preview = Object.fromEntries(LANGS.map((l) => [l, buildContent(l, cleaned).services.find((s) => s.id === id)]));
  const path = (tid, ...rest) => ["services", id, "tiers", tid, ...rest];
  const edited = (t) => {
    const price = getIn(working, path(t.id, "priceFrom"));
    const priceEdited = !isBlank(price) && validPrice(price) && Number(price) !== Number(t.price);
    return priceEdited || LANGS.some((l) => {
      const n = getIn(working, path(t.id, l, "priceNote"));
      return !isBlank(n) && String(n).trim() !== t.note[l].trim();
    });
  };

  return (
    <div className="mt-3 border-t border-line pt-3">
      <div className="mb-1 text-xs font-medium text-ink">Packages</div>
      <p className="mb-2 text-xs text-ink-muted">
        Leave a field empty to use the built-in value. Changing only the price keeps the built-in range text: edit the range text too when the range changes.
      </p>
      <div className="hidden grid-cols-[10rem_8rem_1fr_1fr_5.5rem] gap-3 px-2 pb-1 text-[0.7rem] font-medium uppercase text-ink-muted md:grid">
        <span>Package</span>
        <span>From (MAD)</span>
        <span>Typical range, English</span>
        <span>Typical range, French</span>
        <span />
      </div>
      <div className="flex flex-col gap-1.5">
        {defs.tiers.map((t) => {
          const price = getIn(working, path(t.id, "priceFrom"));
          const bad = !isBlank(price) && !validPrice(price);
          const isEdited = edited(t);
          const touched = getIn(working, path(t.id)) !== undefined;
          return (
            <div
              key={t.id}
              className={cx(
                "grid grid-cols-1 items-start gap-2 rounded-md border px-2 py-2 md:grid-cols-[10rem_8rem_1fr_1fr_5.5rem] md:gap-3",
                isEdited ? "border-success/40" : "border-line"
              )}
            >
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 md:min-h-9">
                <span className="text-sm font-medium text-ink-strong">{t.name.en}</span>
                {isEdited && <Badge tone="success">Edited</Badge>}
              </div>
              <div className="min-w-0">
                <Input
                  inputMode="numeric"
                  aria-label={`${t.name.en}: from price in MAD`}
                  placeholder={String(t.price)}
                  value={price === undefined || price === null ? "" : String(price)}
                  error={bad}
                  onChange={(e) => update((w) => setIn(w, path(t.id, "priceFrom"), e.target.value))}
                />
                {bad && <span className="mt-1 block text-xs text-danger">Whole number above 0.</span>}
              </div>
              {LANGS.map((lang) => (
                <Input
                  key={lang}
                  lang={lang}
                  aria-label={`${t.name.en}: typical range, ${LANG_LABEL[lang]}`}
                  placeholder={t.note[lang] || "No range text"}
                  value={String(getIn(working, path(t.id, lang, "priceNote")) ?? "")}
                  onChange={(e) => update((w) => setIn(w, path(t.id, lang, "priceNote"), e.target.value))}
                />
              ))}
              <Button size="sm" variant="ghost" disabled={!touched} onClick={() => update((w) => deleteIn(w, path(t.id)))}>
                Reset
              </Button>
            </div>
          );
        })}
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-ink-muted md:grid-cols-[auto_1fr] md:gap-x-3">
        {LANGS.map((l) => (
          <div key={l} className="contents">
            <dt className="font-medium text-ink">{LANG_LABEL[l]} card headline</dt>
            <dd className="font-medium text-success">{preview[l]?.startingPrice}</dd>
          </div>
        ))}
        <dt className="font-medium text-ink">Service minimum (search results)</dt>
        <dd>{formatPrice(preview.en?.priceFrom ?? 0, "en")} MAD, the lowest package price</dd>
      </dl>
    </div>
  );
}

function Editor({ saved, save }) {
  const editor = useSectionEditor({ saved, save, normalize, label: "Home content" });
  const { working, update } = editor;
  const [tab, setTab] = useState("faq");

  let priceError = false;
  for (const [id, d] of Object.entries(DEFAULTS.services)) {
    for (const t of d.tiers) {
      const v = getIn(working, ["services", id, "tiers", t.id, "priceFrom"]);
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
            <p className="text-xs text-ink-muted">Package prices are shown in MAD on the site and in search results (structured data). Both headlines and the service minimum follow them.</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {Object.keys(DEFAULTS[tab]).map((id) => (
            <Item key={`${tab}-${id}`} section={tab} id={id} working={working} update={update}>
              {tab === "services" && <Packages id={id} working={working} update={update} cleaned={editor.cleaned} />}
            </Item>
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
