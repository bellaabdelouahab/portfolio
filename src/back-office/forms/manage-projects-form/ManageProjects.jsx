import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../shared/lib/firebase";

import "./ManageProjects.css";

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
    <div className="arrange-projects-form mx-auto mt-6 flex w-full max-w-3xl flex-col items-center rounded-lg border border-line bg-surface p-6 shadow-md">
      <div className="skeleton-wrap">
        <div className="skeleton-highlighted-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
        <div className="skeleton-grid-row">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="arrange-projects-form mx-auto mt-6 flex w-full max-w-3xl flex-col items-center rounded-lg border border-line bg-surface p-6 shadow-md">
      <div className="highlighted-projects">
        {selectedProjects.map((project, index) => (
          <div
            key={project.id}
            className="highlighted-project"
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
                className="project-thumb"
              />
            )}
            <h3>{project.title}</h3>
          </div>
        ))}
        {Array.from({ length: 3 - selectedProjects.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="highlighted-project highlighted-project--empty"
          >
            <span>Select a project below</span>
          </div>
        ))}
      </div>

      <div className="scrollable-grid">
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project ${selectedProjects.some((p) => p.id === project.id) ? "project--selected" : ""}`}
              onClick={() => toggleSelect(project)}
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-thumb"
                />
              )}
              <h3>{project.title}</h3>
              <div className="project-actions">
                <button
                  type="button"
                  className="project-action edit"
                  onClick={(e) => handleEdit(e, project)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="project-action delete"
                  onClick={(e) => handleDelete(e, project)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="validate-btn" onClick={handleValidate}>
        Validate
      </button>
    </div>
  );
}
