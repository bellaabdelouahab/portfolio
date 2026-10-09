import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import { getAssetStatus } from "../lib/assetStore";
import { describeBackup, formatSize } from "../storage/backupStatus";
import { Badge, Button, Card, Page } from "../ui";

const LIVE_SITE_URL = "https://abdelouahab.xyz";
const PLAUSIBLE_URL = "https://plausible.abdelouahab.xyz/abdelouahab.xyz";

const isPlaceholderLink = (l) => {
  const v = String(l || "").trim();
  return !v || v === "#" || /\btest\b/i.test(v) || v.includes("certificate_example");
};

const readCollection = async (name) => {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const labelOf = (item) => item.title || item.name || item.id;

/** Turns raw documents into counts and the "needs attention" list. */
function summarise({ projects, certificates, clients }) {
  const hiddenProjects = projects.filter((p) => p.hidden === true);
  const clientProjects = projects.filter((p) => (p.caseStudy?.kind || "client") === "client");
  const placeholderCerts = certificates.filter((c) => isPlaceholderLink(c.link));
  const hiddenClients = clients.filter((c) => c.hidden === true);

  const counts = {
    projects: { total: projects.length, visible: projects.length - hiddenProjects.length, hidden: hiddenProjects.length },
    kinds: { client: clientProjects.length, personal: projects.length - clientProjects.length },
    certificates: { total: certificates.length, real: certificates.length - placeholderCerts.length, placeholder: placeholderCerts.length },
    testimonials: { total: clients.length, visible: clients.length - hiddenClients.length, hidden: hiddenClients.length },
  };

  const noFr = projects.filter((p) => !p.fr || Object.keys(p.fr).length === 0);
  const noSummary = projects.filter((p) => !String(p.caseStudy?.summary || "").trim());
  const attention = [];
  const add = (key, items, text, target) => {
    if (items.length) attention.push({ key, count: items.length, text, target, names: items.slice(0, 3).map(labelOf) });
  };
  add("fr", noFr, "projects have no French version", "projects");
  add("summary", noSummary, "projects have no case study summary", "projects");
  add("hidden", hiddenProjects, "projects are hidden from the site", "projects");
  add("certs", placeholderCerts, "certificates have a placeholder link", "certificates");
  if (clients.length === 0) attention.push({ key: "testimonials", count: 0, text: "No testimonials yet", target: "testimonials", names: [] });
  return { counts, attention };
}

function CountCard({ title, value, lines, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-md border border-line bg-surface p-4 text-left transition-colors duration-150 hover:border-success/50 focus-visible:outline-2 focus-visible:outline-success"
    >
      <span className="block text-xs text-ink-muted">{title}</span>
      <span className="mt-1 block text-3xl font-semibold leading-none text-ink-strong">{value}</span>
      <span className="mt-2 block text-xs text-ink">{lines[0]}</span>
      <span className="block text-xs text-ink-muted">{lines[1]}</span>
    </button>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading overview">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-md bg-surface-raised" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-56 rounded-md bg-surface-raised lg:col-span-2" />
        <div className="h-56 rounded-md bg-surface-raised" />
      </div>
    </div>
  );
}

const BACKUP_TONE = { success: "success", warning: "warning", danger: "danger" };

export default function OverviewPanel({ onNavigate }) {
  const [state, setState] = useState({ status: "loading", summary: null, backup: null, backupError: "", error: "" });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const [projects, certificates, clients, backup] = await Promise.all([
        readCollection("projects"),
        readCollection("certificates"),
        readCollection("clients"),
        getAssetStatus().then((data) => ({ data }), (e) => ({ error: e.message })),
      ]);
      setState({
        status: "ready",
        summary: summarise({ projects, certificates, clients }),
        backup: backup.data || null,
        backupError: backup.error || "",
        error: "",
      });
    } catch (e) {
      setState({ status: "error", summary: null, backup: null, backupError: "", error: e.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const go = (tab) => () => onNavigate?.(tab);
  const refresh = (
    <Button size="sm" loading={state.status === "loading" && !!state.summary} onClick={load}>
      Refresh
    </Button>
  );

  if (state.status === "loading" && !state.summary) {
    return <Page title="Overview" subtitle="What needs your attention."><Skeleton /></Page>;
  }

  if (state.status === "error") {
    return (
      <Page title="Overview" actions={refresh}>
        <div role="alert" className="rounded-md border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          Could not load your content: {state.error}
        </div>
      </Page>
    );
  }

  const { counts, attention } = state.summary;
  const backup = state.backup ? describeBackup(state.backup) : null;

  return (
    <Page title="Overview" subtitle="What needs your attention." actions={refresh}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <CountCard
            title="Projects"
            value={counts.projects.total}
            lines={[`${counts.projects.visible} visible, ${counts.projects.hidden} hidden`, `${counts.kinds.client} client, ${counts.kinds.personal} personal`]}
            onClick={go("projects")}
          />
          <CountCard
            title="Certificates"
            value={counts.certificates.total}
            lines={[`${counts.certificates.real} with a credential link`, `${counts.certificates.placeholder} without`]}
            onClick={go("certificates")}
          />
          <CountCard
            title="Testimonials"
            value={counts.testimonials.total}
            lines={[`${counts.testimonials.visible} visible`, `${counts.testimonials.hidden} hidden`]}
            onClick={go("testimonials")}
          />
          <CountCard
            title="Backup"
            value={backup ? backup.label : "Unknown"}
            lines={state.backup ? [`${state.backup.storage?.files ?? 0} files, ${formatSize(state.backup.storage?.bytes)}`, backup.detail] : ["Status unavailable", state.backupError]}
            onClick={go("storage")}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            className="lg:col-span-2"
            title="Needs attention"
            description={attention.length ? `${attention.length} thing${attention.length === 1 ? "" : "s"} to look at` : undefined}
            bodyClassName="p-0"
          >
            {attention.length === 0 ? (
              <p className="p-4 text-sm text-ink">Everything looks complete. Nothing needs attention.</p>
            ) : (
              <ul className="divide-y divide-line">
                {attention.map((a) => (
                  <li key={a.key}>
                    <button
                      type="button"
                      onClick={go(a.target)}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-success"
                    >
                      {a.count > 0 && <Badge tone="warning">{a.count}</Badge>}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-ink-strong">{a.text}</span>
                        {a.names.length > 0 && (
                          <span className="block truncate text-xs text-ink-muted">
                            {a.names.join(", ")}{a.count > a.names.length ? ", ..." : ""}
                          </span>
                        )}
                      </span>
                      <span aria-hidden="true" className="text-ink-muted">&rsaquo;</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className="space-y-4">
            <Card title="Backup" actions={<Button size="sm" variant="ghost" onClick={go("storage")}>Open</Button>}>
              {backup ? (
                <div className="space-y-1">
                  <Badge tone={BACKUP_TONE[backup.tone]}>{backup.label}</Badge>
                  <p className="text-xs text-ink">{backup.detail}</p>
                </div>
              ) : (
                <p className="text-xs text-danger">Could not read backup status: {state.backupError}</p>
              )}
            </Card>
            <Card title="Quick actions">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="primary" size="sm" onClick={go("project")}>Add a project</Button>
                <Button size="sm" onClick={go("projects")}>Manage projects</Button>
                <Button size="sm" onClick={() => window.open(LIVE_SITE_URL, "_blank", "noopener,noreferrer")}>Open live site</Button>
                <Button size="sm" onClick={() => window.open(PLAUSIBLE_URL, "_blank", "noopener,noreferrer")}>Open Plausible</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
