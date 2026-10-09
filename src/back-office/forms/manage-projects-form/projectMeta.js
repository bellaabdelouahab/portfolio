export const BASE_IMAGE_PATH = "public/images/projects/";
export const HOME_SLOTS = 3;

export const sortKey = (p) => String(p.startDate || p.createdAt || "");

export const formatDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
};

/** "just now", "5 min ago", "3 h ago", "2 days ago", then a date. */
export const relativeTime = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.floor(h / 24);
  if (days < 14) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/**
 * Home slots exactly as the public page reads them: showInOverview === true,
 * not hidden, ordered by overviewOrder. A valid overviewOrder (0..2) keeps its
 * slot; anything else fills the first free slot in order.
 */
export const deriveSlots = (projects) => {
  const out = Array.from({ length: HOME_SLOTS }, () => null);
  const eligible = projects
    .filter((p) => p.showInOverview === true && p.hidden !== true)
    .sort((a, b) => (a.overviewOrder ?? 0) - (b.overviewOrder ?? 0));
  const rest = [];
  eligible.forEach((p) => {
    const o = p.overviewOrder;
    if (Number.isInteger(o) && o >= 0 && o < HOME_SLOTS && !out[o]) out[o] = p;
    else rest.push(p);
  });
  rest.forEach((p) => {
    const i = out.indexOf(null);
    if (i >= 0) out[i] = p;
  });
  return out;
};
