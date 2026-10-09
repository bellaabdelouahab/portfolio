import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../shared/lib/firebase";
import { putAsset, deleteAsset } from "../../lib/assetStore";
import { Button, ConfirmDialog, Stepper, useToast, useUnsavedGuard } from "../../ui";
import {
  STEPS, FR_FIELDS, buildPayload, countProblems, formFromProject, imagePaths, mergeForm, newId,
  newProjectId, progress, serializeForm, validate,
} from "./formModel";
import { assetFromSite, captionFromName, coverAssetPath, prepareImage, shotAssetPath, sitePath } from "./images";
import { clock, findDraft, findNewDrafts, removeDraft, timeAgo, useDraftSync } from "./draftSync";
import BasicsStep from "./steps/BasicsStep";
import StoryStep from "./steps/StoryStep";
import FactsStep from "./steps/FactsStep";
import FrenchStep from "./steps/FrenchStep";
import MediaStep from "./steps/MediaStep";
import TechStep from "./steps/TechStep";
import ReviewStep from "./steps/ReviewStep";

const stepIds = STEPS.map((s) => s.id);

/** A step counts as done only when it was visited, has no problem and holds something. */
const hasContent = (id, f) => {
  const any = (...v) => v.some((x) => (Array.isArray(x) ? x.length : String(x || "").trim()));
  switch (id) {
    case "basics": return any(f.title, f.description);
    case "story": return any(f.summary, f.challenge, f.solution, f.outcome);
    case "facts": return any(f.client, f.role, f.status, f.liveUrl, f.results, f.features);
    case "french": return any(f.fr_title, f.fr_description, f.fr_summary, f.fr_challenge, f.fr_client, f.fr_results, f.fr_features);
    case "media": return any(f.cover, f.carousel);
    case "tech": return any(f.tags, f.techs, f.resources, f.codeSamples, f.dataSources, f.githubLink);
    default: return false;
  }
};

/** Best-effort removal of files from the volume; never throws. */
async function deleteSitePaths(paths) {
  for (const p of paths) {
    try {
      await deleteAsset(assetFromSite(p));
    } catch (err) {
      console.error("Could not delete", p, err);
    }
  }
}

function ProjectWizard({ base, restored, onDoneEditing, onSaved }) {
  const isEdit = Boolean(base);
  const { toast } = useToast();

  const initialForm = useMemo(() => formFromProject(base), [base]);
  const initialSnapshot = useMemo(() => JSON.stringify(serializeForm(initialForm)), [initialForm]);

  const [projectId, setProjectId] = useState(() => (isEdit ? base.id : restored?.meta?.projectId || newProjectId()));
  const [form, setForm] = useState(() => (restored?.data?.form ? mergeForm(initialForm, restored.data.form) : initialForm));
  const [uploaded, setUploaded] = useState(() => restored?.data?.uploaded || []);
  const [step, setStep] = useState(() => (stepIds.includes(restored?.data?.step) ? restored.data.step : "basics"));
  // Steps the user has moved away from: only these show their problems.
  const [visited, setVisited] = useState(() => new Set(restored ? stepIds : []));
  const [coverBusy, setCoverBusy] = useState(null);
  const [pickErrors, setPickErrors] = useState([]);
  const [publishing, setPublishing] = useState("");
  const [banner, setBanner] = useState(null); // { draft, others }
  const [checked, setChecked] = useState(Boolean(restored));
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const bodyRef = useRef(null);

  const draftId = isEdit ? `edit-${base.id}` : `new-${projectId}`;
  const set = useCallback((key, val) => setForm((p) => ({ ...p, [key]: val })), []);

  /* ---- Look for an earlier draft when the wizard opens ---- */
  useEffect(() => {
    if (restored) return undefined;
    let alive = true;
    (async () => {
      let found = null;
      let others = 0;
      try {
        if (isEdit) {
          found = await findDraft(`edit-${base.id}`);
        } else {
          const list = await findNewDrafts();
          if (list.length) {
            found = await findDraft(list[0].id);
            others = list.length - 1;
          }
        }
      } catch {
        found = null;
      }
      if (!alive) return;
      if (found?.data?.form) setBanner({ draft: found, others });
      setChecked(true);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyDraft = (d) => {
    setForm(mergeForm(initialForm, d.data.form));
    setUploaded(d.data.uploaded || []);
    if (!isEdit && d.meta?.projectId) setProjectId(d.meta.projectId);
    setStep(stepIds.includes(d.data.step) ? d.data.step : "basics");
    setVisited(new Set(stepIds));
    setBanner(null);
    toast("Draft restored");
  };

  const discardDraft = async () => {
    const d = banner.draft;
    setConfirmDiscard(false);
    setBanner(null);
    const keep = new Set(imagePaths(base));
    await deleteSitePaths((d.data?.uploaded || []).filter((p) => !keep.has(p)));
    await removeDraft(d.id);
    toast("Draft discarded");
  };

  /* ---- Draft autosave ---- */
  const snapshot = useMemo(() => JSON.stringify({ form: serializeForm(form), uploaded }), [form, uploaded]);
  const dirty = JSON.stringify(serializeForm(form)) !== initialSnapshot || uploaded.length > 0;
  const stepRef = useRef(step);
  stepRef.current = step;
  const build = useCallback(() => {
    const serial = serializeForm(form);
    const { filled, total } = progress(form);
    return {
      meta: { title: form.title.trim() || "Untitled project", kind: isEdit ? "edit" : "new", projectId, step: stepRef.current, filled, total },
      data: { form: serial, uploaded, step: stepRef.current },
    };
    // snapshot covers form and uploaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, projectId, isEdit]);
  const sync = useDraftSync({
    draftId,
    enabled: checked && !banner && dirty && !publishing,
    changeKey: snapshot,
    build,
  });
  useUnsavedGuard(dirty && !publishing && sync.unsynced);

  /* ---- Images: converted and uploaded as soon as they are picked ---- */
  const addPickError = (msg) => setPickErrors((l) => [...l, msg].slice(-4));
  const reportUpload = (err, name) => {
    const msg = /signed in/i.test(err.message) ? "Sign in again to upload images." : err.message || `Could not upload "${name}".`;
    addPickError(msg);
    toast(msg, "danger");
  };

  const uploadImage = async (file, pathFor) => {
    const { file: prepared, converted } = await prepareImage(file);
    const assetPath = pathFor(projectId);
    await putAsset(prepared, assetPath);
    const site = sitePath(assetPath);
    setUploaded((u) => [...u, site]);
    return { site, converted };
  };

  const onCover = async (file) => {
    setPickErrors([]);
    const preview = URL.createObjectURL(file);
    setCoverBusy({ preview, name: file.name });
    try {
      const { site, converted } = await uploadImage(file, coverAssetPath);
      set("cover", site);
      if (converted) toast("Converted to WebP and uploaded");
    } catch (err) {
      reportUpload(err, file.name);
    } finally {
      setCoverBusy(null);
      URL.revokeObjectURL(preview);
    }
  };

  const onAddShots = async (files) => {
    setPickErrors([]);
    const images = files.filter((x) => String(x.type).startsWith("image/"));
    files.filter((x) => !String(x.type).startsWith("image/")).forEach((x) => addPickError(`"${x.name}" is not an image.`));
    const items = images.map((file) => ({
      file, id: newId(), title: captionFromName(file.name), frTitle: "", img: "", extra: {}, uploading: true, preview: URL.createObjectURL(file),
    }));
    if (!items.length) return;
    setForm((p) => ({ ...p, carousel: [...p.carousel, ...items.map(({ file, ...it }) => it)] }));
    let converted = 0;
    for (const it of items) {
      try {
        const r = await uploadImage(it.file, shotAssetPath);
        if (r.converted) converted += 1;
        setForm((p) => ({ ...p, carousel: p.carousel.map((c) => (c.id === it.id ? { ...c, img: r.site, uploading: false, preview: undefined } : c)) }));
      } catch (err) {
        reportUpload(err, it.file.name);
        setForm((p) => ({ ...p, carousel: p.carousel.filter((c) => c.id !== it.id) }));
      } finally {
        URL.revokeObjectURL(it.preview);
      }
    }
    if (converted) toast(`${converted} image${converted > 1 ? "s" : ""} converted to WebP`);
  };

  const onReplaceShot = async (id, file) => {
    setPickErrors([]);
    const preview = URL.createObjectURL(file);
    setForm((p) => ({ ...p, carousel: p.carousel.map((c) => (c.id === id ? { ...c, uploading: true, preview } : c)) }));
    try {
      const r = await uploadImage(file, shotAssetPath);
      setForm((p) => ({ ...p, carousel: p.carousel.map((c) => (c.id === id ? { ...c, img: r.site, uploading: false, preview: undefined } : c)) }));
    } catch (err) {
      reportUpload(err, file.name);
      setForm((p) => ({ ...p, carousel: p.carousel.map((c) => (c.id === id ? { ...c, uploading: false, preview: undefined } : c)) }));
    } finally {
      URL.revokeObjectURL(preview);
    }
  };

  /* ---- French helper ---- */
  const copyEnglish = () => {
    setForm((p) => {
      const next = { ...p };
      const empty = (v) => (Array.isArray(v) ? v.every((x) => !String(x?.value ?? x ?? "").trim()) : !String(v || "").trim());
      for (const k of FR_FIELDS) {
        const en = p[k.replace(/^fr_/, "")];
        if (empty(p[k]) && !empty(en)) next[k] = Array.isArray(en) ? en.map((x) => (typeof x === "string" ? x : { ...x })) : en;
      }
      return next;
    });
    toast("English copied into the empty French fields");
  };

  /* ---- Validation and navigation ---- */
  const errors = useMemo(() => validate(form, { coverBusy: !!coverBusy }), [form, coverBusy]);
  const problemCount = countProblems(errors);
  const uploading = form.carousel.filter((c) => c.uploading).length + (coverBusy ? 1 : 0);

  const goto = (id) => {
    setVisited((s) => new Set(s).add(stepRef.current));
    setStep(id);
    bodyRef.current?.scrollIntoView?.({ block: "nearest" });
    setTimeout(() => sync.flush(), 0);
  };
  const index = stepIds.indexOf(step);
  const stepErrors = (id) => (visited.has(id) && id !== "review" ? errors[id] : []);
  const shownProblems = stepIds.reduce((n, id) => n + (id === "review" || visited.has(id) || step === "review" ? errors[id]?.length || 0 : 0), 0);
  const steps = STEPS.map((s) => ({
    ...s,
    done: s.id !== "review" && s.id !== step && visited.has(s.id) && errors[s.id]?.length === 0 && hasContent(s.id, form),
  }));

  /* ---- Publish ---- */
  const publish = async () => {
    if (publishing) return;
    if (uploading > 0) return toast("Images are still uploading. Try again in a moment.", "danger");
    if (problemCount > 0) {
      goto("review");
      return toast("Fix the problems listed on the Review step first", "danger");
    }
    setPublishing("Publishing...");
    const payload = buildPayload(base, serializeForm(form), { projectId });
    try {
      const ref = doc(db, "projects", projectId);
      if (isEdit) await updateDoc(ref, payload);
      else await setDoc(ref, payload);
    } catch (err) {
      console.error("Firestore write failed:", err);
      setPublishing("");
      // Uploaded images stay: the draft still references them.
      return toast("Publishing failed. Your draft is kept; nothing was lost.", "danger");
    }

    // Best effort: old files that are no longer used, and uploads that were replaced or removed.
    const used = new Set(imagePaths(payload));
    const stale = [...new Set([...imagePaths(base), ...uploaded])].filter((p) => !used.has(p));
    await deleteSitePaths(stale);
    await removeDraft(draftId);
    setPublishing("");
    toast(isEdit ? "Project saved" : "Project published");
    if (isEdit) onDoneEditing?.();
    else onSaved();
  };

  const chip = (() => {
    if (publishing) return { text: publishing, tone: "text-ink" };
    if (uploading) return { text: `Uploading ${uploading} image${uploading > 1 ? "s" : ""}...`, tone: "text-ink" };
    if (!checked) return { text: "Checking for a saved draft...", tone: "text-ink-muted" };
    if (banner) return { text: "Autosave paused: choose what to do with the saved draft", tone: "text-ink-muted" };
    switch (sync.status) {
      case "saving": return { text: "Saving...", tone: "text-ink" };
      case "saved": return { text: `Draft saved ${clock(sync.savedAt)}`, tone: "text-success" };
      case "offline": return { text: "Offline: saved on this device only", tone: "text-amber-400" };
      case "dirty": return { text: "Changes will be saved in a moment", tone: "text-ink-muted" };
      default: return { text: dirty ? "Unsaved changes" : "No changes yet", tone: "text-ink-muted" };
    }
  })();

  const bodies = {
    basics: <BasicsStep f={form} set={set} errors={stepErrors("basics")} />,
    story: <StoryStep f={form} set={set} />,
    facts: <FactsStep f={form} set={set} errors={stepErrors("facts")} />,
    french: <FrenchStep f={form} set={set} copyEnglish={copyEnglish} />,
    media: (
      <MediaStep
        f={form}
        set={set}
        coverBusy={coverBusy}
        onCover={onCover}
        onAddShots={onAddShots}
        onReplaceShot={onReplaceShot}
        errors={stepErrors("media")}
        pickErrors={pickErrors}
      />
    ),
    tech: <TechStep f={form} set={set} errors={stepErrors("tech")} />,
    review: <ReviewStep f={form} errors={errors} onJump={goto} isEdit={isEdit} />,
  };

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-normal! text-ink-strong">{isEdit ? "Edit project" : "New project"}</h1>
          <span className="truncate text-sm text-ink-muted">{isEdit ? base.title : "Fill in the steps, then publish on the last one."}</span>
        </div>
        {isEdit && <Button size="sm" variant="ghost" onClick={() => onDoneEditing?.()}>Close (draft stays saved)</Button>}
      </div>

      {banner && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-ink-strong">
          <span>
            {isEdit ? "You have unfinished changes to this project" : `Unfinished draft: ${banner.draft.meta?.title || "Untitled project"}`}
            {" "}(saved {timeAgo(banner.draft.updatedAt)}).
            {banner.others > 0 && (
              <>
                {" "}{banner.others} more draft{banner.others > 1 ? "s" : ""} in the{" "}
                <button type="button" className="cursor-pointer underline" onClick={() => onDoneEditing?.()}>Projects list</button>.
              </>
            )}
          </span>
          <span className="flex gap-2">
            <Button size="sm" variant="primary" onClick={() => applyDraft(banner.draft)}>Continue draft (saved {timeAgo(banner.draft.updatedAt)})</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmDiscard(true)}>Start over (discard draft)</Button>
          </span>
        </div>
      )}

      <div className="mb-2">
        <Stepper steps={steps} current={step} onStep={goto} />
      </div>

      <div ref={bodyRef} className="scroll-mt-2 rounded-md border border-line bg-surface p-3">
        {bodies[step]}
      </div>

      <div className="sticky bottom-0 z-10 mt-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 py-2">
        <div className="min-w-0 text-xs">
          <span className={chip.tone}>{chip.text}</span>
          {shownProblems > 0 && !publishing && <span className="ml-3 text-danger">{shownProblems} problem{shownProblems > 1 ? "s" : ""}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" disabled={index === 0 || !!publishing} onClick={() => goto(stepIds[index - 1])}>Back</Button>
          <Button disabled={index === stepIds.length - 1 || !!publishing} onClick={() => goto(stepIds[index + 1])}>Next</Button>
          <Button variant="primary" loading={!!publishing} onClick={publish}>{isEdit ? "Save changes" : "Publish project"}</Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        danger
        title="Discard this draft?"
        message="The saved text and the images uploaded for this draft are deleted. This cannot be undone."
        confirmLabel="Discard draft"
        onConfirm={discardDraft}
        onCancel={() => setConfirmDiscard(false)}
      />
    </section>
  );
}

/** Loads what the wizard needs when it is opened from a draft in the Projects list. */
function useBoot(resumeDraftId, initialProject) {
  const [state, setState] = useState(() => (resumeDraftId ? { phase: "loading" } : { phase: "ready", base: initialProject, draft: null }));
  useEffect(() => {
    if (!resumeDraftId) return undefined;
    let alive = true;
    (async () => {
      try {
        const draft = await findDraft(resumeDraftId);
        if (!draft?.data?.form) throw new Error("This draft could not be found. It may have been discarded.");
        let base = null;
        if (draft.meta?.kind === "edit") {
          const pid = draft.meta.projectId || resumeDraftId.replace(/^edit-/, "");
          if (initialProject?.id === pid) base = initialProject;
          else {
            const snap = await getDoc(doc(db, "projects", pid));
            if (!snap.exists()) throw new Error("The project this draft belongs to no longer exists.");
            base = { id: snap.id, ...snap.data() };
          }
        }
        if (alive) setState({ phase: "ready", base, draft });
      } catch (err) {
        if (alive) setState({ phase: "error", message: err.message });
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeDraftId]);
  return state;
}

export default function ProjectForm({ initialProject = null, resumeDraftId = null, onDoneEditing }) {
  // Remount after a successful create so the next project starts clean.
  const [generation, setGeneration] = useState(0);
  const boot = useBoot(resumeDraftId, initialProject);

  if (boot.phase === "loading") {
    return <p className="mx-auto max-w-6xl py-10 text-center text-sm text-ink-muted">Loading draft...</p>;
  }
  if (boot.phase === "error") {
    return (
      <div className="mx-auto max-w-lg rounded-md border border-line bg-surface p-5 text-center">
        <p className="text-sm text-danger">{boot.message}</p>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => onDoneEditing?.()}>Back to projects</Button>
        </div>
      </div>
    );
  }
  return (
    <ProjectWizard
      key={`${boot.base?.id || "new"}-${resumeDraftId || ""}-${generation}`}
      base={boot.base}
      restored={boot.draft}
      onDoneEditing={onDoneEditing}
      onSaved={() => setGeneration((g) => g + 1)}
    />
  );
}
