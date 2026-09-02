import { initializeApp, cert, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Server-only. Mirrors scripts/generate-sitemap.js's init exactly — same
// GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_SERVICE_ACCOUNT env var
// convention already used by CI and the sitemap script, so the SSR server
// and the sitemap generator can be provisioned identically. This module is
// only ever reached via the dynamic import in firestoreAccess.js's server
// branch, so it never ends up in the browser bundle.
function getAdminApp() {
  if (getApps().length) return getApps()[0];

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault() });
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (!serviceAccount) {
    throw new Error(
      "No Firebase Admin credentials available. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT."
    );
  }

  return initializeApp({ credential: cert(serviceAccount) });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
