import { Badge, Button } from "../../ui";
import { slugifyProjectTitle } from "../../../shared/lib/projectSlug";
import { formatDate } from "./projectMeta";
import { StarIcon } from "./icons";

const ring = "focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:outline-none";

function Actions({ p, homeSlot, busy, h }) {
  const slug = slugifyProjectTitle(p.title);
  const hidden = p.hidden === true;
  const onHome = homeSlot > 0;
  return (
    <>
      <Button size="sm" variant="primary" disabled={busy} onClick={() => h.onEdit(p)} className={ring}>Edit</Button>
      {onHome ? (
        <Button size="sm" variant="secondary" disabled={busy} onClick={() => h.onRemoveHome(p.id)} className={ring}>Off home</Button>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          disabled={busy || hidden}
          title={hidden ? "Hidden projects cannot be on the home page. Show it first." : "Fill the first free home slot"}
          onClick={() => h.onPutHome(p.id)}
          className={ring}
        >
          Put on home
        </Button>
      )}
      <Button size="sm" variant="ghost" disabled={busy} onClick={() => h.onToggleHidden(p)} className={ring}>{hidden ? "Show" : "Hide"}</Button>
      <Button size="sm" variant="ghost" disabled={busy} onClick={() => h.onToggleHighlight(p)} className={ring}>
        {p.highlighted === "star" ? "Unhighlight" : "Highlight"}
      </Button>
      <a
        href={`/projects/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-md px-2.5 py-1.5 text-xs font-medium tracking-normal! text-ink hover:bg-surface-raised hover:text-ink-strong ${ring}`}
      >
        View on site
      </a>
      <Button size="sm" variant="danger" loading={busy} disabled={busy} onClick={() => h.onDelete(p)} className={ring}>Delete</Button>
    </>
  );
}

function MetaBadges({ p }) {
  const cs = p.caseStudy || {};
  return (
    <>
      <Badge>{cs.kind === "personal" ? "Personal" : "Client"}</Badge>
      {(cs.services || []).map((s) => <Badge key={s}>{s === "data" ? "Data" : "Web"}</Badge>)}
      {p.hidden === true && <Badge tone="warning">Hidden</Badge>}
      {p.highlighted === "star" && <Badge tone="success">Highlighted</Badge>}
    </>
  );
}

const statusLine = (p) => {
  const cs = p.caseStudy || {};
  return [formatDate(p.startDate || p.createdAt), cs.status || p.durration].filter(Boolean).join(" - ") || "No date";
};

const dragProps = (p, h) =>
  p.hidden === true
    ? {}
    : { draggable: true, onDragStart: (e) => h.onDragStart(e, p.id), onDragEnd: h.onDragEnd };

export function GalleryCard({ p, homeSlot, busy, dragging, h }) {
  const hidden = p.hidden === true;
  return (
    <li
      {...dragProps(p, h)}
      className={`group/card flex min-w-0 flex-col overflow-hidden rounded-md border bg-surface transition duration-150 ${
        dragging ? "opacity-40" : ""
      } ${homeSlot > 0 ? "border-success/60" : "border-line hover:border-success/40"} ${hidden ? "" : "cursor-grab active:cursor-grabbing"}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111]">
        {p.image ? (
          <img src={p.image} alt="" loading="lazy" decoding="async" draggable={false} className={`h-full w-full object-contain ${hidden ? "opacity-50" : ""}`} />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-muted">No cover image</div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {homeSlot > 0 && <span className="rounded-full bg-success px-2.5 py-0.5 text-xs font-bold text-black shadow">Home {homeSlot}</span>}
        </div>
        {p.highlighted === "star" && (
          <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/70 text-[#e0b34a]" title="Highlighted">
            <StarIcon filled />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-semibold text-ink-strong">{p.title || "Untitled"}</p>
          <p className="mt-0.5 truncate text-xs text-ink-muted">{statusLine(p)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <MetaBadges p={p} />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-1 border-t border-line pt-2.5">
          <Actions p={p} homeSlot={homeSlot} busy={busy} h={h} />
        </div>
      </div>
    </li>
  );
}

export function ListRow({ p, homeSlot, busy, dragging, h }) {
  const hidden = p.hidden === true;
  return (
    <li
      {...dragProps(p, h)}
      className={`flex flex-wrap items-center gap-3 rounded-md border bg-surface px-3 py-2 transition ${dragging ? "opacity-40" : ""} ${
        homeSlot > 0 ? "border-success/60" : "border-line hover:border-success/40"
      } ${hidden ? "opacity-70" : "cursor-grab active:cursor-grabbing"}`}
    >
      <div className="relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-sm bg-[#111]">
        {p.image && <img src={p.image} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-contain" />}
      </div>
      <div className="min-w-0 flex-1 basis-48">
        <p className="truncate text-sm font-medium text-ink-strong">{p.title || "Untitled"}</p>
        <p className="truncate text-xs text-ink-muted">{statusLine(p)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1 lg:w-52">
        {homeSlot > 0 && <Badge tone="success">Home {homeSlot}</Badge>}
        <MetaBadges p={p} />
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Actions p={p} homeSlot={homeSlot} busy={busy} h={h} />
      </div>
    </li>
  );
}
