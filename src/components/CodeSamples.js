import hljs from "highlight.js/lib/common";

export default function CodeSamples({ code }) {
  const highlightedCode = hljs.highlightAuto(code).value;
  return (
    <section className="project-second-section">
      <h1 className="project-second-section__title">Code Samples</h1>
      <div className="project-second-section__code-samples">
        <div className="project-second-section__code-samples__sample">
          <h2 className="project-second-section__code-samples__sample__title">
            Code Sample 1
          </h2>
          <div className="project-second-section__code-samples__sample__code">
            <pre>
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
