import { useEffect, useState } from "react";
import { toHtml } from "hast-util-to-html";
// Syntax colours follow the site theme. The token rules come from the package
// (bundled, no CDN); only the variable blocks are re-scoped: dark values are the
// default, light values apply under html[data-theme="light"].
import coreCss from "@wooorm/starry-night/style/core.css?inline";
import darkCss from "@wooorm/starry-night/style/dark.css?inline";
import lightCss from "@wooorm/starry-night/style/light.css?inline";

const vars = (css) => css.match(/:root\s*\{[^}]*\}/)?.[0].replace(":root", "") ?? "";
const HIGHLIGHT_CSS = `${coreCss}\n:root${vars(darkCss)}\nhtml[data-theme="light"]${vars(lightCss)}`;

export default function CodeSamples({ codeSamples }) {
  if (!codeSamples || codeSamples.length === 0) return null;
  return (
    // z-[1] keeps this above the starfield overlay mounted on .project-page.
    <section className="relative z-[1] mt-[2vh] flex w-full flex-col items-center justify-center bg-main pb-[2vh]">
      <style>{HIGHLIGHT_CSS}</style>
      {/* tracking needs ! — global.css has an unlayered h1..h5
          letter-spacing:1px that outranks the utilities layer. */}
      <h1 className="mt-[3vh] mb-0 text-base font-bold tracking-[-0.01em]! text-ink-strong md:text-lg">
        Code Samples
      </h1>
      <div className="mt-[2.5vh] mb-[2vh] flex w-[92%] max-w-[1400px] flex-col items-center justify-center gap-4 rounded-lg bg-transparent md:w-[88%]">
        {codeSamples.map((elem, index) => {
          return <CodeSample key={index} codeSample={elem} />;
        })}
      </div>
    </section>
  );
}

export function CodeSample({ codeSample }) {
  const [highlightedCode, setHighlightedCode] = useState(null);
  useEffect(() => {
    const code = async () => {
      // About 1 MB of grammars: loaded only when a project actually has code.
      const { createStarryNight, common } = await import("@wooorm/starry-night");
      const starryNight = await createStarryNight(common);
      const tree = starryNight.highlight(codeSample.code, codeSample.language);
      setHighlightedCode(toHtml(tree));
    };
    code();
  }, [codeSample]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-success/20 bg-surface transition-colors duration-200 ease-standard hover:border-success">
      <div className="h-full w-full">
        <h2 className="w-full border-b border-success/20 bg-surface-raised px-3 py-2 text-xs leading-normal font-semibold text-ink-strong md:px-4 md:py-2.5">
          {codeSample.title}
        </h2>
        {/* overflow-x-auto on the wrapper, not the <pre>: the highlighted
            markup from starry-night is injected inside the <pre>, which keeps
            white-space:pre and overflows this box horizontally. */}
        <div className="w-full overflow-x-auto bg-rail p-3 font-mono text-xs leading-relaxed text-ink-strong md:p-4">
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: highlightedCode ? highlightedCode : "Loading",
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
