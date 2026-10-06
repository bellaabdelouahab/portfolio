// Asset storage on the VPS.
//
// Files uploaded from the back office are written to UPLOADS_DIR (a persistent
// volume in production) instead of being committed to GitHub from the browser.
// A cron job on the VPS (see ops/assets-sync) copies that directory to the
// `uploads` branch of the GitHub repository and reports its status in
// `.sync-status.json`, which the back office shows. Images baked into the build
// (public/images) keep working; anything in UPLOADS_DIR is served first.
import express from "express";
import { initializeApp, cert, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const OWNER_EMAIL = "abdobella977@gmail.com";
// The back office signs in with GitHub only, so the token must also carry the
// owner's GitHub identity, not just a matching email address.
const OWNER_GITHUB_ID = "81409194";
export const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || "./.uploads");
const ALLOWED_ROOTS = ["images", "reports"];
const ALLOWED_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif", ".pdf", ".docx", ".pptx"]);
const MAX_BYTES = 25 * 1024 * 1024;
const STATUS_FILE = ".sync-status.json";
const REQUEST_FILE = ".sync-request";

function adminApp() {
  if (getApps().length) return getApps()[0];
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return initializeApp({ credential: applicationDefault() });
  return initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")) });
}

/** Accepts `public/images/...` (what the forms send) or `images/...`. */
function resolveAssetPath(input) {
  const clean = String(input || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/^public\//, "");
  const parts = clean.split("/");
  if (parts.some((p) => !p || p === "." || p === ".." || p.startsWith("."))) return null;
  if (!ALLOWED_ROOTS.includes(parts[0])) return null;
  if (!ALLOWED_EXT.has(path.extname(clean).toLowerCase())) return null;
  const abs = path.resolve(UPLOADS_DIR, clean);
  if (!abs.startsWith(UPLOADS_DIR + path.sep)) return null;
  return { rel: clean, abs };
}

async function requireOwner(req, res, next) {
  try {
    const header = req.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Sign in required" });
    const decoded = await getAuth(adminApp()).verifyIdToken(token);
    const githubIds = decoded.firebase?.identities?.["github.com"] || [];
    if (decoded.email !== OWNER_EMAIL || !githubIds.includes(OWNER_GITHUB_ID)) {
      return res.status(403).json({ message: "Not allowed" });
    }
    next();
  } catch {
    res.status(401).json({ message: "Invalid session" });
  }
}

const sha1 = (buf) => crypto.createHash("sha1").update(buf).digest("hex");

async function walk(dir) {
  const out = [];
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

export function assetRoutes() {
  const router = express.Router();
  router.use(express.json({ limit: "40mb" }));

  router.put("/", requireOwner, async (req, res) => {
    const target = resolveAssetPath(req.body?.path);
    const b64 = req.body?.content;
    if (!target || typeof b64 !== "string") return res.status(400).json({ message: "Invalid path or content" });
    const buf = Buffer.from(b64, "base64");
    if (!buf.length || buf.length > MAX_BYTES) return res.status(413).json({ message: "File empty or too large" });
    await fs.mkdir(path.dirname(target.abs), { recursive: true });
    await fs.writeFile(target.abs, buf);
    res.status(201).json({ path: target.rel, sha: sha1(buf), size: buf.length });
  });

  router.delete("/", requireOwner, async (req, res) => {
    const target = resolveAssetPath(req.body?.path);
    if (!target) return res.status(400).json({ message: "Invalid path" });
    await fs.rm(target.abs, { force: true });
    res.json({ path: target.rel, deleted: true });
  });

  router.get("/list", requireOwner, async (req, res) => {
    const dir = String(req.query.dir || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/^public\//, "").replace(/\/+$/, "");
    const parts = dir.split("/");
    if (!ALLOWED_ROOTS.includes(parts[0]) || parts.some((p) => p === ".." || p.startsWith("."))) {
      return res.status(400).json({ message: "Invalid directory" });
    }
    const abs = path.resolve(UPLOADS_DIR, dir);
    if (!abs.startsWith(UPLOADS_DIR + path.sep)) return res.status(400).json({ message: "Invalid directory" });
    let entries = [];
    try { entries = await fs.readdir(abs, { withFileTypes: true }); } catch { return res.json([]); }
    res.json(
      await Promise.all(
        entries.filter((e) => e.isFile() && !e.name.startsWith(".")).map(async (e) => ({
          name: e.name, path: `${dir}/${e.name}`, type: "file", sha: sha1(await fs.readFile(path.join(abs, e.name))),
        })),
      ),
    );
  });

  router.get("/status", requireOwner, async (_req, res) => {
    let status = null;
    try { status = JSON.parse(await fs.readFile(path.join(UPLOADS_DIR, STATUS_FILE), "utf-8")); } catch {}
    const files = await walk(UPLOADS_DIR);
    let bytes = 0;
    let unsynced = 0;
    const lastRun = status?.lastRunAt ? Date.parse(status.lastRunAt) : 0;
    for (const f of files) {
      const st = await fs.stat(f);
      bytes += st.size;
      if (st.mtimeMs > lastRun) unsynced += 1;
    }
    let requested = false;
    try { await fs.access(path.join(UPLOADS_DIR, REQUEST_FILE)); requested = true; } catch {}
    res.json({ storage: { dir: "VPS volume", files: files.length, bytes }, sync: status, unsynced, requested });
  });

  router.post("/sync-request", requireOwner, async (_req, res) => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, REQUEST_FILE), new Date().toISOString());
    res.json({ requested: true });
  });

  return router;
}

/** Serves uploaded files before the built-in ones, with a short cache. */
export function uploadsStatic() {
  return express.static(UPLOADS_DIR, { index: false, dotfiles: "ignore", maxAge: "1h", fallthrough: true });
}
