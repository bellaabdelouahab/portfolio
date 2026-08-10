import { useState, useEffect } from "react";
import CarouselForm from "./components/carousel-form/CarouselForm";
import CodeSampleForm from "./components/code-sample-form/CodeSampleForm";
import TechsForm from "./components/techs-form/TechsForm";
import ResourcesForm from "./components/resources_form/ResourceForm";
import DataSourcesForm from "./components/data-sources-form/DataSourcesForm";
import TagInput from "./components/tag-input/TagInput";

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../shared/lib/firebase";
import { v4 as uuidv4 } from "uuid";

import {
  InputComponent,
  FileInputComponent,
  ToggleComponent,
  ProjectDataComponent,
  TextareaComponent,
} from "./components/IndexForm";
import GithubTokenInput from "./components/GithubInput/GithubTokenInput";
import * as s from "./components/formStyles";

export default function ProjectForm({ initialProject = null, onDoneEditing }) {
  const isEditMode = Boolean(initialProject);

  const [popupWindow, setPopupWindow] = useState(null);
  const [codeSamples, setCodeSamples] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]); // unified: {id, title, file, existingPath}
  const [removedCarouselPaths, setRemovedCarouselPaths] = useState([]); // site-relative paths deleted by user
  const [techs, setTechs] = useState([]);
  const [resources, setResources] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [tags, setTags] = useState([]);
  const [submitButtonText, setSubmitButtonText] = useState("Submit Project");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubTokenReady, setGithubTokenReady] = useState(
    localStorage.getItem("githubToken") ? true : false,
  );

  const [commitStatus, setCommitStatus] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  const [existingImage, setExistingImage] = useState(null);

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
    setCarouselItems(
      (initialProject.carouselImages || []).map((img) => ({
        id:
          img._id ||
          (crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`),
        title: img.title,
        file: null,
        existingPath: img.img,
      })),
    );
    setRemovedCarouselPaths([]);
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

  // shaHint optional — if omitted, the sha is fetched from GitHub before deleting.
  const deleteFileFromGithub = async (
    filePath,
    commitMessage,
    shaHint = null,
  ) => {
    try {
      let sha = shaHint;
      if (!sha) {
        const getRes = await fetch(
          `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}?ref=${githubDetails.branch}`,
          {
            headers: {
              Authorization: `token ${githubDetails.token}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        );
        if (getRes.status !== 200) {
          console.warn(
            `Could not find ${filePath} to delete (maybe already gone)`,
          );
          return;
        }
        sha = (await getRes.json()).sha;
      }
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
      if (!res.ok) console.error(`Delete failed for ${filePath}`);
    } catch (err) {
      console.error(`Delete failed for ${filePath}:`, err);
    }
  };

  const commitProjectImages = async (
    mainImage,
    mainImageName,
    carouselUploadPlan,
    projectId,
  ) => {
    setIsCommitting(true);
    setCommitStatus("Committing images to GitHub...");
    const basePath = githubDetails.baseImagePath + projectId;
    const carouselPath = `${basePath}/carousel`;
    const committed = []; // {path, sha, forMain?, itemId?}

    try {
      if (mainImage) {
        const mainImagePath = `${basePath}/${mainImageName}`;
        setCommitStatus(`Committing main image: ${mainImageName}`);
        const result = await commitFileToGithub(
          mainImage,
          mainImagePath,
          `Add project main image: ${mainImageName}`,
        );
        committed.push({ ...result, forMain: true });
      }

      for (let i = 0; i < carouselUploadPlan.length; i++) {
        const item = carouselUploadPlan[i];
        const path = `${carouselPath}/${item.newName}`;
        setCommitStatus(
          `Committing carousel image ${i + 1}/${carouselUploadPlan.length}`,
        );
        const result = await commitFileToGithub(
          item.file,
          path,
          `Add project carousel image: ${item.newName}`,
        );
        committed.push({ ...result, itemId: item.id });
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
          `Rollback: ${file.path}`,
          file.sha,
        );
      }
      setIsCommitting(false);
      return { success: false, committed: [], error };
    }
  };

  const resetFormState = (e) => {
    e.target.reset();
    setCodeSamples([]);
    setCarouselItems([]);
    setRemovedCarouselPaths([]);
    setTechs([]);
    setResources([]);
    setDataSources([]);
    setTags([]);
    setExistingImage(null);
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

      // Validate all carousel items needing upload are webp
      const uploadCandidates = carouselItems.filter((item) => item.file);
      for (const item of uploadCandidates) {
        if (item.file.type !== "image/webp") {
          alert(
            `Only .webp images are accepted for carousel image "${item.title}".`,
          );
          setSubmitButtonText(isEditMode ? "Save Changes" : "Submit Project");
          setIsSubmitting(false);
          return;
        }
      }

      const projectId = isEditMode
        ? initialProject.id
        : uuidv4().replace(/-/g, "").substring(0, 24);
      const timestamp = Date.now();

      const uploadPlan = uploadCandidates.map((item, idx) => ({
        ...item,
        newName: `${timestamp}-${idx}.webp`,
      }));

      const hasNewMainImage = mainImage && mainImage.size > 0;
      const mainImageName = hasNewMainImage ? `${timestamp}.webp` : null;

      // STEP 1 — Commit NEW/changed images to GitHub first. Nothing else touched yet.
      setSubmitButtonText("Committing images...");
      const imageResult = await commitProjectImages(
        hasNewMainImage ? mainImage : null,
        mainImageName,
        uploadPlan,
        projectId,
      );
      if (!imageResult.success) {
        setSubmitButtonText("Error: GitHub commit failed — please try again");
        setIsSubmitting(false);
        return;
      }

      // Build final carouselImages array using committed paths for uploaded items,
      // and existing paths for untouched items.
      const finalCarouselImages = carouselItems.map((item) => {
        if (item.file) {
          const committedEntry = imageResult.committed.find(
            (c) => c.itemId === item.id,
          );
          const sitePath = committedEntry.path.replace(/^public/, "");
          return { _id: item.id, img: sitePath, title: item.title };
        }
        return { _id: item.id, img: item.existingPath, title: item.title };
      });

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
        carouselImages: finalCarouselImages,
        createdAt: isEditMode
          ? initialProject.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: isEditMode ? initialProject.__v : 0,
      };

      if (hasNewMainImage) {
        projectData.image = `/images/projects/${projectId}/${mainImageName}`;
      } else if (isEditMode) {
        projectData.image = existingImage;
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
            `Rollback: ${file.path}`,
            file.sha,
          );
        }
        setSubmitButtonText("Error: Save failed — please try again");
        setIsSubmitting(false);
        return;
      }

      // STEP 3 — Firestore succeeded. NOW clean up removed/replaced GitHub assets.
      // Best-effort: failures here don't affect the saved project, just leave orphaned files.
      try {
        for (const path of removedCarouselPaths) {
          await deleteFileFromGithub(
            `public${path}`,
            `Remove carousel image: ${path}`,
          );
        }
        for (const item of carouselItems) {
          if (item.file && item.existingPath) {
            await deleteFileFromGithub(
              `public${item.existingPath}`,
              `Replace carousel image: ${item.existingPath}`,
            );
          }
        }
      } catch (cleanupErr) {
        console.error("Non-blocking cleanup error:", cleanupErr);
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

  const handleCarouselItemRemoved = (item) => {
    if (item.existingPath) {
      setRemovedCarouselPaths((prev) => [...prev, item.existingPath]);
    }
  };

  const forms = [
    <CodeSampleForm
      codeSamples={codeSamples}
      setCodeSamples={setCodeSamples}
      setPopupWindow={setPopupWindow}
    />,
    <CarouselForm
      carouselItems={carouselItems}
      setCarouselItems={setCarouselItems}
      onItemRemoved={handleCarouselItemRemoved}
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
    // The panel was a three-stop translucent gradient over the admin
    // background; flat bg-surface is what the rest of the admin area uses and
    // reads the same at this size.
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto my-5 max-w-4xl rounded-lg border border-success/30 bg-surface px-6 py-6 text-ink shadow-md md:px-8"
    >
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-3xl leading-snug font-bold text-ink-strong">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </h1>
        <p className="text-sm leading-relaxed text-success">
          {isEditMode
            ? "Update the details below, then save."
            : "Add the details, then fill in the sections below."}
        </p>
        {isEditMode && (
          <button
            type="button"
            className={`${s.btnGhost} mt-1`}
            onClick={() => onDoneEditing?.()}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className={s.fieldRow}>
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

      <div className={s.fieldRow}>
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

      <div className="mt-2.5 mb-5">
        <FileInputComponent
          name="image"
          label={existingImage ? "Replace cover image" : "Upload cover image"}
          hint="PNG or JPG, 16:9 aspect ratio recommended"
          required={!isEditMode}
          existingImageUrl={existingImage}
        />
      </div>

      {/* Both of these were 7.5–8px on #6b7280 against the panel — under 3:1 and
          effectively invisible. */}
      <div className="mb-2.5 flex justify-between">
        <span className="text-xs font-bold tracking-[0.05em] text-ink-muted">
          PROJECT CONTENT
        </span>
        <span className="text-xs text-ink-muted">Select what to include</span>
      </div>

      <div className={`${s.fieldRow} grid-cols-3`}>
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
          items={carouselItems}
          setItems={setCarouselItems}
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

      <div className={`${s.fieldRow} grid-cols-3`}>
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
        {/* Third grid cell intentionally empty — grid-cols-3 with two items
            leaves it blank, same as the old unstyled .spacer div did. */}
      </div>

      {popupWindow}

      <ToggleComponent
        name="highlighted"
        label="Highlight this project"
        description="Featured projects appear first on your profile"
        defaultChecked={initialProject?.highlighted === "star"}
      />
      <TagInput tags={tags} setTags={setTags} />
      <GithubTokenInput
        githubDetails={githubDetails}
        onVerified={() => setGithubTokenReady(true)}
      />

      {/* disabled already covers isSubmitting/isCommitting, so the old
          `.submitting` variant (darker bg, forced opacity) was redundant —
          disabled:opacity-70 alone reproduces it. */}
      <button
        type="submit"
        disabled={isSubmitting || isCommitting || !githubTokenReady}
        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-success px-2.5 py-2.5 text-xs font-semibold text-page transition-colors duration-200 ease-standard hover:bg-success/85 disabled:cursor-not-allowed disabled:opacity-70"
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
        // Was a blue "info" state — the same blue this batch removed from the
        // upload icon and submit button elsewhere, so it's neutral here
        // instead of reintroducing a fourth accent for a transient message.
        <div
          className={[
            "mt-4 rounded-md border p-2.5 text-center text-xs leading-relaxed",
            commitStatus.includes("Error")
              ? "border-danger/20 bg-danger/10 text-danger"
              : commitStatus.includes("success")
                ? "border-success/20 bg-success/10 text-success"
                : "border-line bg-surface-raised text-ink",
          ].join(" ")}
        >
          {commitStatus}
          {isCommitting && (
            <span className="ml-2.5 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white align-middle" />
          )}
        </div>
      )}
    </form>
  );
}
