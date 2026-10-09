import { byNewest } from "./dates";
import { getCollectionDocs } from "./firestoreAccess";

export async function getAllCertificates() {
  const docs = await getCollectionDocs("certificates");
  // Firestore's document order is unspecified, so an unsorted list reshuffles
  // between visits. Certificates store createdAt as a Mongo { $date } wrapper,
  // which is why the comparator goes through toDate rather than new Date().
  const allCertificates = docs
    .map((doc) => doc.data())
    .filter((c) => !c.hidden)
    .sort(byNewest("createdAt"));
  return { allCertificates, count: allCertificates.length };
}
