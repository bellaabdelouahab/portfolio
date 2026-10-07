// Read-only JSON for the public collections. The browser used to load the whole
// Firebase SDK (about 1.7 MB of JavaScript) just to read these on navigation;
// it now asks this endpoint, which serves the same data from the server's cache.
import { initializeApp, cert, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const COLLECTIONS = new Set(["projects", "certificates", "clients", "reports"]);
const TTL_MS = 60_000;
const cache = new Map();

function db() {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: process.env.GOOGLE_APPLICATION_CREDENTIALS
          ? applicationDefault()
          : cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")),
      });
  return getFirestore(app);
}

const plain = (v) => {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(plain);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plain(x)]));
  return v;
};

export function contentRoutes(app) {
  app.get("/api/content/:name", async (req, res) => {
    const { name } = req.params;
    if (!COLLECTIONS.has(name)) return res.status(404).json({ message: "Unknown collection" });
    try {
      let hit = cache.get(name);
      if (!hit || Date.now() - hit.at > TTL_MS) {
        const snap = await db().collection(name).get();
        hit = { at: Date.now(), body: snap.docs.map((d) => ({ id: d.id, ...plain(d.data()) })) };
        cache.set(name, hit);
      }
      res.set("Cache-Control", "public, max-age=60").json(hit.body);
    } catch (e) {
      console.error("content:", e.message);
      res.status(502).json({ message: "Content unavailable" });
    }
  });
}
