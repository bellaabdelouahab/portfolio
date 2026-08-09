import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../shared/lib/firebase";

/* Shared between the loading skeleton and the real grid so the two can never
   drift out of alignment — a skeleton at a different column width is worse than
   no skeleton at all. */
const PANEL = "w-full rounded-md border border-line bg-surface-raised p-2.5";
const FEATURED_ROW = "grid w-full grid-cols-3 gap-2.5";
const PROJECT_GRID = "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5";

/* Cards: the featured slots and the pickable grid differ only in alignment and
   the minimum height a drop target needs. */
const CARD =
  "flex flex-col rounded-md border border-line bg-surface p-2 text-center transition duration-200 ease-standard hover:border-success/60 hover:shadow-md";

const githubDetails = {
  owner: "bellaabdelouahab",
  repo: "portfolio",
  branch: "master",
  baseImagePath: "public/images/projects/",
  get token() {
    return localStorage.getItem("githubToken") || "";
  },
};

export default function ManageProjects({ onEditProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setProjects(projectsList);

      // Restore previously featured order, if any
      const featured = projectsList
        .filter((p) => p.showInOverview)
        .sort((a, b) => (a.overviewOrder ?? 0) - (b.overviewOrder ?? 0));
      setSelectedProjects(featured.slice(0, 3));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const numColumns = Math.max(1, Math.ceil(projects.length / 3));

  /* ---------- Featured selection ---------- */
  const toggleSelect = (project) => {
    if (selectedProjects.some((p) => p.id === project.id)) {
      setSelectedProjects(selectedProjects.filter((p) => p.id !== project.id));
    } else {
      if (selectedProjects.length === 3) return;
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  /* ---------- Drag & drop reorder of the 3 featured slots ---------- */
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...selectedProjects];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setSelectedProjects(next);
    setDragIndex(null);
  };

  /* ---------- Validate / save order ---------- */
  const handleValidate = async () => {
    try {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);

      await Promise.all(
        projectsSnapshot.docs.map((docSnapshot) =>
          updateDoc(doc(db, "projects", docSnapshot.id), {
            showInOverview: false,
            overviewOrder: null,
          }),
        ),
      );

      await Promise.all(
        selectedProjects.map((project, index) =>
          updateDoc(doc(db, "projects", project.id), {
            showInOverview: true,
            overviewOrder: index,
          }),
        ),
      );

      alert("Featured projects updated successfully!");
    } catch (error) {
      console.error("Error updating featured projects:", error);
      alert("Failed to update featured projects. See console for details.");
    }
  };

  /* ---------- Edit ---------- */
  const handleEdit = (e, project) => {
    e.stopPropagation();
    onEditProject?.(project);
  };

  /* ---------- Delete (Firestore + GitHub assets) ---------- */
  const listRepoFolder = async (path) => {
    const res = await fetch(
      `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${path}?ref=${githubDetails.branch}`,
      {
        headers: {
          Authorization: `token ${githubDetails.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Failed to list ${path}`);
    return res.json(); // array of {name, path, sha, type}
  };

  const deleteRepoFile = async (path, sha) => {
    const res = await fetch(
      `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${path}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${githubDetails.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete asset: ${path}`,
          sha,
          branch: githubDetails.branch,
        }),
      },
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Failed to delete ${path}`);
    }
  };

  const deleteProjectAssets = async (projectId) => {
    const basePath = `${githubDetails.baseImagePath}${projectId}`;

    // Carousel subfolder first
    const carouselFiles = await listRepoFolder(`${basePath}/carousel`);
    for (const file of carouselFiles) {
      if (file.type === "file") await deleteRepoFile(file.path, file.sha);
    }

    // Then root-level files in the project's folder
    const rootFiles = await listRepoFolder(basePath);
    for (const file of rootFiles) {
      if (file.type === "file") await deleteRepoFile(file.path, file.sha);
    }
  };

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    if (!githubDetails.token) {
      alert("GitHub token missing — verify it on the project form first.");
      return;
    }
    if (
      !window.confirm(
        `Delete "${project.title}"? This removes it from Firestore and GitHub, and cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(project.id);
    try {
      await deleteProjectAssets(project.id);
      await deleteDoc(doc(db, "projects", project.id));

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setSelectedProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(`Failed to delete project: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------- Loading skeleton ---------- */
if (loading) {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center gap-5 rounded-md border border-line bg-surface p-4 text-ink shadow-md">
      {/* These four classes had no rules at all before — the skeleton rendered as
          invisible zero-height divs. They now mirror the real layout. */}
      <div className={`${FEATURED_ROW} ${PANEL}`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
      <div className={PANEL}>
        <div className={PROJECT_GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-md bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center gap-5 rounded-md border border-line bg-surface p-4 text-ink shadow-md">
      <div className={`${FEATURED_ROW} ${PANEL}`}>
        {selectedProjects.map((project, index) => (
          <div
            key={project.id}
            className={`${CARD} min-h-40 cursor-grab items-center hover:-translate-y-1`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onClick={() => toggleSelect(project)}
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="block h-25 w-full rounded-sm object-cover"
              />
            )}
            <h3 className="mt-1 line-clamp-2 text-xs leading-snug text-ink-strong">
              {project.title}
            </h3>
          </div>
        ))}
        {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`${CARD} min-h-40 cursor-default items-center justify-center border-dashed text-xs leading-normal text-ink-muted hover:border-line hover:shadow-none`}
          >
            <span>Select a project below</span>
          </div>
        ))}
      </div>

      {/* Arbitrary variants rather than a leftover stylesheet: ::-webkit-scrollbar
          has no utility of its own, but it can still be reached from the class. */}
      <div
        className={`${PANEL} max-h-120 overflow-y-auto [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-track]:bg-page [&::-webkit-scrollbar]:w-2`}
      >
        <div className={PROJECT_GRID}>
          {projects.map((project) => {
            const isSelected = selectedProjects.some((p) => p.id === project.id);
            return (
              <div
                key={project.id}
                className={[
                  CARD,
                  "cursor-pointer hover:-translate-y-0.75",
                  isSelected ? "border-success ring-2 ring-success/40" : "",
                ].join(" ")}
                onClick={() => toggleSelect(project)}
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="block h-25 w-full rounded-sm object-cover"
                  />
                )}
                <h3 className="mt-1 line-clamp-2 text-xs leading-snug text-ink-strong">
                  {project.title}
                </h3>
                <div className="mt-1.5 flex gap-1.5">
                  {/* Edit is the quiet one and delete carries the only colour —
                      two equally loud buttons 6px apart is how you delete the
                      wrong project. */}
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-sm border border-line p-1 text-xs font-medium text-ink transition-colors duration-200 hover:bg-surface-raised hover:text-ink-strong"
                    onClick={(e) => handleEdit(e, project)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-sm border border-danger/40 p-1 text-xs font-medium text-danger transition-colors duration-200 hover:bg-danger/15 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={(e) => handleDelete(e, project)}
                    disabled={deletingId === project.id}
                  >
                    {deletingId === project.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* tracking needs the bang: global.css sets button{letter-spacing:1px}
          unlayered, which outranks any layered utility. */}
      <button
        className="w-full max-w-75 cursor-pointer rounded-md bg-success px-5 py-2.5 font-semibold tracking-[0.5px]! text-page transition-colors duration-200 ease-standard hover:bg-success/90"
        onClick={handleValidate}
      >
        Validate
      </button>
    </div>
  );
}
