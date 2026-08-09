import { useState } from "react";
import { Helmet } from "react-helmet";
import { faqData } from "../../homeContent";

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
export default function FAQSection() {
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
          Frequently Asked Questions
        </div>

        <div className="mx-auto grid w-full max-w-8xl gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,.7fr)] lg:items-start mb-5">
          {/* Question list */}
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
            {faqData.map((item) => {
              const isSelected = item.id === selected?.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={isSelected}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-lg border p-4 text-left",
                      "transition-colors duration-200 cursor-pointer",
                      isSelected
                        ? "border-success/60 bg-surface text-ink-strong"
                        : "border-line bg-surface/40 text-ink hover:border-success/40 hover:bg-surface",
                    ].join(" ")}
                  >
                    <span className="text-sm font-medium leading-snug">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={[
                        "grid size-6 shrink-0 place-items-center rounded-full text-base leading-none",
                        isSelected ? "bg-success text-page" : "bg-success/15 text-success",
                      ].join(" ")}
                    >
                      {isSelected ? "−" : "+"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Answer panel. aria-live so screen readers announce the change, since
              activating a button elsewhere is what updates this region. */}
          <div
            aria-live="polite"
            className="rounded-lg border border-line bg-surface p-6 lg:sticky lg:top-24 lg:min-h-64"
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
