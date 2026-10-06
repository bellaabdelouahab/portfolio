import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import SEO from "../../shared/ui/SEO";
import { toDate } from "../../shared/lib/dates";

const GROUPS = [
  ["all", "All"],
  ["IBM", "IBM"],
  ["OPEN CLASS ROOM", "OpenClassrooms"],
  ["other", "Other"],
];
const ISSUER_LABEL = { "OPEN CLASS ROOM": "OpenClassrooms", "IBM & Coursera": "IBM and Coursera", "DIGITAL INITIATIVE": "Digital Initiative" };

const groupOf = (c) => (c.issuer === "IBM" || c.issuer === "OPEN CLASS ROOM" ? c.issuer : "other");
const label = (c) => ISSUER_LABEL[c.issuer] || c.issuer;
const when = (c) => {
  const d = toDate(c.createdAt);
  return d.getTime() ? d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
};

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors duration-200",
        active ? "border-success bg-success/15 text-success" : "border-line bg-surface text-ink hover:border-success/40 hover:text-ink-strong",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Certificates() {
  const { allCertificates, count } = useLoaderData();
  const [group, setGroup] = useState("all");
  const [shown, setShown] = useState(12);

  const filtered = useMemo(
    () => allCertificates.filter((c) => group === "all" || groupOf(c) === group),
    [allCertificates, group],
  );
  const countOf = (g) => (g === "all" ? count : allCertificates.filter((c) => groupOf(c) === g).length);

  return (
    <>
      <SEO
        title="Certificates"
        description="Professional certifications earned by Abdelouahab Bella in data analytics, machine learning, cloud platforms and software engineering."
        keywords="Abdelouahab Bella certifications, data analyst certificates, machine learning certification, IBM, OpenClassrooms"
      />
      <section className="mx-auto w-full max-w-5xl px-5 py-8 md:py-10">
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">Certifications</h1>
          <p className="text-base leading-relaxed text-ink">
            {count} verified credentials in data, machine learning and software engineering. Select a row to open the
            issuer&apos;s verification page.
          </p>
        </header>

        <div className="mb-5 flex flex-wrap gap-2 border-b border-line pb-4">
          {GROUPS.map(([id, text]) => (
            <Chip key={id} active={group === id} onClick={() => { setGroup(id); setShown(12); }}>
              {text} <span className="opacity-60">({countOf(id)})</span>
            </Chip>
          ))}
        </div>

        <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-surface">
          {filtered.slice(0, shown).map((c) => (
            <li key={c.title + c.createdAt?.$date}>
              <a
                href={c.link || c.downloadPath}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-raised"
              >
                <img
                  src={(c.image || "").replace(".webp", "_result.webp")}
                  alt=""
                  width="64"
                  height="64"
                  loading="lazy"
                  className="size-16 shrink-0 rounded-sm bg-black object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-base leading-snug font-bold text-ink-strong group-hover:text-success">{c.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{label(c)}{when(c) && ` · ${when(c)}`}</span>
                </span>
                <span className="hidden shrink-0 text-sm font-bold text-success sm:block">Verify →</span>
              </a>
            </li>
          ))}
        </ul>

        {shown < filtered.length && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShown((n) => n + 12)}
              className="cursor-pointer rounded-sm border border-line bg-surface px-5 py-2 text-sm font-bold tracking-[1px]! text-ink-strong transition-colors hover:border-success/50"
            >
              Show more ({filtered.length - shown} remaining)
            </button>
          </div>
        )}
      </section>
    </>
  );
}
