/**
 * Pure helpers for the project wizard: the form state, the Firestore payload
 * builder (backward compatible: unknown fields are kept, untouched values are
 * written back byte for byte), validation and progress counting.
 *
 * Form state is plain JSON so it can be stored in a draft as is. Images are
 * referenced by their site path (`/images/projects/<id>/...`); files are
 * uploaded the moment they are picked.
 */

export const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "story", label: "Story" },
  { id: "facts", label: "Facts" },
  { id: "french", label: "French" },
  { id: "media", label: "Media" },
  { id: "tech", label: "Technical details" },
  { id: "review", label: "Review" },
];

/** French text fields, in the order the French step shows them. */
export const FR_FIELDS = [
  "fr_title", "fr_description", "fr_client", "fr_role", "fr_status",
  "fr_summary", "fr_challenge", "fr_solution", "fr_outcome", "fr_results", "fr_features",
];

/** Search-engine overrides, flat form keys `seo_<lang>_<field>`. Empty means "automatic". */
export const SEO_LANGS = ["en", "fr"];
export const SEO_FIELDS = ["title", "description", "keywords"];
export const seoKey = (lang, field) => `seo_${lang}_${field}`;
export const SEO_KEYS = SEO_LANGS.flatMap((l) => SEO_FIELDS.map((k) => seoKey(l, k)));

/**
 * The text the public project page uses when nothing is overridden, computed
 * from the form (mirrors ProjectDetailPage.jsx). `word` is the translated
 * "case study" / "project" noun for the title, `caseStudyWord` the one used in
 * the keywords.
 */
export function autoSeo(f, lang, { word, caseStudyWord }) {
  const fr = lang === "fr";
  const pick = (...vals) => vals.map((v) => String(v || "").trim()).find(Boolean) || "";
  const title = pick(fr && f.fr_title, f.title);
  const summary = pick(fr && f.fr_summary, f.summary, fr && f.fr_description, f.description);
  const techs = [
    ...new Set([
      ...(f.tags || []),
      ...(f.techs || []).map((t) => String(t?.title || "").trim()).filter(Boolean),
    ]),
  ];
  return {
    title: `${title}${fr ? " : " : ": "}${word}`,
    description: summary.substring(0, 160),
    keywords: [title, caseStudyWord, ...techs].join(", "),
  };
}

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** New 24-character project id, same shape as the ones already in Firestore. */
export const newProjectId = () => newId().replace(/-/g, "").substring(0, 24);

/** Rows get a key that is stable per source index, so the payload builder can find the stored row. */
const rowsFrom = (name, arr) => (Array.isArray(arr) ? arr : []).map((r, i) => ({ ...r, _k: `${name}-${i}` }));
let rowCounter = 0;
export const newRowKey = (name) => `${name}-n${Date.now().toString(36)}${rowCounter++}`;

const strList = (arr) => (Array.isArray(arr) ? arr.map((x) => String(x ?? "")) : []);
const resultRows = (arr) =>
  (Array.isArray(arr) ? arr : []).map((r) => ({ ...r, value: String(r?.value ?? ""), label: String(r?.label ?? "") }));

export function formFromProject(p) {
  const cs = p?.caseStudy || {};
  const fr = p?.fr || {};
  const frCs = fr.caseStudy || {};
  const services = cs.services || [];
  const frTitles = Array.isArray(fr.carouselTitles) ? fr.carouselTitles : [];
  return {
    title: p?.title || "",
    description: p?.description || "",
    startDate: p?.startDate ? String(p.startDate).substring(0, 10) : "",
    endDate: p?.endDate ? String(p.endDate).substring(0, 10) : "",
    highlighted: p?.highlighted === "star",
    hidden: p?.hidden === true,
    kind: cs.kind || "client",
    web: services.includes("web"),
    data: services.includes("data"),
    summary: cs.summary || "",
    challenge: cs.challenge || "",
    solution: cs.solution || "",
    outcome: cs.outcome || "",
    client: cs.client || "",
    role: cs.role || "",
    status: cs.status || "",
    liveUrl: cs.liveUrl || "",
    results: resultRows(cs.results),
    features: strList(cs.features),
    githubLink: p?.githubLink || "",
    fr_title: fr.title || "",
    fr_description: fr.description || "",
    fr_client: frCs.client || "",
    fr_role: frCs.role || "",
    fr_status: frCs.status || "",
    fr_summary: frCs.summary || "",
    fr_challenge: frCs.challenge || "",
    fr_solution: frCs.solution || "",
    fr_outcome: frCs.outcome || "",
    fr_results: resultRows(frCs.results),
    fr_features: strList(frCs.features),
    ...Object.fromEntries(
      SEO_LANGS.flatMap((l) =>
        SEO_FIELDS.map((k) => [seoKey(l, k), typeof p?.seo?.[l]?.[k] === "string" ? p.seo[l][k] : ""]),
      ),
    ),
    tags: [...(p?.tags || [])],
    techs: rowsFrom("techs", p?.tools?.techs),
    resources: rowsFrom("resources", p?.tools?.resources),
    codeSamples: rowsFrom("codeSamples", p?.codeSamples),
    dataSources: rowsFrom("dataSources", p?.dataSources),
    cover: p?.image || "",
    carousel: (p?.carouselImages || []).map((img, i) => {
      const { img: path, title, _id, ...extra } = img || {};
      const strId = typeof _id === "string" && _id ? _id : `shot-${i}`;
      // A non-string stored _id (e.g. an { $oid } object) is written back untouched.
      return { id: strId, ...(_id !== undefined && strId !== _id ? { origId: _id } : {}), title: title || "", frTitle: String(frTitles[i] ?? ""), img: path || "", extra };
    }),
  };
}

/** The part of the form that is stored and compared: transient upload state is dropped. */
export function serializeForm(f) {
  return {
    ...f,
    carousel: f.carousel
      .filter((c) => !c.uploading)
      .map(({ id, origId, title, frTitle, img, extra }) => ({ id, ...(origId !== undefined ? { origId } : {}), title, frTitle, img, extra: extra || {} })),
  };
}

/** Merge a stored draft form over the defaults so older drafts keep working. */
export const mergeForm = (base, stored) => ({ ...base, ...(stored || {}) });

/* ---- Payload ---------------------------------------------------------- */

const lookup = (...vals) => new Map(vals.filter((v) => typeof v === "string").map((v) => [v.trim(), v]));
/** Returns the stored string when only whitespace changed, the trimmed new one otherwise. */
const keep = (map, cur) => map.get(String(cur ?? "").trim()) ?? String(cur ?? "").trim();
const shotKey = (img, i) => (typeof img?._id === "string" && img._id ? img._id : `shot-${i}`);
const isoDay = (s) => (s ? String(s).substring(0, 10) : "");
const dateField = (prevVal, cur) => (isoDay(prevVal) === cur ? prevVal : cur ? new Date(cur).toISOString() : null);

function stripUndefined(v) {
  if (Array.isArray(v)) return v.map(stripUndefined);
  if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype) {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, stripUndefined(x)]));
  }
  return v;
}

const rowHasContent = (r, fields) => fields.some((k) => String(r[k] ?? "").trim());

/** Cleans a list of rows (drops empty ones, trims, removes `_k`), keeping stored text untouched. */
function cleanRows(name, rows, prevRows, fields, idFor) {
  const prevByKey = new Map((prevRows || []).map((r, i) => [`${name}-${i}`, r]));
  return rows
    .filter((r) => rowHasContent(r, fields))
    .map((r) => {
      const { _k, ...rest } = r;
      const prevRow = prevByKey.get(_k) || {};
      const out = { ...rest };
      // Only rows that did not exist before get a new _id; stored rows keep theirs (or none).
      if (idFor && out._id === undefined && !prevByKey.has(_k)) out._id = idFor(_k);
      for (const k of fields) if (k in out || k in prevRow) out[k] = keep(lookup(prevRow[k]), out[k]);
      return out;
    });
}

/**
 * Builds the Firestore document. `prev` is the stored document (or null for a
 * new project). Everything not edited here is carried over from `prev`.
 */
export function buildPayload(prev, f, { projectId, now = new Date().toISOString() }) {
  const isEdit = Boolean(prev);
  const { id: _docId, ...base } = prev || {};
  const out = { ...base };

  out.title = keep(lookup(base.title), f.title);
  out.description = keep(lookup(base.description), f.description);
  out.githubLink = keep(lookup(base.githubLink), f.githubLink);
  out.startDate = dateField(base.startDate, f.startDate);
  out.endDate = dateField(base.endDate, f.endDate);
  const datesSame = isoDay(base.startDate) === f.startDate && isoDay(base.endDate) === f.endDate;
  out.durration = isEdit && datesSame && base.durration !== undefined ? base.durration : f.endDate ? "completed" : "ongoing";
  out.highlighted = f.highlighted ? "star" : "basic";
  if (f.hidden) out.hidden = true;
  else if ("hidden" in base) out.hidden = false;
  out.tags = [...f.tags];

  /* case study */
  const pcs = base.caseStudy;
  const cs = { ...(pcs || {}) };
  cs.kind = f.kind || "client";
  const known = ["web", "data"];
  const selected = known.filter((k) => f[k]);
  const services = (pcs?.services || []).filter((s) => !known.includes(s) || selected.includes(s));
  selected.forEach((s) => !services.includes(s) && services.push(s));
  cs.services = services;
  for (const k of ["client", "role", "status", "liveUrl", "summary", "challenge", "solution", "outcome"]) {
    const cur = keep(lookup(pcs?.[k]), f[k]);
    if (cur !== "" || (pcs && k in pcs)) cs[k] = cur;
  }
  const results = f.results
    .map((r) => ({ ...r, value: keep(lookup(...(pcs?.results || []).map((x) => x?.value)), r.value), label: keep(lookup(...(pcs?.results || []).map((x) => x?.label)), r.label) }))
    .filter((r) => r.value && r.label);
  const features = f.features.map((x) => keep(lookup(...(pcs?.features || [])), x)).filter(Boolean);
  if (results.length || (pcs && "results" in pcs)) cs.results = results;
  if (features.length || (pcs && "features" in pcs)) cs.features = features;
  const csEmpty =
    !pcs && cs.kind === "client" && !services.length && !results.length && !features.length &&
    ["client", "role", "status", "liveUrl", "summary", "challenge", "solution", "outcome"].every((k) => !cs[k]);
  if (!csEmpty) out.caseStudy = cs;

  /* French */
  const pfr = base.fr;
  const fr = { ...(pfr || {}) };
  const frText = (k, key) => keep(lookup(pfr?.[key]), f[k]);
  const setOrDelete = (obj, key, val) => (val ? (obj[key] = val) : delete obj[key]);
  setOrDelete(fr, "title", frText("fr_title", "title"));
  setOrDelete(fr, "description", frText("fr_description", "description"));
  const pfrCs = pfr?.caseStudy || {};
  const frCs = { ...pfrCs };
  for (const k of ["client", "role", "status", "summary", "challenge", "solution", "outcome"]) {
    setOrDelete(frCs, k, keep(lookup(pfrCs[k]), f[`fr_${k}`]));
  }
  const frResults = f.fr_results
    .map((r) => ({ ...r, value: keep(lookup(...(pfrCs.results || []).map((x) => x?.value)), r.value), label: keep(lookup(...(pfrCs.results || []).map((x) => x?.label)), r.label) }))
    .filter((r) => r.value && r.label);
  const frFeatures = f.fr_features.map((x) => keep(lookup(...(pfrCs.features || [])), x)).filter(Boolean);
  if (frResults.length) frCs.results = frResults; else delete frCs.results;
  if (frFeatures.length) frCs.features = frFeatures; else delete frCs.features;
  fr.caseStudy = frCs;
  // Captions aligned with carouselImages by index.
  const prevTitles = Array.isArray(pfr?.carouselTitles) ? pfr.carouselTitles : null;
  const titles = f.carousel.map((c) => String(c.frTitle || "").trim());
  const sameImages =
    prevTitles && (base.carouselImages || []).length === f.carousel.length &&
    (base.carouselImages || []).every((img, i) => shotKey(img, i) === f.carousel[i].id);
  const minLen = sameImages ? prevTitles.length : 0;
  while (titles.length > minLen && titles[titles.length - 1] === "") titles.pop();
  if (prevTitles || titles.some(Boolean)) {
    // keep stored caption text untouched when only whitespace differs
    fr.carouselTitles = titles.map((t, i) => (sameImages && typeof prevTitles[i] === "string" && prevTitles[i].trim() === t ? prevTitles[i] : t));
  }
  if (pfr || Object.keys(fr).some((k) => k !== "caseStudy") || Object.keys(frCs).length) out.fr = fr;

  /* search engines: only what was typed is stored; stored extras are kept */
  const pseo = base.seo && typeof base.seo === "object" && !Array.isArray(base.seo) ? base.seo : null;
  const seo = { ...(pseo || {}) };
  for (const l of SEO_LANGS) {
    const prevL = pseo?.[l] && typeof pseo[l] === "object" ? pseo[l] : {};
    const cur = { ...prevL };
    for (const k of SEO_FIELDS) {
      const v = keep(lookup(prevL[k]), f[seoKey(l, k)]);
      if (v) cur[k] = v; else delete cur[k];
    }
    if (Object.keys(cur).length) seo[l] = cur; else delete seo[l];
  }
  if (Object.keys(seo).length) out.seo = seo; else delete out.seo;

  /* tools and extras */
  const tools = { ...(base.tools || {}) };
  const idMaker = (suffix) => (k) => `${projectId}${String(k).replace(/\W/g, "")}${suffix}`;
  tools.techs = cleanRows("techs", f.techs, base.tools?.techs, ["title", "description"], idMaker("t"));
  tools.resources = cleanRows("resources", f.resources, base.tools?.resources, ["title", "description"], idMaker("r"));
  out.tools = tools;
  out.codeSamples = cleanRows("codeSamples", f.codeSamples, base.codeSamples, ["title", "language", "code"]);
  out.dataSources = cleanRows("dataSources", f.dataSources, base.dataSources, ["type", "name", "size", "link"]);

  /* media */
  out.image = f.cover || base.image || "";
  const prevShots = new Map((base.carouselImages || []).map((c, i) => [shotKey(c, i), c]));
  out.carouselImages = f.carousel.map((c) => {
    const p = prevShots.get(c.id) || {};
    return { ...p, ...(c.extra || {}), _id: c.origId !== undefined ? c.origId : c.id, img: c.img, title: keep(lookup(p.title), c.title) };
  });

  /* bookkeeping */
  if (!isEdit || base._id !== undefined) out._id = base._id ?? projectId;
  out.showInOverview = isEdit ? (base.showInOverview ?? false) : false;
  out.createdAt = isEdit ? (base.createdAt ?? now) : now;
  if (!isEdit) out.__v = 0;
  out.updatedAt = now;
  return stripUndefined(out);
}

/** Site paths of every image a document uses. */
export const imagePaths = (doc) =>
  [doc?.image, ...(doc?.carouselImages || []).map((c) => c?.img)].filter((p) => typeof p === "string" && p.startsWith("/"));

/* ---- Validation and progress ----------------------------------------- */

/** How many search-engine fields the owner filled in (0 to 6). */
export const seoFilled = (f) => SEO_KEYS.filter((k) => String(f[k] || "").trim()).length;

export const frenchFilled = (f) =>
  FR_FIELDS.filter((k) => (Array.isArray(f[k]) ? f[k].some((x) => String(x?.value ?? x ?? "").trim()) : String(f[k] || "").trim())).length;

const REQUIRED = {
  techs: { label: "Technology", need: ["title"], user: ["title", "description"] },
  resources: { label: "Resource", need: ["title"], user: ["title", "description"] },
  codeSamples: { label: "Code sample", need: ["title", "code"], user: ["title", "code"] },
  dataSources: { label: "Data source", need: ["name"], user: ["name", "size", "link"] },
};

/** Problems keyed by step id: { [stepId]: [{ field?, message }] }. */
export function validate(f, { coverBusy = false } = {}) {
  const out = { basics: [], story: [], facts: [], french: [], media: [], tech: [] };
  if (!f.title.trim()) out.basics.push({ field: "title", message: "Title is required." });
  if (!f.description.trim()) out.basics.push({ field: "description", message: "Short description is required." });
  if (f.startDate && f.endDate && f.endDate < f.startDate)
    out.basics.push({ field: "endDate", message: "End date is before the start date." });
  const urlOk = (u) => !u.trim() || /^https?:\/\//i.test(u.trim());
  if (!urlOk(f.liveUrl)) out.facts.push({ field: "liveUrl", message: "Live site must start with https://" });
  f.results.forEach((r, i) => {
    const hasV = r.value.trim();
    const hasL = r.label.trim();
    if ((hasV || hasL) && !(hasV && hasL)) out.facts.push({ field: `result-${i}`, message: `Key number ${i + 1} needs both a value and a label.` });
  });
  if (!f.cover && !coverBusy) out.media.push({ field: "cover", message: "Add a cover image to publish the project." });
  f.carousel.forEach((c, i) => {
    if (c.uploading) out.media.push({ field: `shot-${c.id}`, message: `Screenshot ${i + 1} is still uploading.` });
    else if (!c.title.trim()) out.media.push({ field: `shot-${c.id}`, message: `Screenshot ${i + 1} needs a caption.` });
  });
  if (coverBusy) out.media.push({ field: "cover", message: "The cover image is still uploading." });
  for (const [name, spec] of Object.entries(REQUIRED)) {
    f[name].forEach((r, i) => {
      if (rowHasContent(r, spec.user) && spec.need.some((k) => !String(r[k] ?? "").trim())) {
        out.tech.push({ field: `${name}-${i}`, message: `${spec.label} ${i + 1} is missing: ${spec.need.filter((k) => !String(r[k] ?? "").trim()).join(", ")}.` });
      }
    });
  }
  return out;
}

export const countProblems = (errs) => Object.values(errs).reduce((n, list) => n + list.length, 0);
export const fieldError = (list, field) => list?.find((e) => e.field === field)?.message;

/** Rough progress figure stored in the draft metadata. */
export function progress(f) {
  const checks = [
    f.title, f.description, f.startDate, f.summary, f.challenge, f.solution, f.outcome,
    f.client, f.role, f.status, f.cover, f.carousel.length, f.tags.length, f.results.length, f.features.length,
  ];
  // search-engine fields are optional and deliberately not counted
  return { filled: checks.filter((x) => (typeof x === "string" ? x.trim() : x)).length, total: checks.length };
}
