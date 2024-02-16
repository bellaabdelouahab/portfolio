import React, { useState } from "react";
import axios from "axios";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";
import "./ProjectForm.css";
import CarouselForm from "./caousel-form/CarouselForm";
import CodeSampleForm from "./code-sample-form/CodeSampleForm";
import ToolsForm from "./tools-form/ToolsForm";

export default function ProjectForm() {
  const [popupWindow, setPopupWindow] = useState(null);
  const [codeSamples, setCodeSamples] = useState([]);
  const [carouselSamples, setCarouselSamples] = useState([]);
  const [tools, setTools] = useState([]);
  // const [collaborators, setCollaborators] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
      githubLink: e.target.githubLink.value,
      image: null,
      codeSamples: codeSamples,
      carouselImages: [],
      startDate: startDate,
      endDate: endDate,
      tools: tools,
      highlighted: e.target.highlighted.checked ? "star" : "basic",
    };
    const imageinput = e.target.image;
    const image = imageinput.files[0];
    const reader = new FileReader();
    const filereaders = [];

    reader.addEventListener("load", () => {
      data.image = reader.result;
    });
    reader.readAsDataURL(image);

    for (let i = 0; i < carouselSamples.length; i++) {
      const element = carouselSamples[i];
      filereaders.push(new FileReader());
      filereaders[i].addEventListener("load", () => {
        data.carouselImages.push({
          img: filereaders[i].result,
          title: carouselSamples[i].title,
        });
        if (i === carouselSamples.length - 1) {
          axios
            .post("http://localhost:5000/api/projects", data)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
      filereaders[i].readAsDataURL(element.img[0]);
    }

    window.addEventListener("load", () => {
      console.log(data.carousels);
    });
  };

  // code samples functions
  const handleCodeSampleClose = (e, index) => {
    e.preventDefault();
    let temp = [...codeSamples];
    temp.splice(index, 1);
    setCodeSamples(temp);
    explode();
  };
  // carousel functions
  const handleCarouselClose = (e, index) => {
    e.preventDefault();
    let temp = [...carouselSamples];
    temp.splice(index, 1);
    setCarouselSamples(temp);
    explode();
  };
  // tools functions
  const handleToolClose = (e, index) => {
    e.preventDefault();
    let temp = [...tools];
    temp.splice(index, 1);
    setTools(temp);
    explode();
  };

  const forms = [
    <CodeSampleForm
      codeSamples={codeSamples}
      setCodeSamples={setCodeSamples}
      setPopupWindow={setPopupWindow}
    />,
    <CarouselForm
      carouselSamples={carouselSamples}
      setCarouselSamples={setCarouselSamples}
      setPopupWindow={setPopupWindow}
    />,
    <ToolsForm
      tools={tools}
      setTools={setTools}
      setPopupWindow={setPopupWindow}
    />,
    // Add more buttons here if needed
  ];

  return (
    <form onSubmit={handleFormSubmit} className="filldb-form project-form">
      <h1 className="project-form__title">Project</h1>
      <br />

      <div className="input-container">
        <div className="input-flow">
          <input
            type="text"
            name="title"
            className="form__input"
            placeholder=" "
          />
          <label className="form__label">Title</label>
        </div>
        <div className="input-flow">
          <input
            type="text"
            name="githubLink"
            className="form__input"
            placeholder=" "
          />
          <label className="form__label">Github Link</label>
        </div>
      </div>
      <br />
      <div className="input-container">
        <div className="input-flow">
          <input
            type="date"
            name="startDate"
            className="form__input"
            placeholder=" "
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="form__label">Start Date</label>
        </div>
        <div className="input-flow">
          <input
            type="date"
            name="endDate"
            className="form__input"
            placeholder=" "
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <label className="form__label">End Date</label>
        </div>
      </div>
      <br />

      <textarea
        className="description"
        type="text"
        name="description"
        placeholder="Write a Brief Description of the Project"
      />
      <br />

      <input type="file" name="image" />
      <br />
      {/* code samples */}
      <div className="input-container">
        <h2 className="title">Code Samples</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Code"
          onClick={() => {
            setPopupWindow(forms[0]);
          }}
        />
      </div>
      {codeSamples.length > 0 && (
        <div className="code-samples h-list">
          {codeSamples.map((codeSample, index) => (
            <li key={index} className="tab tabSelected">
              <button className="btn title">{codeSample.title}</button>
              <button
                className="btn closeTab"
                onClick={(e) => handleCodeSampleClose(e, index)}
              >
                ✕
              </button>
            </li>
          ))}
        </div>
      )}
      <br />
      <br />

      <div className="input-container">
        <h2 className="title">Carousels</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Carousel"
          onClick={() => {
            setPopupWindow(forms[1]);
          }}
        />
      </div>
      {carouselSamples.length > 0 && (
        <div className="code-samples h-list">
          {carouselSamples.map((carouselSample, index) => (
            <li key={index} className="tab tabSelected">
              <button className="btn title">{carouselSample.title}</button>
              <button
                className="btn closeTab"
                onClick={(e) => handleCarouselClose(e, index)}
              >
                ✕
              </button>
            </li>
          ))}
        </div>
      )}
      <br />
      <br />
      {/* tools */}
      <div className="input-container">
        <h2 className="title">Tools</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Tool"
          onClick={() => {
            setPopupWindow(forms[2]);
          }}
        />
      </div>
      {tools.length && (
        <div className="code-samples h-list">
          {tools.map((tool, index) => (
            <li key={index} className="tab tabSelected">
              <button className="btn title" title="View Code">
                {tool.title}
              </button>
              <button
                className="btn closeTab"
                onClick={(e) => handleToolClose(e, index)}
              >
                ✕
              </button>
            </li>
          ))}
        </div>
      )}

      {popupWindow}

      <br />
      <br />
      {/* highlighted start or basic  */}
      <div className="input-container">
        <div className="input-flow">
          <input type="checkbox" name="highlighted" />
          <label className="form__label">Highlighted</label>
        </div>
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
}
