import { useEffect, useMemo, useRef, useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../shared/lib/firebase";
import { putAsset, deleteAsset } from "../../lib/assetStore";
import { Page, Card, Button, Stepper, useToast, useUnsavedGuard } from "../../ui";
import {
  STEPS, valuesFromProject, parseCaseStudy, validate, countProblems,
  readDraft, writeDraft, clearDraft,
} from "./formModel";
import BasicsStep from "./steps/BasicsStep";
import CaseStudyStep from "./steps/CaseStudyStep";
import FrenchStep from "./steps/FrenchStep";
import MediaStep from "./steps/MediaStep";
import StackStep from "./steps/StackStep";
import ReviewStep from "./steps/ReviewStep";

const BASE_IMAGE_PATH = "public/images/projects/";
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const carouselFromProject = (p) =>
  (p?.carouselImages || []).map((img) => ({ id: img._id || newId(), title: img.title || "", file: null, existingPath: img.img }));

/** Everything that can be saved in a draft (no File objects). */
const serialize = (s) => ({
  v: s.v, tags: s.tags, techs: s.techs, resources: s.resources, codeSamples: s.codeSamples, dataSources: s.dataSources,
  carousel: s.carousel.filter((i) => !i.file).map(({ id, title, existingPath }) => ({ id, title, existingPath })),
  removed: s.removed,
});

function ProjectWizard({ initialProject, onDoneEditing, onSaved }) {
  const isEdit = Boolean(initialProject);
  const draftId = initialProject?.id || null;
  const { toast } = useToast();

  const initial = useMemo(
    () => ({
      v: valuesFromProject(initialProject),
      tags: initialProject?.tags || [],
      techs: initialProject?.tools?.techs || [],
      resources: initialProject?.tools?.resources || [],
      codeSamples: initialProject?.codeSamples || [],
      dataSources: initialProject?.dataSources || [],
      carousel: carouselFromProject(initialProject),
      removed: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [v, setV] = useState(initial.v);
  const [tags, setTags] = useState(initial.tags);
  const [techs, setTechs] = useState(initial.techs);
  const [resources, setResources] = useState(initial.resources);
  const [codeSamples, setCodeSamples] = useState(initial.codeSamples);
  const [dataSources, setDataSources] = useState(initial.dataSources);
  const [carousel, setCarousel] = useState(initial.carousel);
  const [removed, setRemoved] = useState(initial.removed);
  const [coverFile, setCoverFile] = useState(null);
  const existingImage = initialProject?.image || null;

  const [step, setStep] = useState("basics");
  const [visited, setVisited] = useState(() => new Set(["basics"]));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [pendingDraft, setPendingDraft] = useState(null);
  const bodyRef = useRef(null);

  const set = (key, val) => setV((prev) => ({ ...prev, [key]: val }));

  const snapshot = useMemo(
    () => JSON.stringify(serialize({ v, tags, techs, resources, codeSamples, dataSources, carousel, removed })),
    [v, tags, techs, resources, codeSamples, dataSources, carousel, removed],
  );
  const initialSnapshot = useMemo(() => JSON.stringify(serialize(initial)), [initial]);
  const dirty = snapshot !== initialSnapshot || !!coverFile || carousel.some((i) => i.file);
  useUnsavedGuard(dirty && !saving);

  // Offer a stored draft once.
  useEffect(() => {
    const d = readDraft(draftId);
    if (d && d.state && JSON.stringify(d.state) !== initialSnapshot) setPendingDraft(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave (debounced) while there are changes and no prompt is pending.
  useEffect(() => {
    if (!dirty || pendingDraft || saving) return undefined;
    const t = setTimeout(() => writeDraft(draftId, { state: JSON.parse(snapshot), step }), 600);
    return () => clearTimeout(t);
  }, [snapshot, dirty, pendingDraft, saving, draftId, step]);

  const restoreDraft = () => {
    const s = pendingDraft.state;
    setV({ ...initial.v, ...s.v });
    setTags(s.tags || []);
    setTechs(s.techs || []);
    setResources(s.resources || []);
    setCodeSamples(s.codeSamples || []);
    setDataSources(s.dataSources || []);
    setCarousel((s.carousel || []).map((i) => ({ ...i, file: null })));
    setRemoved(s.removed || []);
    if (pendingDraft.step) setStep(pendingDraft.step);
    setPendingDraft(null);
    toast("Draft restored");
  };
  const discardDraft = () => {
    clearDraft(draftId);
    setPendingDraft(null);
  };

  const saveDraftNow = () => {
    const ok = writeDraft(draftId, { state: JSON.parse(snapshot), step });
    toast(ok ? "Draft saved on this device" : "Could not save the draft in this browser", ok ? "success" : "danger");
  };

  const errors = useMemo(
    () => validate(v, { coverFile, existingImage, carouselItems: carousel, isEdit }),
    [v, coverFile, existingImage, carousel, isEdit],
  );
  const problemCount = countProblems(errors);

  const goto = (id) => {
    setStep(id);
    setVisited((s) => new Set(s).add(id));
    bodyRef.current?.scrollTo?.(0, 0);
  };
  const index = STEPS.findIndex((s) => s.id === step);
  const showErrors = (id) => visited.has(id) && id !== "review";

  const steps = STEPS.map((s) => ({
    ...s,
    done: s.id === "review" ? false : visited.has(s.id) && errors[s.id]?.length === 0 && s.id !== step,
  }));

  /* ---- Save (same writes as the original form) ---- */
  const save = async () => {
    if (saving) return;
    if (problemCount > 0) {
      goto("review");
      toast("Fix the problems listed on the Review step first", "danger");
      return;
    }
    setSaving(true);
    setStatus("Uploading images...");

    const projectId = isEdit ? initialProject.id : uuidv4().replace(/-/g, "").substring(0, 24);
    const timestamp = Date.now();
    const basePath = `${BASE_IMAGE_PATH}${projectId}`;
    const uploadPlan = carousel.filter((i) => i.file).map((item, idx) => ({ ...item, newName: `${timestamp}-${idx}.webp` }));
    const mainImageName = coverFile ? `${timestamp}.webp` : null;
    const committed = [];
    const rollback = async () => {
      for (const c of committed) {
        try {
          await deleteAsset(c.path);
        } catch (err) {
          console.error("Rollback failed for", c.path, err);
        }
      }
    };

    // Step 1: upload new images first; nothing else is touched yet.
    try {
      if (coverFile) {
        setStatus(`Uploading cover: ${mainImageName}`);
        committed.push({ ...(await putAsset(coverFile, `${basePath}/${mainImageName}`)), forMain: true });
      }
      for (let i = 0; i < uploadPlan.length; i++) {
        const item = uploadPlan[i];
        setStatus(`Uploading screenshot ${i + 1} of ${uploadPlan.length}`);
        committed.push({ ...(await putAsset(item.file, `${basePath}/carousel/${item.newName}`)), itemId: item.id });
      }
    } catch (err) {
      console.error("Image upload failed, rolling back:", err);
      setStatus("Upload failed, rolling back...");
      await rollback();
      setStatus("");
      setSaving(false);
      toast("Image upload failed. Nothing was saved.", "danger");
      return;
    }

    const finalCarousel = carousel.map((item) => {
      if (item.file) {
        const entry = committed.find((c) => c.itemId === item.id);
        return { _id: item.id, img: entry.path.replace(/^public/, ""), title: item.title.trim() };
      }
      return { _id: item.id, img: item.existingPath, title: item.title.trim() };
    });

    const { id: _ignoredId, ...prev } = initialProject || {};
    const projectData = {
      ...prev,
      _id: projectId,
      title: v.title.trim(),
      description: v.description.trim(),
      githubLink: v.githubLink.trim(),
      startDate: v.startDate ? new Date(v.startDate).toISOString() : null,
      endDate: v.endDate ? new Date(v.endDate).toISOString() : null,
      durration: v.endDate ? "completed" : "ongoing",
      highlighted: v.highlighted ? "star" : "basic",
      tags,
      ...parseCaseStudy(v, initialProject),
      showInOverview: isEdit ? (initialProject.showInOverview ?? false) : false,
      codeSamples,
      dataSources,
      tools: {
        ...(prev.tools || {}),
        techs: techs.map((t, i) => ({ ...t, _id: `${projectId}${i}t`, title: t.title, description: t.description })),
        resources: resources.map((r, i) => ({ ...r, _id: `${projectId}${i}r`, title: r.title, description: r.description })),
      },
      carouselImages: finalCarousel,
      createdAt: isEdit ? initialProject.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: isEdit ? initialProject.__v : 0,
    };
    if (coverFile) projectData.image = `/images/projects/${projectId}/${mainImageName}`;
    else if (isEdit) projectData.image = existingImage;

    // Step 2: Firestore write. Roll back the new uploads if it fails.
    setStatus("Saving...");
    try {
      const ref = doc(db, "projects", projectId);
      if (isEdit) await updateDoc(ref, projectData);
      else await setDoc(ref, projectData);
    } catch (err) {
      console.error("Firestore write failed, rolling back new images:", err);
      setStatus("Save failed, rolling back images...");
      await rollback();
      setStatus("");
      setSaving(false);
      toast("Save failed. New images were rolled back.", "danger");
      return;
    }

    // Step 3: best-effort cleanup of removed or replaced images.
    try {
      for (const path of removed) await deleteAsset(`public${path}`);
      for (const item of carousel) {
        if (item.file && item.existingPath) await deleteAsset(`public${item.existingPath}`);
      }
    } catch (err) {
      console.error("Non-blocking cleanup error:", err);
    }

    clearDraft(draftId);
    setStatus("");
    setSaving(false);
    toast(isEdit ? "Project saved" : "Project created");
    if (isEdit) onDoneEditing?.();
    else onSaved();
  };

  const counts = {
    screenshots: carousel.length, techs: techs.length, resources: resources.length,
    code: codeSamples.length, data: dataSources.length,
  };

  const body = {
    basics: <BasicsStep v={v} set={set} errors={showErrors("basics") ? errors.basics : []} />,
    case: <CaseStudyStep v={v} set={set} errors={showErrors("case") ? errors.case : []} />,
    french: <FrenchStep v={v} set={set} />,
    media: (
      <MediaStep
        coverFile={coverFile}
        setCoverFile={setCoverFile}
        existingImage={existingImage}
        items={carousel}
        setItems={setCarousel}
        onRemoved={(item) => item.existingPath && setRemoved((r) => [...r, item.existingPath])}
        errors={showErrors("media") ? errors.media : []}
      />
    ),
    stack: (
      <StackStep
        tags={tags} setTags={setTags} techs={techs} setTechs={setTechs} resources={resources} setResources={setResources}
        codeSamples={codeSamples} setCodeSamples={setCodeSamples} dataSources={dataSources} setDataSources={setDataSources}
      />
    ),
    review: (
      <ReviewStep v={v} errors={errors} onJump={goto} coverFile={coverFile} existingImage={existingImage} tags={tags} counts={counts} isEdit={isEdit} />
    ),
  };

  return (
    <Page
      title={isEdit ? "Edit project" : "New project"}
      subtitle={isEdit ? initialProject.title : "Fill in the steps, then save on the last one."}
      actions={isEdit && <Button variant="ghost" onClick={() => onDoneEditing?.()}>Cancel edit</Button>}
    >
      {pendingDraft && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-success/40 bg-success/10 px-4 py-2 text-sm text-ink-strong">
          <span>
            Restore draft? Saved {new Date(pendingDraft.savedAt).toLocaleString()}. Images are not kept in drafts.
          </span>
          <span className="flex gap-2">
            <Button size="sm" variant="primary" onClick={restoreDraft}>Restore</Button>
            <Button size="sm" variant="ghost" onClick={discardDraft}>Discard</Button>
          </span>
        </div>
      )}
      <div className="mb-3">
        <Stepper steps={steps} current={step} onStep={goto} />
      </div>
      <Card className="mb-0" bodyClassName="max-h-[calc(100vh-17rem)] min-h-64 overflow-y-auto" title={STEPS[index].label}>
        <div ref={bodyRef}>{body[step]}</div>
      </Card>

      <div className="sticky bottom-0 z-10 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-surface px-4 py-2.5">
        <div className="min-w-0 text-xs text-ink-muted">
          {status || (dirty ? "Unsaved changes" : "No changes yet")}
          {problemCount > 0 && !status && <span className="ml-2 text-danger">{problemCount} problem(s)</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" disabled={index === 0 || saving} onClick={() => goto(STEPS[index - 1].id)}>Back</Button>
          <Button disabled={index === STEPS.length - 1 || saving} onClick={() => goto(STEPS[index + 1].id)}>Next</Button>
          <Button variant="ghost" disabled={!dirty || saving} onClick={saveDraftNow}>Save draft</Button>
          <Button variant="primary" loading={saving} onClick={save}>{isEdit ? "Save changes" : "Publish project"}</Button>
        </div>
      </div>
    </Page>
  );
}

export default function ProjectForm({ initialProject = null, onDoneEditing }) {
  // Remount on a different project, and after a successful create to start clean.
  const [generation, setGeneration] = useState(0);
  return (
    <ProjectWizard
      key={`${initialProject?.id || "new"}-${generation}`}
      initialProject={initialProject}
      onDoneEditing={onDoneEditing}
      onSaved={() => setGeneration((g) => g + 1)}
    />
  );
}
