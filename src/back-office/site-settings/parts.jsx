import { useCallback, useEffect, useMemo, useState } from "react";
import { loadSiteSettings, saveSiteSection } from "../lib/siteSettingsStore";
import { Badge, Button, EmptyState, Page, useToast, useUnsavedGuard } from "../ui";

export const cx = (...p) => p.filter(Boolean).join(" ");

export const clone = (v) => JSON.parse(JSON.stringify(v ?? {}));

/** JSON with sorted keys, so two equal objects always compare equal. */
export function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable(v[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v);
}

export const isBlank = (v) => v === undefined || v === null || String(v).trim() === "";

/** Sets `obj[a][b]... = value` (creating objects) on a working copy. */
export function setIn(obj, path, value) {
  let o = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    if (!o[path[i]] || typeof o[path[i]] !== "object") o[path[i]] = {};
    o = o[path[i]];
  }
  o[path[path.length - 1]] = value;
}

export function deleteIn(obj, path) {
  let o = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    o = o?.[path[i]];
    if (!o || typeof o !== "object") return;
  }
  delete o[path[path.length - 1]];
}

export const getIn = (obj, path) => path.reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);

/** Removes empty objects left behind by cleaning. */
export function prune(obj) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      prune(v);
      if (!Object.keys(v).length) delete obj[k];
    }
  }
  return obj;
}

/** Loads one section once. */
export function useSiteSection(section) {
  const [state, setState] = useState({ status: "loading", data: null, error: "" });
  const load = useCallback(async () => {
    setState({ status: "loading", data: null, error: "" });
    try {
      const all = await loadSiteSettings();
      setState({ status: "ready", data: all[section] || {}, error: "" });
    } catch (e) {
      setState({ status: "error", data: null, error: e.message || "Could not load the settings." });
    }
  }, [section]);
  useEffect(() => {
    load();
  }, [load]);
  const save = useCallback(
    async (next) => {
      const res = await saveSiteSection(section, next);
      setState({ status: "ready", data: next, error: "" });
      return res;
    },
    [section]
  );
  return { ...state, reload: load, save };
}

/** Shows the loading and error states, then renders `children(saved, save)`. */
export function SectionLoader({ section, title, subtitle, children }) {
  const s = useSiteSection(section);
  if (s.status === "ready") return children(s.data, s.save);
  return (
    <Page title={title} subtitle={subtitle} className="max-w-none!">
      {s.status === "loading" ? (
        <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-6 text-sm text-ink-muted" role="status">
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading settings
        </div>
      ) : (
        <EmptyState
          title="Could not load the settings"
          message={s.error}
          action={<Button variant="primary" onClick={s.reload}>Try again</Button>}
        />
      )}
    </Page>
  );
}

/**
 * Working copy plus dirty tracking. `normalize(working)` returns the clean
 * object that is stored (only real overrides). `blocked` disables saving.
 */
export function useSectionEditor({ saved, save, normalize, blocked = false, label = "Settings" }) {
  const { toast } = useToast();
  const [working, setWorking] = useState(() => clone(saved));
  const [saving, setSaving] = useState(false);
  const cleaned = useMemo(() => normalize(clone(working)), [working, normalize]);
  const savedClean = useMemo(() => normalize(clone(saved)), [saved, normalize]);
  const dirty = stable(cleaned) !== stable(savedClean);
  useUnsavedGuard(dirty);

  const update = useCallback((fn) => {
    setWorking((w) => {
      const next = clone(w);
      fn(next);
      return next;
    });
  }, []);

  const doSave = async () => {
    setSaving(true);
    try {
      await save(cleaned);
      toast(`${label} saved`);
    } catch (e) {
      toast(e.message || "Could not save. Try again.", "danger");
    } finally {
      setSaving(false);
    }
  };
  const discard = () => setWorking(clone(saved));
  return { working, setWorking, update, cleaned, dirty, saving, doSave, discard, canSave: dirty && !blocked && !saving };
}

export function SaveActions({ editor, extra }) {
  return (
    <>
      {extra}
      {editor.dirty && <Badge tone="warning">Unsaved changes</Badge>}
      <Button variant="ghost" disabled={!editor.dirty || editor.saving} onClick={editor.discard}>Discard</Button>
      <Button variant="primary" loading={editor.saving} disabled={!editor.canSave} onClick={editor.doSave}>Save changes</Button>
    </>
  );
}

export function EditedBadge() {
  return <Badge tone="success">Edited</Badge>;
}

/** Segmented control used for small mode switches. */
export function Segmented({ value, onChange, options, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-line bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cx(
            "cursor-pointer rounded px-3 py-1 text-xs font-medium tracking-normal! transition-colors duration-150",
            value === o.id ? "bg-success/15 text-success" : "text-ink hover:text-ink-strong"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const LANG_LABEL = { en: "English", fr: "French" };
