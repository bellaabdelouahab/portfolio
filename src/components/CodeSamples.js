import hljs from "highlight.js/lib/common";
import { createStarryNight, common } from "@wooorm/starry-night";
import { useEffect,useState } from "react";
import { toHtml } from "hast-util-to-html";
export default function CodeSamples({ codeSample }) {
  const [highlightedCode, setHighlightedCode] = useState(null);
  useEffect(() => {
    const code = async()=>{const starryNight = await createStarryNight(common)
    // const scope = starryNight.flagToScope("markdown");
    const tree = starryNight.highlight(codeSample.code, "source.js");
    setHighlightedCode(toHtml(tree));}
    code();
  }, []);
  const code = codeSample.code;
  // highlightedCode = hljs.highlightAuto(code).value;
  return (
    <section className="project-second-section">
      <h1 className="project-second-section__title">Code Samples</h1>
      <div className="project-second-section__code-samples">
        <div className="project-second-section__code-samples__sample">
          <h2 className="project-second-section__code-samples__sample__title">
            {codeSample.title}
          </h2>
          <div className="project-second-section__code-samples__sample__code">
            <pre>
              <code dangerouslySetInnerHTML={{ __html: highlightedCode?highlightedCode:"Loading" }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
