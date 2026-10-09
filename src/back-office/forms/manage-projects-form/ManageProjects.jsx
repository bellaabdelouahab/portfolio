import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../shared/lib/firebase";
import { deleteAsset, listAssets } from "../../lib/assetStore";
import { deleteDraft, listDrafts } from "../../lib/draftStore";
import { Page, Button, Input, EmptyState, ConfirmDialog, useToast } from "../../ui";
import HomeBoard from "./HomeBoard";
import DraftsSection from "./DraftsSection";
import { GalleryCard, ListRow } from "./ProjectTiles";
import { GridIcon, ListIcon } from "./icons";
import { BASE_IMAGE_PATH, HOME_SLOTS, deriveSlots, sortKey } from "./projectMeta";

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "client", label: "Client", test: (p) => p.caseStudy?.kind !== "personal" },
  { id: "personal", label: "Personal", test: (p) => p.caseStudy?.kind === "personal" },
  { id: "hidden", label: "Hidden", test: (p) => p.hidden === true },
  { id: "highlighted", label: "Highlighted", test: (p) => p.highlighted === "star" },
];

const VIEW_KEY = "backoffice.projects.view";
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
};

export default function ManageProjects({ onEditProject, onResumeDraft }) {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState(readView);
  const [busyId, setBusyId] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [discarding, setDiscarding] = useState(null);
  const [draftBusy, setDraftBusy] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [overGallery, setOverGallery] = useState(false);

  const projectsRef = useRef(projects);
  projectsRef.current = projects;

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

  /** Drafts are a bonus: any failure (including "Not signed in") just hides the section. */
  const loadDrafts = useCallback(async () => {
    try {
      const list = await listDrafts();
      setDrafts(Array.isArray(list) ? list : []);
    } catch {
      setDrafts([]);
    }
  }, []);

  useEffect(() => {
    load();
    loadDrafts();
    // The Firebase user can arrive after the first render; fetch drafts again then.
    if (!auth) return undefined;
    let first = true;
    return onAuthStateChanged(auth, (user) => {
      if (first) {
        first = false;
        return;
      }
      if (user) loadDrafts();
    });
  }, [loadDrafts]);

  const patchLocal = (id, patch) => setProjects((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  /** Optimistic update of one or more documents; reverts the local copy on failure. */
  const update = async (changes, okMessage) => {
    const before = changes.map((c) => projectsRef.current.find((p) => p.id === c.id));
    changes.forEach((c) => patchLocal(c.id, c.patch));
    try {
      await Promise.all(changes.map((c) => updateDoc(doc(db, "projects", c.id), c.patch)));
      if (okMessage) toast(okMessage);
    } catch (error) {
      console.error("Update failed:", error);
      before.forEach((p, i) => p && patchLocal(p.id, Object.fromEntries(Object.keys(changes[i].patch).map((k) => [k, p[k]]))));
      toast(`Update failed: ${error.message}`, "danger");
    }
  };

  const toggleHidden = (p) => update([{ id: p.id, patch: { hidden: !(p.hidden === true) } }], p.hidden ? "Project is visible again" : "Project hidden");
  const toggleHighlight = (p) =>
    update([{ id: p.id, patch: { highlighted: p.highlighted === "star" ? "basic" : "star" } }], p.highlighted === "star" ? "Highlight removed" : "Project highlighted");

  /* ---- Home page slots ------------------------------------------------ */

  const slots = useMemo(() => deriveSlots(projects), [projects]);
  const slotIndex = useMemo(() => new Map(slots.map((p, i) => [p?.id, i])), [slots]);

  /** Writes only the documents whose home state changes. `next` is an array of 3 project ids or null. */
  const applySlots = (next, okMessage) => {
    const current = projectsRef.current;
    const wasOnHome = new Set(deriveSlots(current).filter(Boolean).map((p) => p.id));
    const changes = [];
    current.forEach((p) => {
      const idx = next.indexOf(p.id);
      const wanted = idx >= 0;
      if (!wanted && !wasOnHome.has(p.id)) return;
      const patch = {};
      if ((p.showInOverview === true) !== wanted) patch.showInOverview = wanted;
      if (wanted && p.overviewOrder !== idx) patch.overviewOrder = idx;
      if (!wanted && p.overviewOrder != null) patch.overviewOrder = null;
      if (Object.keys(patch).length) changes.push({ id: p.id, patch });
    });
    if (changes.length) update(changes, okMessage);
  };

  const currentIds = () => deriveSlots(projectsRef.current).map((p) => p?.id ?? null);
  const find = (id) => projectsRef.current.find((p) => p.id === id);

  const dropToSlot = (index, id) => {
    const p = find(id);
    if (!p) return;
    if (p.hidden === true) return toast("Hidden projects cannot be on the home page. Show it first.", "danger");
    const next = currentIds();
    const from = next.indexOf(id);
    if (from === index) return;
    const occupant = next[index];
    if (from >= 0) {
      next[from] = occupant;
      next[index] = id;
      return applySlots(next, "Home order updated");
    }
    next[index] = id;
    const out = occupant ? find(occupant) : null;
    applySlots(next, out ? `Slot ${index + 1} is now "${p.title}". "${out.title}" is back in the gallery.` : `Added to slot ${index + 1}`);
  };

  const putOnHome = (id) => {
    const next = currentIds();
    if (next.includes(id)) return;
    const free = next.indexOf(null);
    if (free < 0) return toast(`The home page shows ${HOME_SLOTS} projects. Remove one first, or drop onto a slot to replace it.`, "danger");
    next[free] = id;
    applySlots(next, `Added to slot ${free + 1}`);
  };

  const removeFromHome = (id) => {
    const next = currentIds().map((x) => (x === id ? null : x));
    applySlots(next, "Removed from the home page");
  };

  const moveInHome = (id, dir) => {
    const next = currentIds();
    const from = next.indexOf(id);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= HOME_SLOTS) return;
    [next[from], next[to]] = [next[to], next[from]];
    applySlots(next, "Home order updated");
  };

  /* ---- Drag and drop -------------------------------------------------- */

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDragId(id);
  };
  const onDragEnd = () => {
    setDragId(null);
    setOverGallery(false);
  };
  const dragOnHome = dragId != null && slotIndex.has(dragId);

  /* ---- Delete --------------------------------------------------------- */

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

  const discardDraft = async () => {
    const draft = discarding;
    if (!draft) return;
    setDiscarding(null);
    setDraftBusy(draft.id);
    try {
      await deleteDraft(draft.id);
      setDrafts((list) => list.filter((d) => d.id !== draft.id));
      toast("Draft discarded");
    } catch (error) {
      toast(`Could not discard the draft: ${error.message}`, "danger");
    } finally {
      setDraftBusy(null);
    }
  };

  const setViewMode = (mode) => {
    setView(mode);
    try {
      localStorage.setItem(VIEW_KEY, mode);
    } catch {
      /* ignore */
    }
  };

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, projects.filter(f.test).length])), [projects]);
  const projectTitles = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p.title])), [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const test = FILTERS.find((f) => f.id === filter).test;
    return projects
      .filter(test)
      .filter((p) => !q || String(p.title || "").toLowerCase().includes(q) || (p.tags || []).some((t) => String(t).toLowerCase().includes(q)))
      .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  }, [projects, query, filter]);

  const handlers = {
    onEdit: (p) => onEditProject?.(p),
    onToggleHidden: toggleHidden,
    onToggleHighlight: toggleHighlight,
    onDelete: setConfirming,
    onPutHome: putOnHome,
    onRemoveHome: removeFromHome,
    onDragStart,
    onDragEnd,
  };

  const Tile = view === "list" ? ListRow : GalleryCard;

  return (
    <Page
      title="Projects"
      subtitle={loading ? "Loading..." : `${projects.length} total, newest first`}
      actions={<Button size="sm" onClick={() => { load(); loadDrafts(); }} disabled={loading}>Refresh</Button>}
      className="max-w-none!"
    >
      {!loading && !loadError && (
        <div className="sticky -top-4 z-20 -mx-1 -mt-4 mb-4 bg-page px-1 pt-4 pb-2 md:-top-6 md:-mt-5 md:pt-6">
          <HomeBoard
            slots={slots}
            dragId={dragId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropToSlot={(i, id) => { onDragEnd(); dropToSlot(i, id); }}
            onRemove={removeFromHome}
            onMove={moveInHome}
          />
        </div>
      )}

      <DraftsSection
        drafts={drafts}
        projectTitles={projectTitles}
        busyId={draftBusy}
        onContinue={(id) => onResumeDraft?.(id)}
        onDiscard={setDiscarding}
      />

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
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs tracking-normal! transition-colors focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:outline-none ${
                filter === f.id ? "border-success/50 bg-success/10 text-success" : "border-line text-ink hover:border-success/40"
              }`}
            >
              {f.label} <span className="text-ink-muted">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex overflow-hidden rounded-md border border-line" role="group" aria-label="View">
          {[
            { id: "grid", label: "Gallery", Icon: GridIcon },
            { id: "list", label: "List", Icon: ListIcon },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setViewMode(id)}
              className={`flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-xs tracking-normal! transition-colors focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:outline-none ${
                view === id ? "bg-success/10 text-success" : "text-ink hover:bg-surface-raised"
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 min-[1200px]:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-md border border-line bg-surface" />
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
        <div
          onDragOver={(e) => {
            if (!dragOnHome) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (!overGallery) setOverGallery(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setOverGallery(false);
          }}
          onDrop={(e) => {
            if (!dragOnHome) return;
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain") || dragId;
            onDragEnd();
            if (id) removeFromHome(id);
          }}
          className={`relative rounded-md pb-4 transition ${overGallery ? "ring-2 ring-success/60 ring-offset-4 ring-offset-page" : ""}`}
        >
          {dragOnHome && (
            <p className="pointer-events-none mb-3 rounded-md border border-dashed border-success/50 bg-success/5 px-3 py-2 text-center text-xs text-success">
              Drop here to take it off the home page
            </p>
          )}
          <ul className={view === "list" ? "flex flex-col gap-2" : "grid grid-cols-2 gap-3 min-[1200px]:grid-cols-3"}>
            {visible.map((p) => (
              <Tile key={p.id} p={p} homeSlot={(slotIndex.get(p.id) ?? -1) + 1} busy={busyId === p.id} dragging={dragId === p.id} h={handlers} />
            ))}
          </ul>
        </div>
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
      <ConfirmDialog
        open={!!discarding}
        danger
        title="Discard draft"
        message={discarding ? `Discard the draft "${discarding.title || "Untitled project"}"? Your unsaved changes are lost. Images already uploaded for it stay in storage.` : ""}
        confirmLabel="Discard"
        onConfirm={discardDraft}
        onCancel={() => setDiscarding(null)}
      />
    </Page>
  );
}
