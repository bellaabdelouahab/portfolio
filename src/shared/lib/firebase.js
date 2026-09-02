import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Auth is browser-only functionality (Navbar's auth check, /fill-db login) —
// getAuth() relies on browser storage under the hood and isn't meant to run
// in a Node SSR process, unlike getFirestore() which works fine there. This
// file itself is still imported at module scope during SSR (for `db`), so
// the guard has to live here rather than at each call site.
export const auth = typeof window !== "undefined" ? getAuth(app) : undefined;

export default app;
