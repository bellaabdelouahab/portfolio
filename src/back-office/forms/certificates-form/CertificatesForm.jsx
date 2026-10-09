import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../shared/lib/firebase";
import { toDate } from "../../../shared/lib/dates";
import { deleteAsset, putAsset } from "../../lib/assetStore";
import { Badge, Button, Card, ConfirmDialog, EmptyState, Field, Input, Page, Toggle, useToast, useUnsavedGuard } from "../../ui";

const COLLECTION = "certificates";
const IMAGE_DIR = "public/images/certificates/";
const IMAGE_URL = "/images/certificates/";

/* ---- Helpers ---------------------------------------------------------- */

const titleOf = (c) => c.title || c.certificateTitle || "";
const hasOrder = (c) => typeof c.order === "number" && Number.isFinite(c.order);
const dateOf = (c) => {
  const d = toDate(c.issuedAt || c.createdAt);
  return d.getTime() ? d : null;
};
const formatDate = (c) => {
  const d = dateOf(c);
  if (!d) return "No date";
  return c.issuedAt ? d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }) : String(d.getFullYear());
};
const isHttp = (v) => /^https?:\/\/\S+$/i.test(v);
const isPlaceholder = (v) => /certificate_example|\btest\b/.test(v || "");
const linkIsReal = (c) => isHttp(c.link || "") && !isPlaceholder(c.link);
/** Uploaded images keep the site convention: art lives at `<name>_result.webp`. */
const storedPath = (image) => (image.endsWith(".webp") ? image.replace(/\.webp$/, "_result.webp") : image);
const isoDay = (c) => {
  if (!c.issuedAt) return "";
  const d = toDate(c.issuedAt);
  return d.getTime() ? d.toISOString().slice(0, 10) : "";
};

function sortCertificates(list) {
  return [...list].sort((a, b) => {
    const oa = hasOrder(a);
    const ob = hasOrder(b);
    if (oa && ob && a.order !== b.order) return a.order - b.order;
    if (oa !== ob) return oa ? -1 : 1;
    return (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0);
  });
}

const EMPTY = { title: "", issuer: "", issuedAt: "", link: "", credentialId: "", featured: false, hidden: false };

/* ---- Side panel ------------------------------------------------------- */

function CertificatePanel({ item, nextOrder, onClose, onSaved }) {
  const { toast } = useToast();
  const isNew = !item;
  const initial = useMemo(
    () => (item ? { title: titleOf(item), issuer: item.issuer || "", issuedAt: isoDay(item), link: item.link || "", credentialId: item.credentialId || "", featured: !!item.featured, hidden: !!item.hidden } : EMPTY),
    [item]
  );
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const dirty = !!file || Object.keys(initial).some((k) => initial[k] !== form[k]);
  useUnsavedGuard(dirty);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  };
  const onText = (key) => (e) => set(key)(e.target.value);

  const currentImage = preview || (item?.image ? storedPath(item.image) : "");
  const link = form.link.trim();

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.issuer.trim()) next.issuer = "Issuer is required.";
    if (link && !isHttp(link)) next.link = "Use a full http or https URL.";
    if (isNew && !file) next.image = "Add a certificate image.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    let uploaded = "";
    try {
      let image = item?.image || "";
      let newPath = "";
      if (file) {
        const ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
        const name = uuidv4().replace(/-/g, "").slice(0, 24);
        image = `${IMAGE_URL}${name}.${ext}`;
        newPath = `${IMAGE_DIR}${name}${ext === "webp" ? "_result" : ""}.${ext}`;
        await putAsset(file, newPath);
        uploaded = newPath;
      }

      const values = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        issuedAt: form.issuedAt || "",
        link,
        credentialId: form.credentialId.trim(),
        featured: form.featured,
        hidden: form.hidden,
      };

      if (isNew) {
        const data = { ...values, image, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
        if (nextOrder !== null) data.order = nextOrder;
        const ref = await addDoc(collection(db, COLLECTION), data);
        onSaved({ id: ref.id, ...values, image, createdAt: new Date().toISOString(), ...(nextOrder !== null ? { order: nextOrder } : {}) });
        toast("Certificate added");
      } else {
        const changes = {};
        if (values.title !== titleOf(item)) changes.title = values.title;
        for (const key of ["issuer", "link", "credentialId"]) {
          if (values[key] !== (item[key] || "")) changes[key] = values[key];
        }
        if (values.issuedAt !== isoDay(item)) changes.issuedAt = values.issuedAt;
        if (values.featured !== !!item.featured) changes.featured = values.featured;
        if (values.hidden !== !!item.hidden) changes.hidden = values.hidden;
        if (file) changes.image = image;
        if (Object.keys(changes).length) {
          await updateDoc(doc(db, COLLECTION, item.id), { ...changes, updatedAt: serverTimestamp() });
          if (file && item.image?.startsWith(IMAGE_URL)) {
            deleteAsset(`public${storedPath(item.image)}`).catch(() => {});
          }
        }
        onSaved({ ...item, ...changes });
        toast("Certificate saved");
      }
      onClose();
    } catch (err) {
      if (uploaded) deleteAsset(uploaded).catch(() => {});
      toast(`Could not save: ${err.message}`, "danger");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/60" onClick={() => !saving && onClose()}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? "Add certificate" : "Edit certificate"}
        className="flex h-full w-full max-w-md flex-col border-l border-line bg-surface"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-base font-semibold tracking-normal! text-ink-strong">{isNew ? "Add certificate" : "Edit certificate"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>Close</Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          <Field label="Title" required error={errors.title}>
            <Input value={form.title} onChange={onText("title")} error={!!errors.title} placeholder="IBM Data Analyst Professional Certificate" />
          </Field>
          <Field label="Issuer" required error={errors.issuer}>
            <Input value={form.issuer} onChange={onText("issuer")} error={!!errors.issuer} placeholder="IBM" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issue date">
              <Input type="date" value={form.issuedAt} onChange={onText("issuedAt")} />
            </Field>
            <Field label="Credential ID">
              <Input value={form.credentialId} onChange={onText("credentialId")} />
            </Field>
          </div>
          <Field
            label="Credential URL"
            error={errors.link}
            hint={!errors.link && link && isHttp(link) && isPlaceholder(link) ? "This looks like a placeholder. The public page hides Verify for it." : "Optional. The issuer's verification page."}
          >
            <Input type="url" value={form.link} onChange={onText("link")} error={!!errors.link} placeholder="https://" />
          </Field>

          <Field label="Image" required error={errors.image} hint="PNG, JPG or WEBP.">
            <div className="flex items-center gap-3">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white">
                {currentImage ? <img src={currentImage} alt="" className="size-full object-contain" /> : <span className="text-xs text-ink-muted">None</span>}
              </div>
              <Button onClick={() => fileRef.current?.click()}>{currentImage ? "Replace image" : "Choose image"}</Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { setFile(e.target.files?.[0] || null); setErrors((x) => ({ ...x, image: "" })); }} />
            </div>
          </Field>

          <Toggle checked={form.featured} onChange={set("featured")} label="Featured" hint="Shown in the highlighted block at the top." />
          <Toggle checked={form.hidden} onChange={set("hidden")} label="Hidden" hint="Removed from the public page." />
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" variant="primary" loading={saving} disabled={!isNew && !dirty}>{isNew ? "Add certificate" : "Save changes"}</Button>
        </div>
      </form>
    </div>
  );
}

/* ---- Manager ---------------------------------------------------------- */

export default function CertificatesForm() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState(null); // null | "new" | certificate
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      setItems(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    } catch (err) {
      toast(`Could not load certificates: ${err.message}`, "danger");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(() => sortCertificates(items), [items]);
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? sorted.filter((c) => `${titleOf(c)} ${c.issuer || ""} ${c.credentialId || ""}`.toLowerCase().includes(needle))
    : sorted;

  const nextOrder = useMemo(() => {
    const orders = items.filter(hasOrder).map((c) => c.order);
    return orders.length ? Math.max(...orders) + 10 : null;
  }, [items]);

  const patchLocal = (id, patch) => setItems((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const onSaved = (saved) => {
    setItems((list) => (list.some((c) => c.id === saved.id) ? list.map((c) => (c.id === saved.id ? saved : c)) : [...list, saved]));
  };

  const toggleHidden = async (c) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, COLLECTION, c.id), { hidden: !c.hidden, updatedAt: serverTimestamp() });
      patchLocal(c.id, { hidden: !c.hidden });
      toast(c.hidden ? "Certificate is visible" : "Certificate hidden");
    } catch (err) {
      toast(`Could not update: ${err.message}`, "danger");
    } finally {
      setBusy(false);
    }
  };

  const move = async (c, dir) => {
    const index = sorted.findIndex((x) => x.id === c.id);
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    // Renumber the whole list so every certificate has an explicit position.
    const batch = writeBatch(db);
    const patches = new Map();
    next.forEach((x, i) => {
      const order = (i + 1) * 10;
      if (x.order !== order) {
        patches.set(x.id, order);
        batch.update(doc(db, COLLECTION, x.id), { order, updatedAt: serverTimestamp() });
      }
    });
    if (!patches.size) return;
    setBusy(true);
    try {
      await batch.commit();
      setItems((list) => list.map((x) => (patches.has(x.id) ? { ...x, order: patches.get(x.id) } : x)));
    } catch (err) {
      toast(`Could not reorder: ${err.message}`, "danger");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    const c = toDelete;
    setBusy(true);
    try {
      await deleteDoc(doc(db, COLLECTION, c.id));
      setItems((list) => list.filter((x) => x.id !== c.id));
      toast("Certificate deleted");
      if (c.image?.startsWith(IMAGE_URL)) {
        try {
          await deleteAsset(`public${storedPath(c.image)}`);
        } catch {
          toast("Certificate deleted, but its image file could not be removed", "danger");
        }
      }
    } catch (err) {
      toast(`Could not delete: ${err.message}`, "danger");
    } finally {
      setBusy(false);
      setToDelete(null);
    }
  };

  return (
    <Page
      title="Certificates"
      subtitle={`${items.length} in total. Order here is the order on the public page, after featured items.`}
      actions={
        <>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or issuer" aria-label="Search certificates" className="w-56" />
          <Button variant="primary" onClick={() => setPanel("new")}>Add certificate</Button>
        </>
      }
    >
      {loading ? (
        <p className="text-sm text-ink-muted">Loading certificates...</p>
      ) : visible.length === 0 ? (
        <EmptyState
          title={needle ? "No certificate matches your search" : "No certificates yet"}
          message={needle ? "Try a different title or issuer." : "Add your first certificate to show it on the public page."}
          action={!needle && <Button variant="primary" onClick={() => setPanel("new")}>Add certificate</Button>}
        />
      ) : (
        <Card bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {visible.map((c) => {
              const index = sorted.findIndex((x) => x.id === c.id);
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white">
                    {c.image ? <img src={storedPath(c.image)} alt="" loading="lazy" className="size-full object-contain" /> : null}
                  </div>
                  <div className="min-w-0 flex-1 basis-56">
                    <p className={`truncate text-sm font-medium ${c.hidden ? "text-ink-muted" : "text-ink-strong"}`}>{titleOf(c) || "Untitled"}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {c.issuer || "No issuer"} · {formatDate(c)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge tone={linkIsReal(c) ? "success" : "neutral"}>{linkIsReal(c) ? "Verified link" : "No link"}</Badge>
                      {c.featured && <Badge tone="success">Featured</Badge>}
                      {c.hidden && <Badge tone="warning">Hidden</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button size="sm" variant="ghost" aria-label="Move up" title="Move up" disabled={busy || !!needle || index === 0} onClick={() => move(c, -1)}>Up</Button>
                    <Button size="sm" variant="ghost" aria-label="Move down" title="Move down" disabled={busy || !!needle || index === sorted.length - 1} onClick={() => move(c, 1)}>Down</Button>
                    <Button size="sm" onClick={() => setPanel(c)}>Edit</Button>
                    <Button size="sm" disabled={busy} onClick={() => toggleHidden(c)}>{c.hidden ? "Show" : "Hide"}</Button>
                    <Button size="sm" variant="danger" disabled={busy} onClick={() => setToDelete(c)}>Delete</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {panel && (
        <CertificatePanel
          key={panel === "new" ? "new" : panel.id}
          item={panel === "new" ? null : panel}
          nextOrder={nextOrder}
          onClose={() => setPanel(null)}
          onSaved={onSaved}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        danger
        title="Delete certificate"
        message={toDelete ? `Delete "${titleOf(toDelete)}" and its image? This cannot be undone.` : ""}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </Page>
  );
}
