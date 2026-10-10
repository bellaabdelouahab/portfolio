import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import { useT } from "../../../../shared/i18n/strings";
import { useContent } from "../../../../shared/i18n/useContent";
/**
 * FAQ as master–detail rather than an accordion.
 *
 * The accordion pushed every following question down when one opened, so the
 * answer you had just asked for moved under your cursor and the section's height
 * jumped. Here the question list stays put and the answer renders in a fixed
 * panel beside it — nothing below the section moves, ever.
 *
 * Below `lg` the two columns stack, because a side-by-side panel cannot work at
 * phone widths. The selected answer then renders directly under the list, which
 * keeps the same "pick one, read it" model without the layout shift.
 *
 * The first question is selected on load so the panel is never empty, and so the
 * section demonstrates what it is for without requiring a click.
 */

/** A menu of questions; nothing is selected until the visitor picks one. */
function FAQDropdown({ items, placeholder }) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const root = useRef(null);
  const selected = items.find((i) => i.id === selectedId) || null;

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === "keydown" ? e.key === "Escape" : !root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6">
      <div ref={root}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={[
            "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-surface px-4 py-3.5 text-left transition-colors",
            open ? "border-success/60" : "border-line hover:border-success/40",
          ].join(" ")}
        >
          <span className={`text-sm font-medium leading-snug ${selected ? "text-ink-strong" : "text-ink-muted"}`}>
            {selected ? selected.question : placeholder}
          </span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-success transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <ul role="listbox" className="mt-2 max-h-96 overflow-y-auto rounded-lg border border-line bg-surface p-1.5">
            {items.map((item) => (
              <li key={item.id} role="option" aria-selected={item.id === selectedId}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setOpen(false);
                  }}
                  className={[
                    "w-full cursor-pointer rounded-md px-3 py-2.5 text-left text-sm leading-snug",
                    item.id === selectedId ? "bg-success/15 font-medium text-ink-strong" : "text-ink hover:bg-surface-raised",
                  ].join(" ")}
                >
                  {item.question}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selected && (
        <div aria-live="polite" className="mt-4 rounded-lg border border-line bg-surface p-6">
          <h3 className="text-lg font-semibold text-ink-strong">{selected.question}</h3>
          <div className="mt-3 h-px w-12 bg-success" />
          <p className="mt-4 text-sm leading-relaxed text-ink">{selected.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const t = useT();
  const { faq: faqData } = useContent();
  const [selectedId, setSelectedId] = useState(faqData[0]?.id);
  const selected = faqData.find((item) => item.id === selectedId) ?? faqData[0];

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema)}</script>
      </Helmet>

      <section className="faq-section hidden-area">
        <div className="home-sections-title">
          <span>08. </span>
          {t("home.faq")}
        </div>

        {/* Phones: a menu of questions (nothing selected until one is picked).
            Desktop: all questions beside the answer, so nothing is hidden. */}
        <div className="lg:hidden">
          <FAQDropdown items={faqData} placeholder={t("faq.choose")} />
        </div>
        <div className="mx-auto mb-5 grid w-full max-w-8xl gap-4 px-4 max-lg:hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch">
          {/* Question list */}
          <ul className="flex flex-col gap-2">
            {faqData.map((item) => {
              const isSelected = item.id === selected?.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={isSelected}
                    className={[
                      "flex min-h-14 w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left",
                      "transition-colors duration-200 cursor-pointer",
                      isSelected
                        ? "border-success/60 bg-surface text-ink-strong"
                        : "border-line bg-surface/40 text-ink hover:border-success/40 hover:bg-surface",
                    ].join(" ")}
                  >
                    <span className="text-sm font-medium leading-snug">{item.question}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={[
                        "shrink-0 transition-transform duration-200",
                        isSelected ? "text-success max-lg:rotate-90" : "text-ink-muted",
                      ].join(" ")}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Answer panel. aria-live so screen readers announce the change, since
              activating a button elsewhere is what updates this region. */}
          <div
            aria-live="polite"
            className="rounded-lg border border-line bg-surface p-6 max-lg:hidden lg:p-8"
          >
            {selected && (
              <>
                <h3 className="text-lg font-semibold text-ink-strong">{selected.question}</h3>
                <div className="mt-3 h-px w-12 bg-success" />
                <p className="mt-4 text-sm leading-relaxed text-ink">{selected.answer}</p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
