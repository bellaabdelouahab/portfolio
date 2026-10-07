// First-party proxy for the self-hosted Plausible instance.
//
// Ad blockers (Brave, uBlock Origin) block known analytics domains and paths.
// Serving the script and the event endpoint from this site, under neutral
// paths, makes them ordinary same-site requests, so far fewer visits are
// lost. The visitor's IP address and user agent are forwarded so Plausible can
// count unique visitors; Plausible itself never stores the IP.
import express from "express";

const UPSTREAM = (process.env.PLAUSIBLE_URL || "https://plausible.abdelouahab.xyz").replace(/\/+$/, "");
let script = { at: 0, body: "" };

export function statsRoutes(app) {
  app.get("/_s/a.js", async (_req, res) => {
    try {
      if (!script.body || Date.now() - script.at > 60 * 60 * 1000) {
        const r = await fetch(`${UPSTREAM}/js/script.js`);
        if (!r.ok) throw new Error(`upstream ${r.status}`);
        script = { at: Date.now(), body: await r.text() };
      }
      res.type("application/javascript").set("Cache-Control", "public, max-age=3600").send(script.body);
    } catch {
      res.status(502).type("application/javascript").send("/* analytics unavailable */");
    }
  });

  app.post("/_s/e", express.text({ type: "*/*", limit: "10kb" }), async (req, res) => {
    try {
      const r = await fetch(`${UPSTREAM}/api/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": req.get("user-agent") || "",
          "X-Forwarded-For": req.ip || "",
        },
        body: req.body,
      });
      res.status(r.status === 202 ? 202 : 200).end("ok");
    } catch {
      res.status(202).end("ok"); // never surface analytics errors to visitors
    }
  });
}
