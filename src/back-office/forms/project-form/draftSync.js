/**
 * Draft persistence for the wizard.
 *
 * Primary store: the server (src/back-office/lib/draftStore.js). Fallback: this
 * device's localStorage, used when the server call fails or nobody is signed
 * in. Every save writes localStorage first (synchronous, so it also works in
 * `pagehide`), then the server. A local copy flagged `synced: false` is pushed
 * to the server later.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteDraft, listDrafts, loadDraft, saveDraft } from "../../lib/draftStore";

const KEY = "pf-draft:";

const readLocal = (id) => {
  try {
    const raw = window.localStorage.getItem(KEY + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeLocal = (id, value) => {
  try {
    window.localStorage.setItem(KEY + id, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};
const clearLocal = (id) => {
  try {
    window.localStorage.removeItem(KEY + id);
  } catch {
    /* ignore */
  }
};
const localIds = () => {
  try {
    return Object.keys(window.localStorage).filter((k) => k.startsWith(KEY)).map((k) => k.slice(KEY.length));
  } catch {
    return [];
  }
};

const newer = (a, b) => String(a?.updatedAt || "") >= String(b?.updatedAt || "");

/** Finds a draft by id: the newest of the server copy and an unsynced local copy. */
export async function findDraft(id) {
  let server = null;
  try {
    server = await loadDraft(id);
  } catch {
    server = null;
  }
  const local = readLocal(id);
  if (local && !local.synced && (!server || newer(local, server))) return local;
  return server || null;
}

/** Newest-first list of `new` drafts (server plus unsynced local ones). */
export async function findNewDrafts() {
  const map = new Map();
  try {
    for (const d of await listDrafts()) if (d.kind === "new") map.set(d.id, d);
  } catch {
    /* offline: local only */
  }
  for (const id of localIds()) {
    const l = readLocal(id);
    if (l && l.meta?.kind === "new" && !map.has(id)) map.set(id, { id, ...l.meta, updatedAt: l.updatedAt });
  }
  return [...map.values()].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function removeDraft(id) {
  clearLocal(id);
  try {
    await deleteDraft(id);
  } catch {
    /* already gone, offline or signed out: the local copy is removed anyway */
  }
}

export function timeAgo(iso) {
  const t = new Date(iso).getTime();
  if (!t) return "earlier";
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  const d = Math.round(s / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}
export const clock = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const DEBOUNCE_MS = 1500;
const RETRY_MS = 20000;

/**
 * Autosave. `build()` returns `{ meta, data }` for the current state (read
 * through a ref, so it is always fresh). Re-run when `changeKey` changes.
 * Returns `{ status, savedAt, unsynced, flush }`.
 */
export function useDraftSync({ draftId, enabled, changeKey, build }) {
  const [status, setStatus] = useState("idle"); // idle | dirty | saving | saved | offline
  const [savedAt, setSavedAt] = useState(null);
  const buildRef = useRef(build);
  buildRef.current = build;
  const idRef = useRef(draftId);
  idRef.current = draftId;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const timer = useRef(null);
  const busy = useRef(false);
  const again = useRef(false);
  const dirty = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    if (!enabledRef.current || !idRef.current) return;
    if (busy.current) {
      again.current = true;
      return;
    }
    busy.current = true;
    try {
      const id = idRef.current;
      const { meta, data } = buildRef.current();
      const updatedAt = new Date().toISOString();
      writeLocal(id, { id, meta, data, updatedAt, synced: false });
      if (alive.current) setStatus("saving");
      try {
        const res = await saveDraft(id, { meta, data });
        writeLocal(id, { id, meta, data, updatedAt: res?.updatedAt || updatedAt, synced: true });
        dirty.current = false;
        if (alive.current) {
          setStatus("saved");
          setSavedAt(new Date());
        }
      } catch {
        if (alive.current) setStatus("offline");
      }
    } finally {
      busy.current = false;
      if (again.current) {
        again.current = false;
        flush();
      }
    }
  }, []);

  // Debounced save after any change.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    if (!enabled) return undefined;
    dirty.current = true;
    setStatus((s) => (s === "offline" ? s : "dirty"));
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeKey, enabled]);

  // Save when the tab is hidden or closed; retry while offline.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" || document.visibilityState === undefined) {
        if (dirty.current) flush();
      }
    };
    const onPageHide = () => dirty.current && flush();
    const onOnline = () => dirty.current && flush();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("online", onOnline);
    const retry = setInterval(() => {
      if (dirty.current && enabledRef.current) flush();
    }, RETRY_MS);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("online", onOnline);
      clearInterval(retry);
    };
  }, [flush]);

  return { status, savedAt, flush, unsynced: status === "dirty" || status === "saving" || status === "offline" };
}
