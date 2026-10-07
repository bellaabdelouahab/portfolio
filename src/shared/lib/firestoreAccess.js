// Returns the raw doc snapshots for a collection, using whichever SDK fits
// the current runtime: firebase-admin on the server (SSR loaders), the
// client modular SDK in the browser (client-side navigations). Both SDKs
// shape a doc snapshot identically (`.id` + `.data()`), so every existing
// loader keeps its own mapping/filtering/sorting untouched and only swaps
// this one boilerplate step.
//
// The admin import is dynamic and only reached on the server branch, so
// firebase-admin (and any service-account handling) never reaches the
// browser bundle — Vite code-splits it into a chunk the client never fetches.
//
// Results are cached in memory so moving between pages does not re-read the
// same collection every time: five minutes in the browser, one minute on the
// server. Concurrent requests for the same collection share one read. Edits
// made in the back office show up when the entry expires.
const TTL_MS = typeof window === "undefined" ? 60_000 : 5 * 60_000;
const cache = new Map();

export function getCollectionDocs(collectionName) {
  const hit = cache.get(collectionName);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.promise;
  const promise = readCollection(collectionName).catch((err) => {
    cache.delete(collectionName);
    throw err;
  });
  cache.set(collectionName, { at: Date.now(), promise });
  return promise;
}

async function readCollection(collectionName) {
  if (typeof window === "undefined") {
    const { getAdminDb } = await import("./firebaseAdmin.js");
    const snapshot = await getAdminDb().collection(collectionName).get();
    return snapshot.docs;
  }

  // Browser: ask the server's cached JSON endpoint instead of loading the
  // Firebase SDK. Rows are wrapped to look like Firestore snapshots so every
  // loader keeps its own `doc.id` and `doc.data()` code.
  const res = await fetch(`/api/content/${collectionName}`);
  if (!res.ok) throw new Error(`Could not load ${collectionName}`);
  const rows = await res.json();
  return rows.map(({ id, ...data }) => ({ id, data: () => data }));
}
