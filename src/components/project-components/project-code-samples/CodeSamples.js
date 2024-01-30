import { createStarryNight, common } from "@wooorm/starry-night";
import { useEffect,useState } from "react";
import { toHtml } from "hast-util-to-html";



export default function CodeSamples({ codeSamples }){
  console.log("-------"+codeSamples.length);
  return (

    <section className="code-samples-section">
    {
     codeSamples &&
       codeSamples.length > 0 &&
       codeSamples.map((codeSample, index) => {
         return <CodeSample key={index} codeSample={codeSample} />;
       })
   }
    </section>
  )

}


export function CodeSample({ codeSample }) {
  const [highlightedCode, setHighlightedCode] = useState(null);
  useEffect(() => {
    const code = async()=>{const starryNight = await createStarryNight(common)
    // const scope = starryNight.flagToScope("markdown");
      const tree = starryNight.highlight(`@media screen and (max-width: 4000px) {
  
  .navbar__menu__list > li > a.active::after {
    /* background: rgb(38, 43, 69);
    border-radius: 5px; */
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
    background: #d91706a3;
    

  }
}
`, "source.css");
    setHighlightedCode(toHtml(tree));
      console.log(starryNight.scopes())
    console.log(toHtml(tree));
  }
    code();
  }, []);
  const code = codeSample.code;
  // highlightedCode = hljs.highlightAuto(code).value;
  return (
      <>
      <link rel="stylesheet" href="https://esm.sh/@wooorm/starry-night@1/style/both.css"/>
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
      </>
  );
}
