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
export async function getCollectionDocs(collectionName) {
  if (typeof window === "undefined") {
    const { getAdminDb } = await import("./firebaseAdmin.js");
    const snapshot = await getAdminDb().collection(collectionName).get();
    return snapshot.docs;
  }

  const { collection, getDocs } = await import("firebase/firestore");
  const { db } = await import("./firebase.js");
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs;
}
