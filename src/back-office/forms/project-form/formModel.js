/**
 * Pure helpers for the project wizard: default values, the case-study
 * serializer (same output shape the old parseCaseStudy produced), validation
 * and the local draft store.
 */

const lines = (arr, fn) => (arr || []).map(fn).join("\n");

export const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "case", label: "Case study" },
  { id: "french", label: "French" },
  { id: "media", label: "Media" },
  { id: "stack", label: "Stack and extras" },
  { id: "review", label: "Review" },
];

export const FR_FIELDS = [
  "fr_title", "fr_description", "fr_client", "fr_role", "fr_status",
  "fr_summary", "fr_challenge", "fr_solution", "fr_outcome", "fr_results", "fr_features",
];

/** Plain values object for every text/boolean field in the form. */
export function valuesFromProject(p) {
  const cs = p?.caseStudy || {};
  const fr = p?.fr || {};
  const frCs = fr.caseStudy || {};
  const has = (s) => (cs.services || []).includes(s);
  return {
    title: p?.title || "",
    description: p?.description || "",
    githubLink: p?.githubLink || "",
    startDate: p?.startDate ? String(p.startDate).substring(0, 10) : "",
    endDate: p?.endDate ? String(p.endDate).substring(0, 10) : "",
    highlighted: p?.highlighted === "star",
    hidden: p?.hidden === true,
    cs_kind: cs.kind || "client",
    cs_web: has("web"),
    cs_data: has("data"),
    cs_client: cs.client || "",
    cs_role: cs.role || "",
    cs_status: cs.status || "",
    cs_liveUrl: cs.liveUrl || "",
    cs_summary: cs.summary || "",
    cs_challenge: cs.challenge || "",
    cs_solution: cs.solution || "",
    cs_outcome: cs.outcome || "",
    cs_results: lines(cs.results, (r) => `${r.value} | ${r.label}`),
    cs_features: lines(cs.features, (f) => f),
    fr_title: fr.title || "",
    fr_description: fr.description || "",
    fr_client: frCs.client || "",
    fr_role: frCs.role || "",
    fr_status: frCs.status || "",
    fr_summary: frCs.summary || "",
    fr_challenge: frCs.challenge || "",
    fr_solution: frCs.solution || "",
    fr_outcome: frCs.outcome || "",
    fr_results: lines(frCs.results, (r) => `${r.value} | ${r.label}`),
    fr_features: lines(frCs.features, (f) => f),
  };
}

const splitLines = (s) => String(s || "").split("\n").map((l) => l.trim()).filter(Boolean);

export function parseResults(s) {
  return splitLines(s)
    .map((l) => {
      const [value, ...rest] = l.split("|");
      return { value: value.trim(), label: rest.join("|").trim() };
    })
    .filter((r) => r.value && r.label);
}

/** Builds { fr, caseStudy, hidden } exactly like the old parseCaseStudy(formData, initial). */
export function parseCaseStudy(v, initial) {
  const text = (n) => String(v[n] || "").trim();
  const frText = (n) => text(n) || undefined;
  const services = [v.cs_web && "web", v.cs_data && "data"].filter(Boolean);
  const results = parseResults(v.cs_results);
  const frResults = parseResults(v.fr_results);
  const frFeatures = splitLines(v.fr_features);
  const prevFr = initial?.fr || {};
  const frCaseStudy = Object.fromEntries(
    Object.entries({
      client: frText("fr_client"), role: frText("fr_role"), status: frText("fr_status"),
      summary: frText("fr_summary"), challenge: frText("fr_challenge"), solution: frText("fr_solution"),
      outcome: frText("fr_outcome"),
      results: frResults.length ? frResults : undefined,
      features: frFeatures.length ? frFeatures : undefined,
    }).filter(([, x]) => x !== undefined),
  );
  const fr = {
    ...prevFr,
    ...(frText("fr_title") ? { title: frText("fr_title") } : {}),
    ...(frText("fr_description") ? { description: frText("fr_description") } : {}),
    caseStudy: frCaseStudy,
  };
  if (!frText("fr_title")) delete fr.title;
  if (!frText("fr_description")) delete fr.description;
  return {
    fr,
    caseStudy: {
      ...(initial?.caseStudy || {}),
      kind: text("cs_kind") || "client",
      services,
      client: text("cs_client"),
      role: text("cs_role"),
      status: text("cs_status"),
      liveUrl: text("cs_liveUrl"),
      summary: text("cs_summary"),
      challenge: text("cs_challenge"),
      solution: text("cs_solution"),
      outcome: text("cs_outcome"),
      results,
      features: splitLines(v.cs_features),
    },
    hidden: v.hidden === true,
  };
}

/** Number of French fields with content, out of FR_FIELDS.length. */
export const frenchFilled = (v) => FR_FIELDS.filter((k) => String(v[k] || "").trim()).length;

/** Problems keyed by step id: { [stepId]: [{ field?, message }] }. */
export function validate(v, { coverFile, existingImage, carouselItems, isEdit }) {
  const out = { basics: [], case: [], french: [], media: [], stack: [] };
  if (!v.title.trim()) out.basics.push({ field: "title", message: "Title is required." });
  if (!v.description.trim()) out.basics.push({ field: "description", message: "Short description is required." });
  if (v.startDate && v.endDate && v.endDate < v.startDate)
    out.basics.push({ field: "endDate", message: "End date is before the start date." });
  if (v.cs_liveUrl.trim() && !/^https?:\/\//i.test(v.cs_liveUrl.trim()))
    out.case.push({ field: "cs_liveUrl", message: "Start the URL with https://" });
  if (!coverFile && !existingImage)
    out.media.push({ field: "cover", message: isEdit ? "A cover image is required." : "Add a cover image to create the project." });
  if (coverFile && coverFile.type !== "image/webp")
    out.media.push({ field: "cover", message: "Only .webp images are accepted for the cover." });
  carouselItems.forEach((item, i) => {
    if (!item.title.trim()) out.media.push({ field: `shot-${item.id}`, message: `Screenshot ${i + 1} needs a title.` });
    if (item.file && item.file.type !== "image/webp")
      out.media.push({ field: `shot-${item.id}`, message: `Screenshot "${item.title || i + 1}" must be .webp.` });
  });
  return out;
}

export const countProblems = (errs) => Object.values(errs).reduce((n, list) => n + list.length, 0);
export const fieldError = (list, field) => list?.find((e) => e.field === field)?.message;

/* ---- Draft storage (localStorage, never throws) ---------------------- */

const draftKey = (id) => `project-draft:${id || "new"}`;

export function readDraft(id) {
  try {
    const raw = window.localStorage.getItem(draftKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function writeDraft(id, data) {
  try {
    window.localStorage.setItem(draftKey(id), JSON.stringify({ ...data, savedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}
export function clearDraft(id) {
  try {
    window.localStorage.removeItem(draftKey(id));
  } catch {
    /* ignore */
  }
}
