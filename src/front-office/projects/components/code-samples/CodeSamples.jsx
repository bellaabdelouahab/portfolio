import { createStarryNight, common } from "@wooorm/starry-night";
import { useEffect, useState } from "react";
import { toHtml } from "hast-util-to-html";

export default function CodeSamples({ codeSamples }) {
  if (!codeSamples || codeSamples.length === 0) return null;
  return (
    // z-[1] keeps this above the starfield overlay mounted on .project-page.
    <section className="relative z-[1] mt-[2vh] flex w-full flex-col items-center justify-center bg-[#1a1c1f] pb-[2vh]">
      <link
        rel="stylesheet"
        href="https://esm.sh/@wooorm/starry-night@1/style/both.css"
      />
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
      const starryNight = await createStarryNight(common);
      const tree = starryNight.highlight(codeSample.code, codeSample.language);
      setHighlightedCode(toHtml(tree));
    };
    code();
  }, [codeSample]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-[#2db811]/20 bg-[#212429] transition-colors duration-200 ease-standard hover:border-[#2db811]">
      <div className="h-full w-full">
        <h2 className="w-full border-b border-[#2db811]/20 bg-[#262a30] px-3 py-2 text-xs leading-normal font-semibold text-ink-strong md:px-4 md:py-2.5">
          {codeSample.title}
        </h2>
        {/* overflow-x-auto on the wrapper, not the <pre>: the highlighted
            markup from starry-night is injected inside the <pre>, which keeps
            white-space:pre and overflows this box horizontally. */}
        <div className="w-full overflow-x-auto bg-[#16181c] p-3 font-mono text-xs leading-relaxed text-[#e5e7eb] md:p-4">
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
