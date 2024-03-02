import "./CodeSampleForm.css";
import { createStarryNight, common } from "@wooorm/starry-night";
import { useState, useEffect } from "react";

export default function CodeSampleForm({
  codeSamples,
  setCodeSamples,
  setPopupWindow,
}) {
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    const fillScopes = async () => {
      const starryNight = await createStarryNight(common);
      const scopes = starryNight.scopes();
      setScopes(scopes);
    };
    fillScopes();
  }, []);

  const handleCodeSampleSubmit = () => {
    let temp = [...codeSamples];
    temp.push({
      title: document.querySelector(".codeSampleTitle").value,
      code: document.querySelector(".codeSample-code").value,
      language: document.querySelector(".codeSample-language").value,
    });
    setCodeSamples(temp);
    setPopupWindow(null);
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <p onClick={() => setPopupWindow(null)}>X</p>
        <input
          type="text"
          className="codeSampleTitle"
          name="codeSampleTitle"
          placeholder="Code Sample Title"
        />
        <br />
        {/* input seslect to select the language from stary night languages */}
        <select name="language" id="language" className="codeSample-language">
          {scopes.map((scope,index) => (
            <option key={index} value={scope}>{scope}</option>
          ))}
        </select>

        <textarea
          type="text"
          className="codeSample-code"
          name="codeSample"
          placeholder="Code Sample"
        />
        <button onClick={handleCodeSampleSubmit}>Submit</button>
      </div>
    </div>
  );
}
