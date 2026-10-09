// Back-office drafts.
//
// An unfinished project (or an unfinished edit of a published one) is saved here
// while you work, so a lost connection, a closed tab or a second sitting never
// costs progress. One JSON file per draft in `<UPLOADS_DIR>/.drafts`. That
// directory is on the persistent volume but outside images/ and reports/, so the
// GitHub backup (ops/assets-sync) never copies it.
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR, requireOwner } from "./assets.mjs";

const DRAFTS_DIR = path.join(UPLOADS_DIR, ".drafts");
const ID_RE = /^[A-Za-z0-9_-]{1,80}$/;
const MAX_BYTES = 2 * 1024 * 1024;

const fileFor = (id) => (ID_RE.test(id) ? path.join(DRAFTS_DIR, `${id}.json`) : null);

async function readDraft(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

export function draftRoutes() {
  const router = express.Router();
  router.use(express.json({ limit: "3mb" }));

  router.get("/", requireOwner, async (_req, res) => {
    try {
      await fs.mkdir(DRAFTS_DIR, { recursive: true });
      const names = (await fs.readdir(DRAFTS_DIR)).filter((n) => n.endsWith(".json"));
      const drafts = [];
      for (const n of names) {
        const d = await readDraft(path.join(DRAFTS_DIR, n));
        if (d) drafts.push({ id: d.id, ...d.meta, updatedAt: d.updatedAt });
      }
      drafts.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
      res.json({ drafts });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

  router.get("/:id", requireOwner, async (req, res) => {
    const file = fileFor(req.params.id);
    if (!file) return res.status(400).json({ message: "Invalid draft id" });
    const d = await readDraft(file);
    if (!d) return res.status(404).json({ message: "Draft not found" });
    res.json(d);
  });

  router.put("/:id", requireOwner, async (req, res) => {
    const file = fileFor(req.params.id);
    if (!file) return res.status(400).json({ message: "Invalid draft id" });
    const body = JSON.stringify({
      id: req.params.id,
      meta: req.body?.meta || {},
      data: req.body?.data ?? {},
      updatedAt: new Date().toISOString(),
    });
    if (Buffer.byteLength(body) > MAX_BYTES) return res.status(413).json({ message: "Draft is too large" });
    try {
      await fs.mkdir(DRAFTS_DIR, { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await fs.writeFile(tmp, body);
      await fs.rename(tmp, file);
      res.json({ ok: true, updatedAt: JSON.parse(body).updatedAt });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

  router.delete("/:id", requireOwner, async (req, res) => {
    const file = fileFor(req.params.id);
    if (!file) return res.status(400).json({ message: "Invalid draft id" });
    await fs.rm(file, { force: true });
    res.json({ ok: true });
  });

  return router;
}
