/**
 * The hero code snippet, as markup instead of code.png.
 *
 * It used to be a screenshot set as a background-image, which meant the text was
 * invisible to search engines and screen readers, blurred on high-DPI displays,
 * could not reflow on narrow screens, and needed a graphics editor to change a
 * single word. This renders the same thing with real text.
 *
 * The year is derived rather than typed: the image said "Year2024", which quietly
 * ages the site every January. The build runs nightly, so this stays current on
 * its own.
 */

const t = {
  keyword: "text-[#c678dd]",
  type: "text-[#e5c07b]",
  fn: "text-[#61afef]",
  ident: "text-[#e06c75]",
  punct: "text-[#abb2bf]",
};

export default function CodeCard() {
  const year = new Date().getFullYear();

  const lines = [
    <>
      <span className={t.keyword}>public class</span>{" "}
      <span className={t.type}>Year{year}</span> <span className={t.punct}>{"{"}</span>
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
      <span className={t.type}>Goal</span>
      <span className={t.punct}>.</span>
      <span className={t.fn}>MasteringBusinessIntelligence</span>
      <span className={t.punct}>();</span>
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
      aria-label={`Java snippet: a class named Year${year} whose main method calls Goal.MasteringBusinessIntelligence`}
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
      <pre className="overflow-x-auto px-5 py-5 font-mono text-sm leading-7">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-5">
              <span aria-hidden="true" className="w-4 shrink-0 select-none text-right text-[#4b5263]">
                {i + 1}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </figure>
  );
}
