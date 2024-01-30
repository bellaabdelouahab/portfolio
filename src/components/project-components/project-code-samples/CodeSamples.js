import { createStarryNight, common } from "@wooorm/starry-night";
import { useEffect, useState } from "react";
import { toHtml } from "hast-util-to-html";



export default function CodeSamples({ codeSamples }) {
  if (!codeSamples || codeSamples.length === 0) return null;
  return (

    <section className="code-samples-section">
      {
        codeSamples.map((elem, index) => {
          return <CodeSample key={index} codeSample={elem} />;
        })
      }
    </section>
  )

}


export function CodeSample({ codeSample }) {
  const [highlightedCode, setHighlightedCode] = useState(null);
  useEffect(() => {
    const code = async () => {
      const starryNight = await createStarryNight(common)
      // const scope = starryNight.flagToScope("markdown");
      const tree = starryNight.highlight(codeSample.code, codeSample.language);
      setHighlightedCode(toHtml(tree));
      console.log(starryNight.scopes())
      console.log(toHtml(tree));
    }
    code();
  }, []);
  return (
    <>
      <link rel="stylesheet" href="https://esm.sh/@wooorm/starry-night@1/style/both.css" />
      <h1 className="project-second-section__title">Code Samples</h1>
      <div className="project-second-section__code-samples">
        <div className="project-second-section__code-samples__sample">
          <h2 className="project-second-section__code-samples__sample__title">
            {codeSample.title}
          </h2>
          <div className="project-second-section__code-samples__sample__code">
            <pre>
              <code dangerouslySetInnerHTML={{ __html: highlightedCode ? highlightedCode : "Loading" }} />
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
