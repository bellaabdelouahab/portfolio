import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, doc, getDocs, serverTimestamp, writeBatch, deleteDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../shared/lib/firebase";
import { putAsset, deleteAsset } from "../../lib/assetStore";
import {
  Page,
  Card,
  Field,
  Input,
  Textarea,
  Select,
  Toggle,
  Button,
  Badge,
  EmptyState,
  ConfirmDialog,
  useToast,
  useUnsavedGuard,
} from "../../ui";

const IMAGE_DIR = "images/clients/";
const QUOTE_LIMIT = 280;
const EMPTY = {
  name: "",
  profession: "",
  company: "",
  description: "",
  rating: "",
  featured: false,
  hidden: false,
  frDescription: "",
  frProfession: "",
};

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  const ms = typeof value === "number" ? value : Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

const orderOf = (c) => (typeof c.order === "number" ? c.order : Number.MAX_SAFE_INTEGER);
const sortClients = (list) =>
  [...list].sort((a, b) => orderOf(a) - orderOf(b) || toMillis(b.createdAt) - toMillis(a.createdAt));

const initialsOf = (name = "") => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
};

/** `/images/clients/x.jpg` -> `public/images/clients/x.jpg`; anything else is not ours to delete. */
const assetPathOf = (image) => (typeof image === "string" && image.startsWith(`/${IMAGE_DIR}`) ? `public${image}` : null);

function Avatar({ client, size = "size-10" }) {
  return client.image ? (
    <img src={client.image} alt="" className={`${size} shrink-0 rounded-full border border-line object-cover`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-xs font-medium text-ink-strong`}>
      {initialsOf(client.name) || "?"}
    </span>
  );
}

export default function Clients() {
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, "new" or a client
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const snap = await getDocs(collection(db, "clients"));
      setClients(sortClients(snap.docs.map((d) => ({ ...d.data(), id: d.id }))));
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setLoadError(err.message || "Could not load testimonials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHidden = async (client) => {
    setBusyId(client.id);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "clients", client.id), { hidden: !client.hidden, updatedAt: serverTimestamp() });
      await batch.commit();
      setClients((list) => list.map((c) => (c.id === client.id ? { ...c, hidden: !client.hidden } : c)));
      toast(client.hidden ? "Testimonial is visible again" : "Testimonial hidden");
    } catch (err) {
      toast(`Could not update: ${err.message}`, "danger");
    } finally {
      setBusyId("");
    }
  };

  const move = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= clients.length) return;
    const next = [...clients];
    [next[index], next[target]] = [next[target], next[index]];
    const renumbered = next.map((c, i) => ({ ...c, order: i }));
    setBusyId(next[target].id);
    try {
      const batch = writeBatch(db);
      renumbered.forEach((c) => batch.update(doc(db, "clients", c.id), { order: c.order }));
      await batch.commit();
      setClients(renumbered);
    } catch (err) {
      toast(`Could not reorder: ${err.message}`, "danger");
    } finally {
      setBusyId("");
    }
  };

  const confirmDelete = async () => {
    const client = pendingDelete;
    setPendingDelete(null);
    if (!client) return;
    setBusyId(client.id);
    try {
      await deleteDoc(doc(db, "clients", client.id));
      const assetPath = assetPathOf(client.image);
      let imageFailed = false;
      if (assetPath) {
        try {
          await deleteAsset(assetPath);
        } catch {
          imageFailed = true;
        }
      }
      const remaining = clients.filter((c) => c.id !== client.id).map((c, i) => ({ ...c, order: i }));
      if (remaining.length) {
        const batch = writeBatch(db);
        remaining.forEach((c) => batch.update(doc(db, "clients", c.id), { order: c.order }));
        await batch.commit().catch(() => {});
      }
      setClients(remaining);
      toast(imageFailed ? "Testimonial deleted, but its photo could not be removed" : "Testimonial deleted", imageFailed ? "danger" : "success");
    } catch (err) {
      toast(`Could not delete: ${err.message}`, "danger");
    } finally {
      setBusyId("");
    }
  };

  const onSaved = () => {
    setEditing(null);
    load();
  };

  return (
    <Page
      title="Testimonials"
      subtitle="Quotes shown in the Happy clients section of the home page."
      actions={<Button variant="primary" onClick={() => setEditing("new")}>Add testimonial</Button>}
    >
      {loading ? (
        <p className="py-10 text-center text-sm text-ink-muted">Loading testimonials...</p>
      ) : loadError ? (
        <EmptyState
          title="Could not load testimonials"
          message={loadError}
          action={<Button onClick={load}>Try again</Button>}
        />
      ) : clients.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          message="Add a client quote and it will appear on the home page."
          action={<Button variant="primary" onClick={() => setEditing("new")}>Add testimonial</Button>}
        />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {clients.map((client, index) => {
            const busy = busyId === client.id;
            const role = [client.profession, client.company].filter(Boolean).join(" at ");
            return (
              <li key={client.id} className="m-0 rounded-md border border-line bg-surface p-3">
                <div className="flex flex-wrap items-start gap-3">
                  <Avatar client={client} />
                  <div className="min-w-0 flex-1 basis-60">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink-strong">{client.name}</span>
                      {client.featured && <Badge tone="success">Featured</Badge>}
                      {client.hidden && <Badge tone="warning">Hidden</Badge>}
                    </div>
                    {role && <p className="mt-0.5 text-xs text-ink-muted">{role}</p>}
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink">{client.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <Button size="sm" variant="ghost" disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label="Move up">Up</Button>
                    <Button size="sm" variant="ghost" disabled={busy || index === clients.length - 1} onClick={() => move(index, 1)} aria-label="Move down">Down</Button>
                    <Button size="sm" disabled={busy} onClick={() => setEditing(client)}>Edit</Button>
                    <Button size="sm" disabled={busy} onClick={() => toggleHidden(client)}>{client.hidden ? "Show" : "Hide"}</Button>
                    <Button size="sm" variant="danger" disabled={busy} onClick={() => setPendingDelete(client)}>Delete</Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <TestimonialPanel
          client={editing === "new" ? null : editing}
          allClients={clients}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        danger
        title="Delete testimonial"
        message={pendingDelete ? `Delete the testimonial from ${pendingDelete.name}? Its photo is removed too. This cannot be undone.` : ""}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </Page>
  );
}

function TestimonialPanel({ client, allClients, onClose, onSaved }) {
  const { toast } = useToast();
  const isNew = !client;
  const [form, setForm] = useState(() =>
    client
      ? {
          name: client.name || "",
          profession: client.profession || "",
          company: client.company || "",
          description: client.description || "",
          rating: client.rating ? String(client.rating) : "",
          featured: !!client.featured,
          hidden: !!client.hidden,
          frDescription: client.fr?.description || "",
          frProfession: client.fr?.profession || "",
        }
      : EMPTY
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(client?.image || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef(null);
  const objectUrl = useRef("");

  useUnsavedGuard(dirty);
  useEffect(() => () => objectUrl.current && URL.revokeObjectURL(objectUrl.current), []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !saving && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const close = () => {
    if (dirty && !window.confirm("Discard your changes?")) return;
    onClose();
  };

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const pickFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      setErrors((er) => ({ ...er, image: "Choose an image file." }));
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(picked);
    setFile(picked);
    setPreview(objectUrl.current);
    setDirty(true);
    setErrors((er) => ({ ...er, image: "" }));
  };

  const removePhoto = () => {
    setFile(null);
    setPreview("");
    setDirty(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.description.trim()) next.description = "Quote is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      let image = client?.image || "";
      let oldAssetToRemove = null;
      if (file) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const fileName = `${uuidv4().replace(/-/g, "").slice(0, 24)}.${ext}`;
        await putAsset(file, `public/${IMAGE_DIR}${fileName}`);
        image = `/${IMAGE_DIR}${fileName}`;
        oldAssetToRemove = assetPathOf(client?.image);
      } else if (!preview && client?.image) {
        image = "";
        oldAssetToRemove = assetPathOf(client.image);
      }

      const data = {
        name: form.name.trim(),
        profession: form.profession.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        image,
        featured: form.featured,
        hidden: form.hidden,
        updatedAt: serverTimestamp(),
      };
      data.rating = form.rating ? Number(form.rating) : null;
      const frDescription = form.frDescription.trim();
      const frProfession = form.frProfession.trim();
      data.fr = frDescription || frProfession ? { description: frDescription, profession: frProfession } : null;

      const batch = writeBatch(db);
      if (isNew) {
        const ref = doc(collection(db, "clients"));
        // Number everything once so the new entry lands at the end, not before unnumbered ones.
        allClients.forEach((c, i) => batch.update(doc(db, "clients", c.id), { order: i }));
        batch.set(ref, { ...data, _id: ref.id, order: allClients.length, createdAt: serverTimestamp() });
      } else {
        batch.update(doc(db, "clients", client.id), data);
      }
      await batch.commit();

      if (oldAssetToRemove) await deleteAsset(oldAssetToRemove).catch(() => {});
      toast(isNew ? "Testimonial added" : "Testimonial saved");
      setDirty(false);
      onSaved();
    } catch (err) {
      console.error("Save testimonial failed:", err);
      toast(`Could not save: ${err.message}`, "danger");
    } finally {
      setSaving(false);
    }
  };

  const quoteLen = form.description.length;
  const over = quoteLen > QUOTE_LIMIT;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/60" onClick={() => !saving && close()}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? "Add testimonial" : "Edit testimonial"}
        className="flex h-full w-full max-w-lg flex-col border-l border-line bg-page"
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-base font-semibold tracking-normal! text-ink-strong">{isNew ? "Add testimonial" : "Edit testimonial"}</h2>
          <Button variant="ghost" size="sm" disabled={saving} onClick={close}>Close</Button>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Name" required error={errors.name}>
              <Input value={form.name} error={!!errors.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" />
            </Field>
            <Field label="Rating" hint="Optional">
              <Select value={form.rating} onChange={(e) => set("rating", e.target.value)}>
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} out of 5</option>
                ))}
              </Select>
            </Field>
            <Field label="Role">
              <Input value={form.profession} onChange={(e) => set("profession", e.target.value)} placeholder="Marketing Director" />
            </Field>
            <Field label="Company">
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Inc." />
            </Field>
          </div>

          <Field
            label="Quote"
            required
            error={errors.description}
            hint={
              <span className={over ? "text-danger" : ""}>
                {quoteLen} / {QUOTE_LIMIT} characters recommended
              </span>
            }
          >
            <Textarea rows={5} value={form.description} error={!!errors.description} onChange={(e) => set("description", e.target.value)} placeholder="What they said about your work" />
          </Field>

          <div>
            <span className="text-xs font-medium text-ink">Photo</span>
            <div className="mt-1.5 flex items-center gap-3">
              <Avatar client={{ name: form.name, image: preview }} size="size-16" />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => fileRef.current?.click()}>{preview ? "Replace photo" : "Upload photo"}</Button>
                {preview && <Button size="sm" variant="ghost" onClick={removePhoto}>Remove</Button>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" />
            </div>
            {errors.image ? (
              <p className="mt-1 text-xs text-danger">{errors.image}</p>
            ) : (
              <p className="mt-1 text-xs text-ink-muted">Square image works best. Without a photo, initials are shown.</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" hint="Shown before other testimonials with the same position." />
            <Toggle checked={form.hidden} onChange={(v) => set("hidden", v)} label="Hidden" hint="Keep it saved but do not show it on the site." />
          </div>

          <Card title="French version" description="Optional. Shown on the French site; English is used when empty." bodyClassName="flex flex-col gap-3">
            <Field label="Quote (French)">
              <Textarea rows={3} value={form.frDescription} onChange={(e) => set("frDescription", e.target.value)} />
            </Field>
            <Field label="Role (French)">
              <Input value={form.frProfession} onChange={(e) => set("frProfession", e.target.value)} />
            </Field>
          </Card>
        </div>

        <footer className="flex justify-end gap-2 border-t border-line px-4 py-3">
          <Button variant="ghost" disabled={saving} onClick={close}>Cancel</Button>
          <Button type="submit" variant="primary" loading={saving}>{isNew ? "Add testimonial" : "Save changes"}</Button>
        </footer>
      </form>
    </div>
  );
}
