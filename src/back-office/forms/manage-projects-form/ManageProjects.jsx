import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../shared/lib/firebase";
import { slugifyProjectTitle } from "../../../shared/lib/projectSlug";
import { deleteAsset, listAssets } from "../../lib/assetStore";
import { Page, Button, Badge, Input, EmptyState, ConfirmDialog, useToast } from "../../ui";

const BASE_IMAGE_PATH = "public/images/projects/";
const MAX_HOME = 3;

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "client", label: "Client", test: (p) => p.caseStudy?.kind !== "personal" },
  { id: "personal", label: "Personal", test: (p) => p.caseStudy?.kind === "personal" },
  { id: "hidden", label: "Hidden", test: (p) => p.hidden === true },
  { id: "highlighted", label: "Highlighted", test: (p) => p.highlighted === "star" },
  { id: "home", label: "On home", test: (p) => p.showInOverview === true },
];

const sortKey = (p) => String(p.startDate || p.createdAt || "");
const formatDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "-";
};

export default function ManageProjects({ onEditProject }) {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [confirming, setConfirming] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      setProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoadError(error.message || "Could not load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patchLocal = (id, patch) => setProjects((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  /** Optimistic update of one or more documents; reverts the local copy on failure. */
  const update = async (changes, okMessage) => {
    const before = changes.map((c) => projects.find((p) => p.id === c.id));
    changes.forEach((c) => patchLocal(c.id, c.patch));
    try {
      await Promise.all(changes.map((c) => updateDoc(doc(db, "projects", c.id), c.patch)));
      toast(okMessage);
    } catch (error) {
      console.error("Update failed:", error);
      before.forEach((p) => p && patchLocal(p.id, Object.fromEntries(Object.keys(changes.find((c) => c.id === p.id).patch).map((k) => [k, p[k]]))));
      toast(`Update failed: ${error.message}`, "danger");
    }
  };

  const toggleHidden = (p) => update([{ id: p.id, patch: { hidden: !(p.hidden === true) } }], p.hidden ? "Project is visible again" : "Project hidden");
  const toggleHighlight = (p) =>
    update([{ id: p.id, patch: { highlighted: p.highlighted === "star" ? "basic" : "star" } }], p.highlighted === "star" ? "Highlight removed" : "Project highlighted");

  const toggleHome = (p) => {
    const featured = projects
      .filter((x) => x.showInOverview === true)
      .sort((a, b) => (a.overviewOrder ?? 0) - (b.overviewOrder ?? 0));
    if (p.showInOverview === true) {
      const rest = featured.filter((x) => x.id !== p.id);
      const changes = [
        { id: p.id, patch: { showInOverview: false, overviewOrder: null } },
        ...rest.map((x, i) => ({ id: x.id, patch: { overviewOrder: i } })).filter((c, i) => rest[i].overviewOrder !== i),
      ];
      return update(changes, "Removed from the home page");
    }
    if (featured.length >= MAX_HOME) return toast(`The home page shows ${MAX_HOME} projects. Remove one first.`, "danger");
    return update([{ id: p.id, patch: { showInOverview: true, overviewOrder: featured.length } }], "Added to the home page");
  };

  /** Removes the project's stored images, then the document. */
  const deleteProject = async () => {
    const project = confirming;
    if (!project) return;
    setConfirming(null);
    setBusyId(project.id);
    try {
      const basePath = `${BASE_IMAGE_PATH}${project.id}`;
      for (const dir of [`${basePath}/carousel`, basePath]) {
        const files = await listAssets(dir);
        for (const file of files) {
          if (file.type === "file") await deleteAsset(file.path);
        }
      }
      await deleteDoc(doc(db, "projects", project.id));
      setProjects((list) => list.filter((p) => p.id !== project.id));
      toast("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast(`Failed to delete project: ${error.message}`, "danger");
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, projects.filter(f.test).length])), [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const test = FILTERS.find((f) => f.id === filter).test;
    return projects
      .filter(test)
      .filter((p) => !q || String(p.title || "").toLowerCase().includes(q) || (p.tags || []).some((t) => String(t).toLowerCase().includes(q)))
      .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  }, [projects, query, filter]);

  return (
    <Page
      title="Projects"
      subtitle={loading ? "Loading..." : `${projects.length} total, newest first`}
      actions={<Button size="sm" onClick={load} disabled={loading}>Refresh</Button>}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or tag" aria-label="Search projects" className="py-1.5!" />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs tracking-normal! transition-colors ${
                filter === f.id ? "border-success/50 bg-success/10 text-success" : "border-line text-ink hover:border-success/40"
              }`}
            >
              {f.label} <span className="text-ink-muted">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md border border-line bg-surface" />
          ))}
        </div>
      ) : loadError ? (
        <EmptyState title="Could not load projects" message={loadError} action={<Button onClick={load}>Try again</Button>} />
      ) : visible.length === 0 ? (
        <EmptyState
          title={projects.length === 0 ? "No projects yet" : "No projects match"}
          message={projects.length === 0 ? "Create one from the Project tab." : "Try another search or filter."}
          action={projects.length > 0 && (query || filter !== "all") ? <Button onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</Button> : undefined}
        />
      ) : (
        <ul className="flex max-h-[calc(100vh-14rem)] flex-col gap-1.5 overflow-y-auto pr-1">
          {visible.map((p) => {
            const cs = p.caseStudy || {};
            const slug = slugifyProjectTitle(p.title);
            const busy = busyId === p.id;
            return (
              <li key={p.id} className={`flex flex-wrap items-center gap-3 rounded-md border border-line bg-surface px-3 py-1.5 ${p.hidden ? "opacity-70" : ""}`}>
                <div className="h-9 w-14 shrink-0 overflow-hidden rounded-sm bg-page">
                  {p.image && <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-ink-strong">{p.title || "Untitled"}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {formatDate(p.startDate || p.createdAt)}
                    {cs.status ? ` - ${cs.status}` : p.durration ? ` - ${p.durration}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:w-56">
                  <Badge>{cs.kind === "personal" ? "Personal" : "Client"}</Badge>
                  {(cs.services || []).map((s) => <Badge key={s}>{s === "data" ? "Data" : "Web"}</Badge>)}
                  {p.hidden === true && <Badge tone="warning">Hidden</Badge>}
                  {p.highlighted === "star" && <Badge tone="success">Highlighted</Badge>}
                  {p.showInOverview === true && <Badge tone="success">Home</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Button size="sm" variant="primary" disabled={busy} onClick={() => onEditProject?.(p)}>Edit</Button>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => toggleHidden(p)}>{p.hidden ? "Show" : "Hide"}</Button>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => toggleHighlight(p)}>{p.highlighted === "star" ? "Unhighlight" : "Highlight"}</Button>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => toggleHome(p)}>{p.showInOverview === true ? "Off home" : "On home"}</Button>
                  <a
                    href={`/projects/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium tracking-normal! text-ink hover:bg-surface-raised hover:text-ink-strong"
                  >
                    View
                  </a>
                  <Button size="sm" variant="danger" loading={busy} disabled={busy} onClick={() => setConfirming(p)}>Delete</Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!confirming}
        danger
        title="Delete project"
        message={confirming ? `Delete "${confirming.title}"? This removes it from Firestore and deletes its stored images. It cannot be undone.` : ""}
        confirmLabel="Delete"
        onConfirm={deleteProject}
        onCancel={() => setConfirming(null)}
      />
    </Page>
  );
}
