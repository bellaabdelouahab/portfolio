/** Formatting and status rules shared by the Storage tab and the Overview. */
export const STALE_MINUTES = 20;

export const formatSize = (b = 0) =>
  b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

export function timeAgo(iso) {
  if (!iso) return "never";
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} days ago`;
}

/** Turns the /api/assets/status payload into `{ tone, label, detail }`. */
export function describeBackup(data) {
  const { sync, unsynced = 0 } = data || {};
  const lastRunMin = sync?.lastRunAt ? (Date.now() - Date.parse(sync.lastRunAt)) / 60000 : Infinity;
  const stale = lastRunMin > STALE_MINUTES;
  if (!sync) return { tone: "danger", label: "Backup has not run yet", detail: "The backup job on the VPS has not reported in." };
  if (!sync.ok) return { tone: "danger", label: "Last backup failed", detail: sync.error || "Check the job on the VPS." };
  if (stale) return { tone: "danger", label: "Backup job is not running", detail: `Last check ${timeAgo(sync.lastRunAt)}.` };
  if (unsynced > 0) return { tone: "warning", label: "Waiting for next backup", detail: `${unsynced} file${unsynced === 1 ? "" : "s"} not yet copied.` };
  return { tone: "success", label: "Backed up", detail: `Last check ${timeAgo(sync.lastRunAt)}.` };
}
