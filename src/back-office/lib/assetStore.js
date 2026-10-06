import { auth } from "../../shared/lib/firebase";

/**
 * Client for the VPS asset API (server/assets.mjs). Uploads go to the server's
 * persistent volume, which a cron job backs up to GitHub; see ops/assets-sync.
 * Paths use the repo layout the forms already build (`public/images/...`).
 */
async function authHeader() {
  const user = auth?.currentUser;
  if (!user) throw new Error("Not signed in");
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { ...(await authHeader()), ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Asset request failed (${res.status})`);
  return data;
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** Stores a File at `filePath`; resolves with `{ path, sha }` like the old GitHub helper. */
export async function putAsset(file, filePath) {
  if (!file) throw new Error("Missing file");
  const data = await call("PUT", "/api/assets", { path: filePath, content: await toBase64(file) });
  return { path: filePath, sha: data.sha };
}

export async function deleteAsset(filePath) {
  await call("DELETE", "/api/assets", { path: filePath });
}

/** Files directly inside `dir` as `[{ name, path, type: "file", sha }]`. */
export async function listAssets(dir) {
  return call("GET", `/api/assets/list?dir=${encodeURIComponent(dir)}`);
}

export const getAssetStatus = () => call("GET", "/api/assets/status");
export const requestBackup = () => call("POST", "/api/assets/sync-request", {});
