import { auth } from "../../shared/lib/firebase";

/**
 * Client for the draft API (server/drafts.mjs). Drafts live on the VPS, so they
 * survive a lost connection, a closed tab and a switch of device.
 *
 * A draft is `{ id, meta, data, updatedAt }`:
 * - id: the project's id for an edit, or the new project's id for a creation
 * - meta: small, listable info `{ title, kind: "new" | "edit", projectId, step }`
 * - data: the whole form state (JSON only; uploaded images are referenced by path)
 */
async function call(method, url, body) {
  const user = auth?.currentUser;
  if (!user) throw new Error("Not signed in");
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Draft request failed (${res.status})`);
  return data;
}

/** `[{ id, title, kind, projectId, step, updatedAt }]`, newest first. */
export const listDrafts = async () => (await call("GET", "/api/drafts")).drafts;
/** The full draft, or null when it does not exist. */
export async function loadDraft(id) {
  try {
    return await call("GET", `/api/drafts/${encodeURIComponent(id)}`);
  } catch (e) {
    if (/not found/i.test(e.message)) return null;
    throw e;
  }
}
export const saveDraft = (id, { meta, data }) => call("PUT", `/api/drafts/${encodeURIComponent(id)}`, { meta, data });
export const deleteDraft = (id) => call("DELETE", `/api/drafts/${encodeURIComponent(id)}`);
