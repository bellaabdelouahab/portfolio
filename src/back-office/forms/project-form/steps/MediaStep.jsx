import { useRef, useState } from "react";
import { Button, Card, Input } from "../../../ui";
import { fieldError } from "../formModel";
import Thumb from "./Thumb";

const MAX_BYTES = 5 * 1024 * 1024;
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const stem = (name) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();

export default function MediaStep({ coverFile, setCoverFile, existingImage, items, setItems, onRemoved, errors }) {
  const coverInput = useRef(null);
  const addInput = useRef(null);
  const replaceInput = useRef(null);
  const replaceId = useRef(null);
  const [pickError, setPickError] = useState("");

  const accept = (file) => {
    if (!file) return false;
    if (file.type !== "image/webp") {
      setPickError(`"${file.name}" is not a .webp image.`);
      return false;
    }
    if (file.size > MAX_BYTES) {
      setPickError(`"${file.name}" is larger than 5 MB.`);
      return false;
    }
    return true;
  };

  const onCover = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f && f.type !== "image/webp") return setPickError("Only .webp images are accepted for the cover.");
    if (f) {
      setPickError("");
      setCoverFile(f);
    }
  };

  const onAdd = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    setPickError("");
    const good = files.filter(accept);
    if (good.length) setItems([...items, ...good.map((file) => ({ id: newId(), title: stem(file.name), file, existingPath: null }))]);
  };

  const onReplace = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f && accept(f)) {
      setPickError("");
      setItems(items.map((it) => (it.id === replaceId.current ? { ...it, file: f } : it)));
    }
  };

  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  const coverError = fieldError(errors, "cover");

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
      <Card title="Cover image" description="WebP, 16:10 recommended, up to 1440 px wide.">
        <Thumb file={coverFile} src={existingImage} alt="Cover" className="aspect-[16/10] w-full rounded-md border border-line" />
        <input ref={coverInput} type="file" accept="image/webp" className="hidden" onChange={onCover} />
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" onClick={() => coverInput.current?.click()}>{coverFile || existingImage ? "Replace cover" : "Choose cover"}</Button>
          {coverFile && <Button size="sm" variant="ghost" onClick={() => setCoverFile(null)}>Undo</Button>}
        </div>
        {coverFile && <p className="mt-2 truncate text-xs text-ink-muted">{coverFile.name} (uploads on save)</p>}
        {coverError && <p className="mt-2 text-xs text-danger">{coverError}</p>}
      </Card>

      <Card
        title={`Screenshots (${items.length})`}
        description="Shown in the project gallery, in this order."
        actions={<Button size="sm" onClick={() => addInput.current?.click()}>Add images</Button>}
      >
        <input ref={addInput} type="file" accept="image/webp" multiple className="hidden" onChange={onAdd} />
        <input ref={replaceInput} type="file" accept="image/webp" className="hidden" onChange={onReplace} />
        {pickError && <p className="mb-2 text-xs text-danger">{pickError}</p>}
        {items.length === 0 ? (
          <p className="py-6 text-center text-xs text-ink-muted">No screenshots yet. Add one or more .webp images.</p>
        ) : (
          <ul className="flex max-h-[calc(100vh-24rem)] min-h-40 flex-col gap-2 overflow-y-auto pr-1">
            {items.map((it, i) => {
              const err = fieldError(errors, `shot-${it.id}`);
              return (
                <li key={it.id} className="flex items-center gap-3 rounded-md border border-line bg-page/40 p-2">
                  <Thumb file={it.file} src={it.existingPath} alt={it.title} className="h-12 w-20 shrink-0 rounded-sm" />
                  <div className="min-w-0 flex-1">
                    <Input
                      value={it.title}
                      error={!!err}
                      placeholder="Title"
                      aria-label={`Title of screenshot ${i + 1}`}
                      onChange={(e) => setItems(items.map((x) => (x.id === it.id ? { ...x, title: e.target.value } : x)))}
                      className="py-1.5!"
                    />
                    {err && <p className="mt-1 text-xs text-danger">{err}</p>}
                    {it.file && <p className="mt-1 truncate text-xs text-ink-muted">New file: {it.file.name}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">Up</Button>
                    <Button size="sm" variant="ghost" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">Down</Button>
                    <Button size="sm" variant="ghost" onClick={() => { replaceId.current = it.id; replaceInput.current?.click(); }}>Replace</Button>
                    <Button size="sm" variant="danger" onClick={() => { setItems(items.filter((x) => x.id !== it.id)); onRemoved(it); }}>Remove</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
