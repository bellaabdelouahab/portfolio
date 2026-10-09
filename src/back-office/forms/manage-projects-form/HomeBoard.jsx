import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, GripIcon } from "./icons";

const iconBtn =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-success/50 hover:text-ink-strong focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line";

/**
 * "Shown on the home page": three equal slots, in the order the home page
 * shows them. Drop a project from the gallery into a slot, drag between slots
 * to swap, or use the arrows and the x for keyboard and touch.
 */
export default function HomeBoard({ slots, dragId, onDragStart, onDragEnd, onDropToSlot, onRemove, onMove }) {
  const [overSlot, setOverSlot] = useState(-1);

  const readId = (e) => e.dataTransfer.getData("text/plain") || dragId || "";

  return (
    <div className="rounded-md border border-line bg-surface p-3 shadow-lg shadow-black/30">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h2 className="text-sm font-semibold tracking-normal! text-ink-strong">Shown on the home page</h2>
        <p className="text-xs text-ink-muted">Drag a project into a slot. Visitors see slot 1, 2, 3 in that order.</p>
      </div>
      <ol className="grid grid-cols-3 gap-2.5">
        {slots.map((project, i) => {
          const over = overSlot === i && !!dragId;
          return (
            <li
              key={i}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overSlot !== i) setOverSlot(i);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOverSlot((s) => (s === i ? -1 : s));
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = readId(e);
                setOverSlot(-1);
                if (id) onDropToSlot(i, id);
              }}
              className={`flex h-[84px] min-w-0 items-center gap-2.5 rounded-md border-2 p-2 transition-colors ${
                over
                  ? "border-success bg-success/10"
                  : project
                    ? "border-line bg-page/60"
                    : dragId
                      ? "border-dashed border-success/50 bg-page/40"
                      : "border-dashed border-line bg-page/40"
              }`}
            >
              {project ? (
                <>
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, project.id)}
                    onDragEnd={onDragEnd}
                    title="Drag to another slot, or out to the gallery to remove"
                    className="relative flex h-full min-w-0 flex-1 cursor-grab items-center gap-2.5 active:cursor-grabbing"
                  >
                    <span className="absolute -top-1 -left-1 z-10 flex size-5 items-center justify-center rounded-full bg-success text-[0.7rem] font-bold text-black">{i + 1}</span>
                    <div className="aspect-[16/10] h-full shrink-0 overflow-hidden rounded-sm bg-[#111]">
                      {project.image && <img src={project.image} alt="" draggable={false} className="h-full w-full object-contain" />}
                    </div>
                    <p className="line-clamp-3 min-w-0 flex-1 text-xs leading-snug font-medium text-ink-strong">{project.title || "Untitled"}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" className={iconBtn} aria-label={`Remove ${project.title} from the home page`} title="Remove from home" onClick={() => onRemove(project.id)}>
                      <CloseIcon />
                    </button>
                    <div className="flex gap-1">
                      <button type="button" className={iconBtn} aria-label={`Move ${project.title} to slot ${i}`} title="Move left" disabled={i === 0} onClick={() => onMove(project.id, -1)}>
                        <ArrowLeftIcon />
                      </button>
                      <button type="button" className={iconBtn} aria-label={`Move ${project.title} to slot ${i + 2}`} title="Move right" disabled={i === slots.length - 1} onClick={() => onMove(project.id, 1)}>
                        <ArrowRightIcon />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center gap-3 px-1">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-xs font-bold text-ink-muted">{i + 1}</span>
                  <p className="text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1 text-ink"><GripIcon />Slot {i + 1} is empty</span>
                    <span className="block">Drop a project here, or use "Put on home".</span>
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
