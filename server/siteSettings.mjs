// Back-office editable site settings: shared UI text, contact details, SEO and
// home content overrides. Stored in Firestore, one document per section in the
// `siteSettings` collection, and layered over the defaults in the code, so an
// empty or unreachable Firestore leaves the site exactly as built.
//
//   GET  /api/site-settings            public, { strings, contact, seo, home }
//   PUT  /api/site-settings/:section   owner only, body { data: <section> }
import express from "express";
import { initializeApp, cert, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { requireOwner } from "./assets.mjs";

const COLLECTION = "siteSettings";
const SECTIONS = ["strings", "contact", "seo", "home"];
const TTL_MS = 30_000;
const FAILURE_TTL_MS = 10_000;
const READ_TIMEOUT_MS = 3_000;
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_TEXT = 4000;
const CONTACT_KEYS = ["whatsappNumber", "phoneDisplay", "email", "bookingUrl", "ice", "githubUrl", "linkedinUrl"];
const URL_KEYS = ["bookingUrl", "githubUrl", "linkedinUrl"];

const empty = () => ({ strings: {}, contact: {}, seo: {}, home: {} });

let cache = null; // { at, ttl, value }
let inflight = null;
let generation = 0; // bumped by every write so a read that started earlier is not cached

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

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

async function load() {
  const snap = await Promise.race([
    db().collection(COLLECTION).get(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), READ_TIMEOUT_MS)),
  ]);
  const value = empty();
  snap.forEach((doc) => {
    if (SECTIONS.includes(doc.id) && isObject(doc.data())) value[doc.id] = doc.data();
  });
  return value;
}

/** All sections, cached 30 s. Never throws: on failure returns the last good value or empty. */
export async function getSiteSettings() {
  if (cache && Date.now() - cache.at < cache.ttl) return cache.value;
  if (!inflight) {
    const started = generation;
    inflight = load()
      .then((value) => {
        if (started === generation) cache = { at: Date.now(), ttl: TTL_MS, value };
        return value;
      })
      .catch((e) => {
        console.error("site-settings:", e.message);
        // Keep serving the last good value and retry shortly.
        cache = { at: Date.now(), ttl: FAILURE_TTL_MS, value: cache?.value || empty() };
        return cache.value;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

// ---- validation -----------------------------------------------------------

class Invalid extends Error {}
const fail = (msg) => {
  throw new Invalid(msg);
};

const str = (v, where) => {
  if (typeof v !== "string") fail(`${where} must be a string`);
  if (v.length > MAX_TEXT) fail(`${where} is longer than ${MAX_TEXT} characters`);
  return v.trim();
};

const isHttpUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

function cleanStrings(data) {
  const out = {};
  for (const [lang, map] of Object.entries(data)) {
    if (lang !== "en" && lang !== "fr") continue;
    if (!isObject(map)) fail(`strings.${lang} must be an object`);
    const kept = {};
    for (const [key, value] of Object.entries(map)) {
      // Keys look like "nav.home"; Firestore accepts dots in map keys on set().
      if (key.startsWith("__")) fail(`strings.${lang} has an invalid key "${key}"`);
      const text = str(value, `strings.${lang}.${key}`);
      if (text) kept[key] = text;
    }
    if (Object.keys(kept).length) out[lang] = kept;
  }
  return out;
}

function cleanContact(data) {
  const out = {};
  for (const key of CONTACT_KEYS) {
    if (!(key in data)) continue;
    let v = str(data[key], `contact.${key}`);
    if (!v) continue;
    if (key === "whatsappNumber") {
      v = v.replace(/\D/g, "");
      if (!v) continue;
    } else if (key === "email") {
      if (!v.includes("@")) fail("contact.email must contain @");
    } else if (URL_KEYS.includes(key)) {
      if (!isHttpUrl(v)) fail(`contact.${key} must be an http(s) URL`);
    }
    out[key] = v;
  }
  return out;
}

/** Scalar leaves (strings or numbers) nested in objects; empty strings are dropped. */
function cleanTree(value, where, depth = 0) {
  if (depth > 6) fail(`${where} is nested too deeply`);
  if (typeof value === "string") return str(value, where) || undefined;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail(`${where} must be a finite number`);
    if (where.endsWith(".priceFrom") && value < 0) fail(`${where} must not be negative`);
    return value;
  }
  if (isObject(value)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("__") || k.includes(".")) fail(`${where} has an invalid key "${k}"`);
      const cleaned = cleanTree(v, `${where}.${k}`, depth + 1);
      if (cleaned !== undefined && !(isObject(cleaned) && !Object.keys(cleaned).length)) out[k] = cleaned;
    }
    return out;
  }
  return fail(`${where} must be a string, a number or an object`);
}

function cleanSection(section, data) {
  if (section === "strings") return cleanStrings(data);
  if (section === "contact") return cleanContact(data);
  const out = cleanTree(data, section);
  if (section === "home") {
    for (const [group, items] of Object.entries(out)) {
      if (!isObject(items)) fail(`home.${group} must be an object`);
    }
  }
  return out;
}

// ---- routes ---------------------------------------------------------------

export function siteSettingsRoutes() {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    res.set("Cache-Control", "no-cache").json(await getSiteSettings());
  });

  router.put("/:section", requireOwner, express.json({ limit: "1mb" }), async (req, res) => {
    const { section } = req.params;
    if (!SECTIONS.includes(section)) return res.status(404).json({ message: "Unknown section" });
    try {
      const data = req.body?.data;
      if (!isObject(data)) fail("Body must be { data: <object> }");
      if (Buffer.byteLength(JSON.stringify(data)) > MAX_BODY_BYTES) fail("Section is larger than 1 MB");
      const cleaned = cleanSection(section, data);
      const updatedAt = new Date().toISOString();
      await db().collection(COLLECTION).doc(section).set(cleaned);
      generation += 1;
      cache = null; // the next read sees the write immediately
      res.json({ ok: true, section, updatedAt });
    } catch (e) {
      if (e instanceof Invalid) return res.status(400).json({ message: e.message });
      console.error("site-settings write:", e.message);
      res.status(502).json({ message: "Could not save settings" });
    }
  });

  // express.json reports malformed or oversized bodies through next(err).
  router.use((err, _req, res, _next) => {
    res.status(err.status === 413 ? 413 : 400).json({ message: err.status === 413 ? "Section is larger than 1 MB" : "Invalid JSON body" });
  });

  return router;
}
