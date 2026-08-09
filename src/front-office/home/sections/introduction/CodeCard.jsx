/**
 * The hero code snippet, as markup instead of code.png.
 *
 * It used to be a screenshot set as a background-image, which meant the text was
 * invisible to search engines and screen readers, blurred on high-DPI displays,
 * could not reflow on narrow screens, and needed a graphics editor to change a
 * single word. This renders the same thing with real text.
 *
 * The content used to be a one-line personal goal (`Goal.MasteringDataAnalitics()`)
 * — a nice piece of developer flavour, but a visitor's first few seconds on the
 * page told them nothing about what they'd actually be hiring. Listing the real
 * services here instead means the eye-catching hero element IS the pitch, not
 * decoration next to it.
 *
 * The year is derived rather than typed: the image this replaced said "Year2024",
 * which quietly ages the site every January. The build runs nightly, so the
 * version comment stays current on its own.
 */

const t = {
  comment: "text-[#5c6370] italic",
  keyword: "text-[#c678dd]",
  type: "text-[#e5c07b]",
  fn: "text-[#61afef]",
  ident: "text-[#e06c75]",
  str: "text-[#98c379]",
  punct: "text-[#abb2bf]",
};

// Order and wording are deliberate: shortest, most concrete label first is
// what a code snippet reads best with, and this is the priority order the
// user asked for — full-stack dev, data analytics, then digital adoption
// (DAP is the industry shorthand for Digital Adoption Platform work).
const SERVICES = ["Full-Stack Dev", "Data Analytics", "DAP Consulting"];

export default function CodeCard() {

  // One line for the whole call rather than one argument per line — keeps
  // the card short instead of growing a line per service every time one
  // gets added.
  const lines = [
    <>
      <span className={t.keyword}>public class</span>{" "}
      <span className={t.type}>MyServices</span>{" "}
      <span className={t.punct}>{"{"}</span>
    </>,
    <>
      {"  "}
      <span className={t.keyword}>public static void</span>{" "}
      <span className={t.fn}>main</span>
      <span className={t.punct}>(</span>
      <span className={t.type}>String[]</span>{" "}
      <span className={`${t.ident} italic`}>args</span>
      <span className={t.punct}>) {"{"}</span>
    </>,
    <>
      {"    "}
      <span className={t.type}>Services</span>
      <span className={t.punct}>.</span>
      <span className={t.fn}>offer</span>
      <span className={t.punct}>(</span>
      {SERVICES.map((service, i) => (
        <span key={service}>
          <span className={t.str}>{`"${service}"`}</span>
          {i < SERVICES.length - 1 && <span className={t.punct}>{", "}</span>}
        </span>
      ))}
      <span className={t.punct}>);</span>
    </>,
    <>
      {"  "}
      <span className={t.punct}>{"}"}</span>
    </>,
    <>
      <span className={t.punct}>{"}"}</span>
    </>,
  ];

  return (
    <figure
      aria-label={`Java snippet: a class named MyServices whose main method calls Services.offer with ${SERVICES.join(", ")}`}
      className="w-full max-w-2xl overflow-hidden rounded-lg border border-line bg-[#282c34] shadow-lg"
    >
      {/* Window chrome. Decorative, so hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className="flex h-11 items-center gap-2 border-b border-black/30 bg-black/20 px-4"
      >
        <span className="block size-3 rounded-full bg-[#ff5f56]" />
        <span className="block size-3 rounded-full bg-[#ffbd2e]" />
        <span className="block size-3 rounded-full bg-[#27c93f]" />
      </div>

      {/* leading-7 explicitly: the global reset sets body { line-height: 1 }, which
          otherwise collapses the lines into an unreadable block. */}
      {/* pre-wrap, not pre: the services line is one long call rather than one
          argument per line, and on a narrow phone that line is wider than the
          card. pre kept it on a single physical line and relied on
          overflow-x-auto to scroll — invisible on a screenshot and, worse, on
          a real phone too: nothing hints there's more to the right, so it
          just looks cut off. pre-wrap only wraps when a line doesn't fit,
          which every other (short) line never does. */}
      <pre className="overflow-x-auto px-5 py-5 font-mono text-sm leading-7">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-5">
              <span aria-hidden="true" className="w-4 shrink-0 select-none text-right text-[#4b5263]">
                {i + 1}
              </span>
              <span className="whitespace-pre-wrap wrap-break-word">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </figure>
  );
}
