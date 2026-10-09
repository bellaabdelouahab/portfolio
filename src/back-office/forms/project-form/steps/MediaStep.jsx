import { useRef, useState } from "react";
import { Button, Input } from "../../../ui";
import { fieldError } from "../formModel";
import { Group } from "./parts";
import Thumb from "./Thumb";

const ACCEPT = "image/webp,image/png,image/jpeg,image/gif,image/avif";

export default function MediaStep({ f, set, coverBusy, onCover, onAddShots, onReplaceShot, errors, pickErrors }) {
  const coverInput = useRef(null);
  const addInput = useRef(null);
  const replaceInput = useRef(null);
  const replaceId = useRef(null);
  const [drag, setDrag] = useState(false);
  const items = f.carousel;

  const patch = (id, p) => set("carousel", items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set("carousel", next);
  };
  const coverError = fieldError(errors, "cover");
  const frCount = items.filter((x) => x.frTitle.trim()).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-ink-muted">
        Images are stored as WebP, 1440 px wide at most. A PNG or JPG is converted in your browser when you pick it, and every file uploads right away, so a draft keeps its images.
      </p>
      <div className="grid gap-3 lg:grid-cols-[19rem_1fr]">
        <Group title="Cover image" hint="Shown on the card and at the top of the page. 16:10 works best.">
          <Thumb src={coverBusy?.preview || f.cover} alt="Cover" busy={!!coverBusy} className="aspect-[16/10] w-full rounded-md border border-line" />
          <input ref={coverInput} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) onCover(file); }} />
          <div className="mt-2.5 flex items-center gap-2">
            <Button size="sm" disabled={!!coverBusy} onClick={() => coverInput.current?.click()}>{f.cover ? "Replace cover" : "Choose cover"}</Button>
            {coverBusy && <span className="truncate text-xs text-ink-muted">{coverBusy.name}</span>}
          </div>
          {coverError && !coverBusy && <p className="mt-2 text-xs text-danger">{coverError}</p>}
        </Group>

        <Group
          title={`Screenshots (${items.length})`}
          hint={`Shown as a gallery in this order. Captions are required in English; French captions filled: ${frCount} of ${items.length}.`}
          actions={<Button size="sm" onClick={() => addInput.current?.click()}>Add images</Button>}
        >
          <input ref={addInput} type="file" accept={ACCEPT} multiple className="hidden" onChange={(e) => { const files = Array.from(e.target.files || []); e.target.value = ""; if (files.length) onAddShots(files); }} />
          <input ref={replaceInput} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file && replaceId.current) onReplaceShot(replaceId.current, file); }} />
          {pickErrors.length > 0 && (
            <ul className="mb-2 space-y-0.5 text-xs text-danger">{pickErrors.map((m, i) => <li key={i}>{m}</li>)}</ul>
          )}
          <div className="grid gap-2.5 xl:grid-cols-2">
            {items.map((it, i) => {
              const err = fieldError(errors, `shot-${it.id}`);
              return (
                <div key={it.id} className="flex gap-2.5 rounded-md border border-line bg-surface p-2">
                  <div className="w-28 shrink-0">
                    <div className="relative">
                      <Thumb src={it.preview || it.img} alt={it.title} busy={!!it.uploading} className="aspect-[16/10] w-full rounded-sm" />
                      <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 text-[0.7rem] text-white">{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Input value={it.title} error={!!err} placeholder="Caption (English)" aria-label={`English caption of screenshot ${i + 1}`} onChange={(e) => patch(it.id, { title: e.target.value })} className="py-1.5!" />
                    <Input value={it.frTitle} placeholder="Caption (French)" aria-label={`French caption of screenshot ${i + 1}`} onChange={(e) => patch(it.id, { frTitle: e.target.value })} className="py-1.5!" />
                    {err && <p className="text-xs text-danger">{err}</p>}
                    <div className="flex flex-wrap gap-0.5">
                      <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} className="px-1.5!">Earlier</Button>
                      <Button size="sm" variant="ghost" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="px-1.5!">Later</Button>
                      <Button size="sm" variant="ghost" className="px-1.5!" disabled={!!it.uploading} onClick={() => { replaceId.current = it.id; replaceInput.current?.click(); }}>Replace</Button>
                      <Button size="sm" variant="danger" className="px-1.5!" onClick={() => set("carousel", items.filter((x) => x.id !== it.id))}>Remove</Button>
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => addInput.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const files = Array.from(e.dataTransfer.files || []); if (files.length) onAddShots(files); }}
              className={`flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-3 py-4 text-center text-xs transition-colors ${drag ? "border-success bg-success/10 text-success" : "border-line text-ink-muted hover:border-success/50 hover:text-ink-strong"}`}
            >
              <span className="text-sm text-ink-strong">Add screenshots</span>
              <span>Click to choose several files, or drop them here</span>
            </button>
          </div>
        </Group>
      </div>
    </div>
  );
}
