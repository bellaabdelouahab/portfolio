import { useState, useEffect } from "react";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";
import "./ProjectForm.css";
import CarouselForm from "./components/caousel-form/CarouselForm";
import CodeSampleForm from "./components/code-sample-form/CodeSampleForm";
import TechsForm from "./components/techs-form/TechsForm";
import ResourcesForm from "./components/resources_form/ResourceForm";
import DataSourcesForm from "./components/data-sources-form/DataSourcesForm";
import TagInput from "./components/tag-input/TagInput";

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { v4 as uuidv4 } from "uuid";

import {
  InputComponent,
  FileInputComponent,
  ToggleComponent,
  ProjectDataComponent,
  TextareaComponent,
} from "./components/IndexForm";
import GithubTokenInput from "./components/GithubInput/GithubTokenInput";

export default function ProjectForm({ initialProject = null, onDoneEditing }) {
  const isEditMode = Boolean(initialProject);

  const [popupWindow, setPopupWindow] = useState(null);
  const [codeSamples, setCodeSamples] = useState([]);
  const [carouselSamples, setCarouselSamples] = useState([]); // new/changed carousel files only
  const [techs, setTechs] = useState([]);
  const [resources, setResources] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [tags, setTags] = useState([]);
  const [submitButtonText, setSubmitButtonText] = useState("Submit Project");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubTokenReady, setGithubTokenReady] = useState(localStorage.getItem("githubToken") ? true : false);

  const [commitStatus, setCommitStatus] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  // Existing image state (edit mode)
  const [existingImage, setExistingImage] = useState(null); // current main image URL
  const [existingCarouselImages, setExistingCarouselImages] = useState([]); // [{_id, img, title}]
  const [carouselToDelete, setCarouselToDelete] = useState([]); // existing carousel entries user removed

  const githubDetails = {
    owner: "bellaabdelouahab",
    repo: "portfolio",
    branch: "master",
    baseImagePath: "public/images/projects/",
    get token() {
      return localStorage.getItem("githubToken") || "";
    },
  };

  // ---------- Pre-fill on edit ----------
  useEffect(() => {
    if (!initialProject) return;
    setTags(initialProject.tags || []);
    setCodeSamples(initialProject.codeSamples || []);
    setDataSources(initialProject.dataSources || []);
    setTechs(initialProject.tools?.techs || []);
    setResources(initialProject.tools?.resources || []);
    setExistingImage(initialProject.image || null);
    setExistingCarouselImages(initialProject.carouselImages || []);
    setCarouselSamples([]); // reset — only newly added carousel items live here
    setCarouselToDelete([]);
    setSubmitButtonText("Save Changes");
  }, [initialProject]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const commitFileToGithub = async (file, filePath, commitMessage) => {
    if (!file || !githubDetails.token)
      throw new Error("Missing file or GitHub token");
    const base64Content = await getBase64(file);

    let fileSha = null;
    try {
      const checkResponse = await fetch(
        `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}?ref=${githubDetails.branch}`,
        {
          headers: {
            Authorization: `token ${githubDetails.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      if (checkResponse.status === 200)
        fileSha = (await checkResponse.json()).sha;
    } catch (_) {}

    const commitData = {
      message: commitMessage,
      content: base64Content,
      branch: githubDetails.branch,
    };
    if (fileSha) commitData.sha = fileSha;

    const response = await fetch(
      `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubDetails.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commitData),
      },
    );
    const responseData = await response.json();
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`GitHub API Error: ${responseData.message}`);
    }
    return { path: filePath, sha: responseData.content.sha };
  };

  const deleteFileFromGithub = async (filePath, sha, commitMessage) => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `token ${githubDetails.token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: commitMessage,
            sha,
            branch: githubDetails.branch,
          }),
        },
      );
      if (!res.ok) console.error(`Rollback/delete failed for ${filePath}`);
    } catch (err) {
      console.error(`Rollback/delete failed for ${filePath}:`, err);
    }
  };

  const commitProjectImages = async (
    mainImage,
    mainImageName,
    carouselImages,
    carouselImageNames,
    projectId,
  ) => {
    setIsCommitting(true);
    setCommitStatus("Committing images to GitHub...");
    const basePath = githubDetails.baseImagePath + projectId;
    const carouselPath = `${basePath}/carousel`;
    const committed = [];

    try {
      if (mainImage) {
        const mainImagePath = `${basePath}/${mainImageName}`;
        setCommitStatus(`Committing main image: ${mainImageName}`);
        committed.push(
          await commitFileToGithub(
            mainImage,
            mainImagePath,
            `Add project main image: ${mainImageName}`,
          ),
        );
      }
      for (let i = 0; i < carouselImages.length; i++) {
        const item = carouselImages[i];
        if (item.img && item.img[0]) {
          const name = carouselImageNames[i];
          const path = `${carouselPath}/${name}`;
          setCommitStatus(
            `Committing carousel image ${i + 1}/${carouselImages.length}`,
          );
          committed.push(
            await commitFileToGithub(
              item.img[0],
              path,
              `Add project carousel image: ${name}`,
            ),
          );
        }
      }
      setCommitStatus("All images committed!");
      setTimeout(() => {
        setCommitStatus("");
        setIsCommitting(false);
      }, 2000);
      return { success: true, committed };
    } catch (error) {
      setCommitStatus("Error committing images — rolling back...");
      for (const file of committed) {
        await deleteFileFromGithub(
          file.path,
          file.sha,
          `Rollback: ${file.path}`,
        );
      }
      setIsCommitting(false);
      return { success: false, committed: [], error };
    }
  };

  const resetFormState = (e) => {
    e.target.reset();
    setCodeSamples([]);
    setCarouselSamples([]);
    setTechs([]);
    setResources([]);
    setDataSources([]);
    setTags([]);
    setExistingImage(null);
    setExistingCarouselImages([]);
    setCarouselToDelete([]);
    setSubmitButtonText("Submit Project");
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitButtonText(isEditMode ? "Saving..." : "Submitting...");

    try {
      const formData = new FormData(e.target);
      const mainImage = formData.get("image");

      if (mainImage && mainImage.size > 0 && mainImage.type !== "image/webp") {
        alert("Only .webp images are accepted for the main image.");
        setSubmitButtonText(isEditMode ? "Save Changes" : "Submit Project");
        setIsSubmitting(false);
        return;
      }
      if (!githubDetails.token) {
        alert("Please verify your GitHub token before submitting.");
        setSubmitButtonText(isEditMode ? "Save Changes" : "Submit Project");
        setIsSubmitting(false);
        return;
      }

      const projectId = isEditMode
        ? initialProject.id
        : uuidv4().replace(/-/g, "").substring(0, 24);

      const projectData = {
        _id: projectId,
        title: formData.get("title"),
        description: formData.get("description"),
        githubLink: formData.get("githubLink"),
        startDate: formData.get("startDate")
          ? new Date(formData.get("startDate")).toISOString()
          : null,
        endDate: formData.get("endDate")
          ? new Date(formData.get("endDate")).toISOString()
          : null,
        durration: formData.get("endDate") ? "completed" : "ongoing",
        highlighted: formData.get("highlighted") === "on" ? "star" : "basic",
        tags,
        showInOverview: isEditMode
          ? (initialProject.showInOverview ?? false)
          : false,
        codeSamples,
        dataSources,
        tools: {
          techs: techs.map((t, i) => ({
            _id: `${projectId}${i}t`,
            title: t.title,
            description: t.description,
          })),
          resources: resources.map((r, i) => ({
            _id: `${projectId}${i}r`,
            title: r.title,
            description: r.description,
          })),
        },
        carouselImages: [...existingCarouselImages], // start with what's kept from before
        createdAt: isEditMode
          ? initialProject.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: isEditMode ? initialProject.__v : 0,
      };

      const timestamp = Date.now();
      const hasNewMainImage = mainImage && mainImage.size > 0;
      let mainImageName = null;
      if (hasNewMainImage) {
        mainImageName = `${timestamp}.webp`;
        projectData.image = `/images/projects/${projectId}/${mainImageName}`;
      } else if (isEditMode) {
        projectData.image = existingImage; // keep old one untouched
      }

      let carouselImageNames = [];
      for (let i = 0; i < carouselSamples.length; i++) {
        const item = carouselSamples[i];
        if (item.img && item.img[0]) {
          if (item.img[0].type !== "image/webp") {
            alert(
              `Only .webp images are accepted for carousel image ${i + 1}.`,
            );
            setSubmitButtonText(isEditMode ? "Save Changes" : "Submit Project");
            setIsSubmitting(false);
            return;
          }
          const carouselImageName = `${timestamp}-${i}.webp`;
          carouselImageNames.push(carouselImageName);
          projectData.carouselImages.push({
            _id: `${projectId}${i}c-new`,
            img: `/images/projects/${projectId}/carousel/${carouselImageName}`,
            title: item.title,
          });
        }
      }

      // STEP 1 — Commit any NEW images to GitHub first
      setSubmitButtonText("Committing images...");
      const imageResult = await commitProjectImages(
        hasNewMainImage ? mainImage : null,
        mainImageName,
        carouselSamples,
        carouselImageNames,
        projectId,
      );
      if (!imageResult.success) {
        setSubmitButtonText("Error: GitHub commit failed — please try again");
        setIsSubmitting(false);
        return;
      }

      // STEP 1b — delete GitHub assets for removed carousel items / replaced main image
      try {
        if (hasNewMainImage && existingImage) {
          // best-effort: old main image left in place unless you want it removed —
          // uncomment below to delete the old path once you confirm the old filename format.
        }
        for (const removed of carouselToDelete) {
          // removed.img is a site-relative path like /images/projects/{id}/carousel/xyz.webp
          const repoPath = `public${removed.img}`;
          if (removed._ghSha) {
            await deleteFileFromGithub(
              repoPath,
              removed._ghSha,
              `Remove carousel image: ${repoPath}`,
            );
          }
        }
      } catch (cleanupErr) {
        console.error("Non-blocking cleanup error:", cleanupErr);
      }

      // STEP 2 — Firestore write (create or update)
      setSubmitButtonText("Saving to Firebase...");
      try {
        const projectRef = doc(db, "projects", projectId);
        if (isEditMode) {
          await updateDoc(projectRef, projectData);
        } else {
          await setDoc(projectRef, projectData);
        }
      } catch (firestoreError) {
        console.error(
          "Firestore write failed, rolling back new GitHub images:",
          firestoreError,
        );
        setSubmitButtonText("Error: Save failed — rolling back images...");
        for (const file of imageResult.committed) {
          await deleteFileFromGithub(
            file.path,
            file.sha,
            `Rollback: ${file.path}`,
          );
        }
        setSubmitButtonText("Error: Save failed — please try again");
        setIsSubmitting(false);
        return;
      }

      setSubmitButtonText(isEditMode ? "Saved!" : "Successfully Submitted!");
      setTimeout(() => {
        resetFormState(e);
        if (isEditMode) onDoneEditing?.();
      }, 2000);
    } catch (error) {
      console.error("Error submitting project:", error);
      setSubmitButtonText("Error: Please try again");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleInputChange = () => {
      if (!isSubmitting)
        setSubmitButtonText(isEditMode ? "Save Changes" : "Submit Project");
    };
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) =>
      input.addEventListener("input", handleInputChange),
    );
    return () =>
      inputs.forEach((input) =>
        input.removeEventListener("input", handleInputChange),
      );
  }, [isEditMode, isSubmitting]);

  const handleRemoveExistingCarouselItem = (index) => {
    const item = existingCarouselImages[index];
    setCarouselToDelete([...carouselToDelete, item]);
    setExistingCarouselImages(
      existingCarouselImages.filter((_, i) => i !== index),
    );
  };

  const forms = [
    <CodeSampleForm
      codeSamples={codeSamples}
      setCodeSamples={setCodeSamples}
      setPopupWindow={setPopupWindow}
    />,
    <CarouselForm
      carouselSamples={carouselSamples}
      setCarouselSamples={setCarouselSamples}
      setPopupWindow={setPopupWindow}
    />,
    <TechsForm
      techs={techs}
      setTechs={setTechs}
      setPopupWindow={setPopupWindow}
    />,
    <ResourcesForm
      resources={resources}
      setResources={setResources}
      setPopupWindow={setPopupWindow}
    />,
    <DataSourcesForm
      dataSources={dataSources}
      setDataSources={setDataSources}
      setPopupWindow={setPopupWindow}
    />,
  ];

  return (
    <form onSubmit={handleFormSubmit} className="project-form">
      <div className="project-form__header">
        <h1 className="project-form__title">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </h1>
        <p className="project-form__subtitle">
          {isEditMode
            ? "Update the details below, then save."
            : "Add the details, then fill in the sections below."}
        </p>
        {isEditMode && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => onDoneEditing?.()}
            style={{ marginTop: "0.5rem" }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="form-row">
        <InputComponent
          name="title"
          label="Title"
          placeholder="My awesome project"
          defaultValue={initialProject?.title}
        />
        <InputComponent
          name="githubLink"
          label="GitHub Link"
          placeholder="github.com/you/repo"
          defaultValue={initialProject?.githubLink}
        />
      </div>

      <div className="form-row">
        <InputComponent
          type="date"
          name="startDate"
          label="Start Date"
          defaultValue={
            initialProject?.startDate
              ? initialProject.startDate.substring(0, 10)
              : undefined
          }
        />
        <InputComponent
          type="date"
          name="endDate"
          required={false}
          label="End Date"
          defaultValue={
            initialProject?.endDate
              ? initialProject.endDate.substring(0, 10)
              : undefined
          }
        />
      </div>

      <TextareaComponent
        name="description"
        label="Description"
        required
        placeholder="Write a brief description of the project"
        defaultValue={initialProject?.description}
      />

      <div style={{ marginBottom: "2rem", marginTop: "1rem" }}>
        {existingImage && (
          <div style={{ marginBottom: "0.75rem" }}>
            <img
              src={existingImage}
              alt="Current cover"
              style={{
                maxWidth: "220px",
                borderRadius: "8px",
                display: "block",
              }}
            />
            <span className="form__hint">
              Current cover image — upload a new .webp to replace it
            </span>
          </div>
        )}
        <FileInputComponent
          name="image"
          label={existingImage ? "Replace cover image" : "Upload cover image"}
          hint="PNG or JPG, 16:9 aspect ratio recommended"
          required={!isEditMode}
        />
      </div>

      {existingCarouselImages.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="form__hint">
            Existing carousel images (remove to delete on save):
          </span>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            {existingCarouselImages.map((img, i) => (
              <div key={img._id || i} style={{ position: "relative" }}>
                <img
                  src={img.img}
                  alt={img.title}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingCarouselItem(i)}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            color: "#6b7280",
            fontSize: "0.75rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
          }}
        >
          PROJECT CONTENT
        </span>
        <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
          Select what to include
        </span>
      </div>

      <div
        className="form-row"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <ProjectDataComponent
          items={codeSamples}
          setItems={setCodeSamples}
          title="Code Samples"
          description="Snippets that show how it works"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          }
          formComponent={forms[0]}
          setPopupWindow={setPopupWindow}
        />
        <ProjectDataComponent
          items={carouselSamples}
          setItems={setCarouselSamples}
          title="Carousels"
          description="Image sets for screenshots or demos"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          }
          formComponent={forms[1]}
          setPopupWindow={setPopupWindow}
        />
        <ProjectDataComponent
          items={techs}
          setItems={setTechs}
          title="Technologies"
          description="Languages, frameworks, tools used"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          }
          formComponent={forms[2]}
          setPopupWindow={setPopupWindow}
        />
      </div>

      <div
        className="form-row"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <ProjectDataComponent
          items={resources}
          setItems={setResources}
          title="Resources"
          description="Docs, articles, or reference links"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          }
          formComponent={forms[3]}
          setPopupWindow={setPopupWindow}
        />
        <ProjectDataComponent
          items={dataSources}
          setItems={setDataSources}
          title="Data Sources"
          description="Datasets or APIs the project relies on"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          }
          formComponent={forms[4]}
          setPopupWindow={setPopupWindow}
        />
        <div className="spacer"></div>
      </div>

      {popupWindow}

      <ToggleComponent
        name="highlighted"
        label="Highlight this project"
        description="Featured projects appear first on your profile"
        defaultChecked={initialProject?.highlighted === "star"}
      />

      <GithubTokenInput
        githubDetails={githubDetails}
        onVerified={() => setGithubTokenReady(true)}
      />

      <TagInput tags={tags} setTags={setTags} />

      <button
        type="submit"
        disabled={isSubmitting || isCommitting || !githubTokenReady}
        className={`project-form__submit ${isSubmitting || isCommitting ? "submitting" : ""}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {submitButtonText}
      </button>

      {(isCommitting || commitStatus) && (
        <div
          className={`commit-status ${commitStatus.includes("Error") ? "error" : commitStatus.includes("success") ? "success" : "info"}`}
        >
          {commitStatus}
          {isCommitting && <div className="spinner"></div>}
        </div>
      )}
    </form>
  );
}
