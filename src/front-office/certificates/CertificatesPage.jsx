import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import SEO from "../../shared/ui/SEO";
import { toDate } from "../../shared/lib/dates";

/**
 * Credentials are shown the way Credly and LinkedIn show them: the badge,
 * the name, who issued it, when, and a link to the issuer's own verification
 * page. The IBM Data Analyst path is featured at the top because it is the
 * credential that matters most to a data client; everything else is grouped by
 * topic so a visitor can find what is relevant to them.
 */
const FEATURED = ["IBM Data Analyst Professional Certificate", "Data Analyst Capstone Project"];

const TRACKS = [
  ["Data analytics", (c) => ["IBM", "Cognitive Class", "365 DataScience"].includes(c.issuer)],
  ["Machine learning and AI", (c) => /machine learning|deep learning|natural language|sagemaker/i.test(c.title)],
  ["Software engineering", (c) => /spring|architecture|react|python intermediate/i.test(c.title)],
  ["Community", () => true],
];

const ISSUER = { "OPEN CLASS ROOM": "OpenClassrooms", "IBM & Coursera": "IBM and Coursera", "DIGITAL INITIATIVE": "Digital Initiative", "OPEN SOURCE": "Open Source Days" };
const issuerOf = (c) => ISSUER[c.issuer] || c.issuer;
const validLink = (l) => /^https?:\/\//.test(l || "") && !/certificate_example|\btest\b/.test(l);
const year = (c) => { const d = toDate(c.createdAt); return d.getTime() ? d.getFullYear() : ""; };
// OpenClassrooms files include specimen copies, so those show an issuer mark instead.
const showArt = (c) => c.issuer !== "OPEN CLASS ROOM" || /65d749b4/.test(c.image || "");
const art = (c) => (c.image || "").replace(".webp", "_result.webp");

function Mark({ c, className = "" }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-md border border-line bg-surface-raised text-xl font-bold text-success ${className}`}>
      {issuerOf(c).slice(0, 2).toUpperCase()}
    </span>
  );
}

function Badge({ c, size = "size-24", onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(c)} className="group flex cursor-pointer flex-col items-center gap-3 text-center" aria-label={`Open ${c.title}`}>
      {showArt(c) ? (
        <img src={art(c)} alt="" loading="lazy" className={`${size} rounded-md bg-white object-contain p-1 transition-transform duration-200 group-hover:scale-105`} />
      ) : (
        <Mark c={c} className={size} />
      )}
      <span className="text-sm leading-snug font-bold text-ink-strong group-hover:text-success">{c.title}</span>
      <span className="-mt-2 text-xs text-ink-muted">{issuerOf(c)} · {year(c)}</span>
    </button>
  );
}

function Viewer({ c, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={c.title} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-5" onClick={onClose}>
      <div className="w-full max-w-lg rounded-md border border-line bg-surface p-6 text-center" onClick={(e) => e.stopPropagation()}>
        {showArt(c) && <img loading="lazy" decoding="async" src={art(c)} alt={c.title} className="mx-auto mb-5 max-h-72 w-auto rounded-sm bg-white object-contain" />}
        <h2 className="text-xl font-bold text-ink-strong">{c.title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{issuerOf(c)} · {year(c)}</p>
        <div className="mt-5 flex justify-center gap-3">
          {validLink(c.link) && (
            <a href={c.link} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-success px-4 py-2 text-sm font-bold tracking-[1px]! text-black!">Verify credential</a>
          )}
          <button type="button" onClick={onClose} className="cursor-pointer rounded-sm border border-line px-4 py-2 text-sm font-bold tracking-[1px]! text-ink-strong">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const { allCertificates, count } = useLoaderData();
  const [open, setOpen] = useState(null);

  const featured = FEATURED.map((t) => allCertificates.find((c) => c.title === t)).filter(Boolean);
  const groups = useMemo(() => {
    const left = allCertificates.filter((c) => !FEATURED.includes(c.title));
    const used = new Set();
    return TRACKS.map(([name, test]) => {
      const items = left.filter((c) => !used.has(c) && test(c));
      items.forEach((c) => used.add(c));
      return [name, items];
    }).filter(([, items]) => items.length);
  }, [allCertificates]);

  return (
    <>
      <SEO
        title="Certifications"
        description="Verified certifications by Abdelouahab Bella in data analytics, machine learning and software engineering, including the IBM Data Analyst Professional Certificate."
        keywords="IBM Data Analyst Professional Certificate, data analyst certifications, Abdelouahab Bella"
      />
      <section className="mx-auto w-full max-w-5xl px-5 py-8 md:py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">Certifications</h1>
          <p className="text-base leading-relaxed text-ink">{count} credentials in data, machine learning and software engineering. Select one to see the issuer and verify it.</p>
        </header>

        {featured.length > 0 && (
          <div className="mb-10 grid gap-5 md:grid-cols-2">
            {featured.map((c) => (
              <button key={c.title} type="button" onClick={() => setOpen(c)} className="group flex cursor-pointer items-center gap-5 rounded-md border border-success/40 bg-surface p-5 text-left transition-colors hover:border-success">
                <img loading="lazy" decoding="async" src={art(c)} alt="" className="size-28 shrink-0 rounded-md bg-white object-contain p-1" />
                <span>
                  <span className="text-xs font-bold tracking-[2px]! text-success uppercase">Featured</span>
                  <span className="mt-1 block text-lg leading-snug font-bold text-ink-strong">{c.title}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{issuerOf(c)} · {year(c)}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {groups.map(([name, items]) => (
          <section key={name} className="mb-10">
            <h2 className="mb-5 border-b border-line pb-2 text-lg font-bold text-ink-strong">{name} <span className="font-normal text-ink-muted">({items.length})</span></h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              {items.map((c) => <Badge key={c.title} c={c} onOpen={setOpen} />)}
            </div>
          </section>
        ))}
      </section>
      {open && <Viewer c={open} onClose={() => setOpen(null)} />}
    </>
  );
}
