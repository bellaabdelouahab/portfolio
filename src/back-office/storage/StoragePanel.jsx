import { useCallback, useEffect, useState } from "react";
import { getAssetStatus, requestBackup } from "../lib/assetStore";
import { Badge, Button, Card, Page, useToast } from "../ui";
import { describeBackup, formatSize, timeAgo } from "./backupStatus";

const REPO_BRANCH_URL = "https://github.com/bellaabdelouahab/portfolio/tree/uploads";
const REPO_COMMIT_URL = "https://github.com/bellaabdelouahab/portfolio/commit/";

const BANNER = {
  success: "border-success/40 bg-success/10",
  warning: "border-amber-500/40 bg-amber-500/10",
  danger: "border-danger/40 bg-danger/10",
};

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-md border border-line bg-page/40 px-4 py-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink-strong">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

/**
 * Where uploaded images live and whether the GitHub backup is current. Uploads
 * are stored on the VPS; a cron job on the VPS pushes them to the `uploads`
 * branch of the repository and records the result that is shown here.
 */
export default function StoragePanel() {
  const { toast } = useToast();
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
      toast("Backup requested. It runs within a few minutes.");
      await load();
    } catch (e) {
      toast(`Could not request a backup: ${e.message}`, "danger");
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    await load();
    toast("Status refreshed");
  };

  const actions = (
    <>
      <Button size="sm" onClick={refresh}>Refresh</Button>
      <Button variant="primary" size="sm" loading={busy} disabled={!data || data.requested} onClick={backupNow}>
        {data?.requested ? "Backup requested" : "Back up now"}
      </Button>
    </>
  );

  if (!data) {
    return (
      <Page title="Storage" subtitle="Uploaded images and files, and their GitHub backup.">
        {error ? (
          <div role="alert" className="rounded-md border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
            Could not read storage status: {error}
            <div className="mt-3"><Button size="sm" onClick={load}>Try again</Button></div>
          </div>
        ) : (
          <div className="animate-pulse space-y-3" aria-busy="true">
            <div className="h-16 rounded-md bg-surface-raised" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-md bg-surface-raised" />)}
            </div>
          </div>
        )}
      </Page>
    );
  }

  const { storage, sync, unsynced, requested } = data;
  const status = describeBackup(data);

  return (
    <Page title="Storage" subtitle="Uploaded images and files, and their GitHub backup." actions={actions}>
      <div className="space-y-4">
        {error && <p role="alert" className="text-xs text-danger">Could not refresh: {error}</p>}

        <div className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-4 py-3 ${BANNER[status.tone]}`}>
          <div>
            <p className="text-sm font-semibold text-ink-strong">{status.label}</p>
            <p className="text-xs text-ink">{status.detail}</p>
          </div>
          {requested && <Badge tone="warning">Backup requested</Badge>}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Last backup" value={timeAgo(sync?.lastPushAt)} hint={sync?.lastCommit ? `Commit ${sync.lastCommit.slice(0, 7)}` : "No push yet"} />
          <Stat label="Files on the server" value={storage?.files ?? 0} hint={formatSize(storage?.bytes)} />
          <Stat label="Waiting to be backed up" value={unsynced ?? 0} hint={`${sync?.backedUpFiles ?? 0} already on GitHub`} />
        </div>

        <Card title="What is backed up and where">
          <ul className="space-y-2 text-sm text-ink">
            <li>Images and files you upload here are stored on the site server (the VPS).</li>
            <li>
              A job on the server checks every 5 minutes and copies new files to the{" "}
              <a className="text-success!" target="_blank" rel="noopener noreferrer" href={REPO_BRANCH_URL}>uploads branch on GitHub</a>.
              Nothing is ever deleted from the backup.
            </li>
            <li>
              Last check {timeAgo(sync?.lastRunAt)}.
              {sync?.lastCommit && (
                <>
                  {" "}Latest commit{" "}
                  <a className="text-success!" target="_blank" rel="noopener noreferrer" href={`${REPO_COMMIT_URL}${sync.lastCommit}`}>
                    {sync.lastCommit.slice(0, 7)}
                  </a>.
                </>
              )}
            </li>
            <li className="text-xs text-ink-muted">
              To restore after a rebuild, run <code className="rounded bg-surface-raised px-1.5 py-0.5">~/portfolio-sync/restore.sh</code> on
              the server. It also runs by itself when the storage volume is empty.
            </li>
          </ul>
        </Card>
      </div>
    </Page>
  );
}
