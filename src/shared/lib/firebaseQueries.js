import { collection, getDocs, query, limit, startAfter, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { byNewest } from "./dates";

// New function to fetch all certificates at once
export async function getAllCertificates() {
    const certificatesCollection = collection(db, "certificates");
    const snapshot = await getDocs(certificatesCollection);
    // Firestore's document order is unspecified, so an unsorted list reshuffles
    // between visits. Certificates store createdAt as a Mongo { $date } wrapper,
    // which is why the comparator goes through toDate rather than new Date().
    const allCertificates = snapshot.docs.map(doc => doc.data()).sort(byNewest("createdAt"));
    const count = snapshot.size;
    return { allCertificates, count };
}

export async function getPaginatedCertificates(req,lastVisible = null, pageSize = 9) {
    const certificatesCollection = collection(db, "certificates");
    let certificatesQuery;

    if (lastVisible) {
        certificatesQuery = query(
            certificatesCollection,
            orderBy("title"),
            startAfter(lastVisible),
            limit(pageSize)
        );
    } else {
        certificatesQuery = query(
            certificatesCollection,
            orderBy("title"),
            limit(pageSize)
        );
    }

    const snapshot = await getDocs(certificatesQuery);
    const certificatesInit = snapshot.docs.map(doc => doc.data());
    const count = snapshot.size;
    return { certificatesInit, newLastVisible: snapshot.docs[snapshot.docs.length - 1], count };
}
