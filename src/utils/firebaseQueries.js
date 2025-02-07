import { collection, getDocs, query, limit, startAfter, orderBy } from "firebase/firestore";
import { db } from "../firebase";

// New function to fetch all certificates at once
export async function getAllCertificates() {
    const certificatesCollection = collection(db, "certificates");
    const snapshot = await getDocs(certificatesCollection);
    const allCertificates = snapshot.docs.map(doc => doc.data());
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
