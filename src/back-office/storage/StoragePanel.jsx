import { useCallback, useEffect, useState } from "react";
import { getAssetStatus, requestBackup } from "../lib/assetStore";

const REPO_BRANCH_URL = "https://github.com/bellaabdelouahab/portfolio/tree/uploads";
const STALE_MINUTES = 20;

const size = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const ago = (iso) => {
  if (!iso) return "never";
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} days ago`;
};

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 text-sm last:border-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right text-ink-strong">{children}</dd>
    </div>
  );
}

/**
 * Where uploaded images live and whether the GitHub backup is current. Uploads
 * are stored on the VPS; a cron job on the VPS pushes them to the `uploads`
 * branch of the repository and records the result that is shown here.
 */
export default function StoragePanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await getAssetStatus());
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const backupNow = async () => {
    setBusy(true);
    try {
      await requestBackup();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) return <p className="p-6 text-sm text-danger">Could not read storage status: {error}</p>;
  if (!data) return <p className="p-6 text-sm text-ink">Loading storage status…</p>;

  const { storage, sync, unsynced, requested } = data;
  const lastRunMin = sync?.lastRunAt ? (Date.now() - Date.parse(sync.lastRunAt)) / 60000 : Infinity;
  const stale = lastRunMin > STALE_MINUTES;
  const healthy = sync && sync.ok && !stale;
  const state = !sync ? "Backup job has not run yet" : !sync.ok ? "Last backup failed" : stale ? "Backup job is not running" : unsynced > 0 ? "Waiting for next backup" : "Backed up";

  return (
    <section className="mx-auto max-w-2xl p-5">
      <h2 className="text-xl font-bold text-ink-strong">Asset storage</h2>
      <p className="mt-1 text-sm text-ink">
        Images and files you upload are stored on the VPS and copied to GitHub as a backup.
      </p>

      <div className={`mt-5 rounded-md border p-4 ${healthy && unsynced === 0 ? "border-success/40 bg-success/10" : "border-danger/40 bg-danger/10"}`}>
        <p className="font-bold text-ink-strong">{state}</p>
        {sync?.error && <p className="mt-1 text-xs text-danger">{sync.error}</p>}
      </div>

      <dl className="mt-4 rounded-md border border-line bg-surface px-4">
        <Row label="Stored on the VPS">{storage.files} files, {size(storage.bytes)}</Row>
        <Row label="Not yet backed up">{unsynced} files</Row>
        <Row label="Last backup check">{ago(sync?.lastRunAt)}</Row>
        <Row label="Last push to GitHub">
          {sync?.lastPushAt ? (
            <>
              {ago(sync.lastPushAt)}
              {sync.lastCommit && (
                <a className="ml-2 text-success!" target="_blank" rel="noopener noreferrer" href={`https://github.com/bellaabdelouahab/portfolio/commit/${sync.lastCommit}`}>
                  {sync.lastCommit.slice(0, 7)}
                </a>
              )}
            </>
          ) : "never"}
        </Row>
        <Row label="Backed up on GitHub">{sync?.backedUpFiles ?? 0} files</Row>
        <Row label="Backup location">
          <a className="text-success!" target="_blank" rel="noopener noreferrer" href={REPO_BRANCH_URL}>branch “uploads”</a>
        </Row>
      </dl>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={backupNow}
          disabled={busy || requested}
          className="cursor-pointer rounded-md bg-success px-4 py-2 text-sm font-semibold text-page transition-colors hover:bg-success/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {requested ? "Backup requested, runs within a few minutes" : "Back up now"}
        </button>
        <button type="button" onClick={load} className="cursor-pointer text-sm text-ink hover:text-ink-strong">Refresh</button>
      </div>
      <p className="mt-4 text-xs text-ink-muted">
        The VPS checks every 5 minutes and pushes new files by itself. To restore after a rebuild, run
        <code className="mx-1 rounded bg-surface-raised px-1.5 py-0.5">~/portfolio-sync/restore.sh</code> on the VPS; it also runs
        automatically when the storage volume is empty.
      </p>
    </section>
  );
}
