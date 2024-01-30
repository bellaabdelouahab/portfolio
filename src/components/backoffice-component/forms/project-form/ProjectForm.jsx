import React, { useState } from "react";
import axios from "axios";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";
import "./ProjectForm.css";
import CarouselForm from "../caousel-form/CarouselForm";
import CodeSampleForm from "../code-sample-form/CodeSampleForm";

export default function ProjectForm() {
  const [popUpWindow, setPopUpWindow] = useState(false);
  const [codeSamples, setCodeSamples] = useState([]);
  const [carouselSamples, setCarouselSamples] = useState([]);
  const [tools, setTools] = useState([]);
  // const [collaborators, setCollaborators] = useState([]);
  // const[collaboratorsWindow, setCollaboratorsWindow] = useState(false);

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

  // code sample handlers
  const handleAddCodeSample = () => {
    setCodeSampleWindow(true);
  };

  const handleCodeSampleSubmit = () => {
    let temp = [...codeSamples];
    temp.push({
      title: document.querySelector(".codeSampleTitle").value,
      code: document.querySelector(".codeSample-code").value,
      language: document.querySelector(".codeSample-language").value,
    });
    setCodeSamples(temp);
    setCodeSampleWindow(false);
  };

  const handleCodeSampleClose = (e, index) => {
    e.preventDefault();
    let temp = [...codeSamples];
    temp.splice(index, 1);
    setCodeSamples(temp);
    explode();
  };

  // carousel handlers
  const handleAddCarousel = () => {
    setCarouselleWindow(true);
  };

  const handleCarouselSubmit = () => {
    let temp = [...carouselSamples];
    temp.push({
      title: document.querySelector(".carouselSampleTitle").value,
      img: document.querySelector(".image_carussel").files,
    });
    setCarouselSamples(temp);
    setCarouselleWindow(false);
    console.log(temp);
  };

  const handleCarouselClose = (e, index) => {
    e.preventDefault();
    let temp = [...carouselSamples];
    temp.splice(index, 1);
    setCarouselSamples(temp);
    explode();
  };

  // tool handlers
  const handleAddTool = () => {
    setToolWindow(true);
  };
  const handleToolSubmit = () => {
    let temp = [...tools];
    temp.push({
      title: document.querySelector(".toolTitle").value,
      description: document.querySelector(".toolDescription").value,
    });
    setTools(temp);
    setToolWindow(false);
    console.log(temp);
  };
  const handleToolClose = (e, index) => {
    e.preventDefault();
    let temp = [...tools];
    temp.splice(index, 1);
    setTools(temp);
    explode();
  };

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
          <label className="form__label" htmlFor="title">
            Title
          </label>
        </div>
        <div className="input-flow">
          <input
            type="text"
            name="githubLink"
            className="form__input"
            placeholder=" "
          />
          <label className="form__label" htmlFor="gitlink">
            Github Link
          </label>
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
          <label className="form__label" htmlFor="startDate">
            Start Date
          </label>
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
          <label className="form__label" htmlFor="endDate">
            End Date
          </label>
        </div>
      </div>
      <br />

      <textarea
        className="description"
        type="text"
        name="description"
        placeholder="description"
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
          onClick={handleAddCodeSample}
        />
      </div>
      <div
        className="code-samples h-list"
        style={
          codeSamples.length === 0 ? { display: "none" } : { display: "flex" }
        }
      >
        {codeSamples.map((codeSample, index) => (
          <li key={index} className="tab tabSelected">
            <button className="btn title" title="View Code">
              {codeSample.title}
            </button>
            <button
              className="btn closeTab"
              onClick={(e) => handleCodeSampleClose(e, index)}
            >
              ✕
            </button>
          </li>
        ))}
      </div>
      <br />
      <br />
      {/* carousels */}
      <div className="input-container">
        <h2 className="title">Carousels</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Carousel"
          onClick={handleAddCarousel}
        />
      </div>
      <div
        className="code-samples h-list"
        style={
          carouselSamples.length === 0
            ? { display: "none" }
            : { display: "flex" }
        }
      >
        {carouselSamples.map((carouselSample, index) => (
          <li key={index} className="tab tabSelected">
            <button className="btn title" title="View Code">
              {carouselSample.title}
            </button>
            <button
              className="btn closeTab"
              onClick={(e) => handleCarouselClose(e, index)}
            >
              ✕
            </button>
          </li>
        ))}
      </div>
      <br />
      <br />
      {/* tools */}
      <div className="input-container">
        <h2 className="title">Tools</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Tool"
          onClick={handleAddTool}
        />
      </div>
      <div
        className="code-samples h-list"
        style={tools.length === 0 ? { display: "none" } : { display: "flex" }}
      >
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

      {popUpWindow && (
        <CodeSampleForm
          setCodeSampleWindow={setCodeSampleWindow}
          handleCodeSampleSubmit={handleCodeSampleSubmit}
        />
      )}

      {carouselleWindow && (
        <CarouselForm
          setCarouselleWindow={setCarouselleWindow}
          handleCarouselSubmit={handleCarouselSubmit}
        />
      )}

      {toolWindow && (
        <div className="popup-container">
          <div className="popup">
            <p onClick={() => setToolWindow(false)}>X</p>
            <input
              type="text"
              className="toolTitle"
              name="toolTitle"
              placeholder="Tool Title"
            />
            <br />
            <textarea
              type="text"
              className="toolDescription"
              name="toolDescription"
              placeholder="Tool Description"
            />
            <button onClick={handleToolSubmit}>Submit</button>
          </div>
        </div>
      )}

      <br />
      <br />
      {/* highlighted start or basic  */}
      <div className="input-container">
        <div className="input-flow">
          <input
            type="checkbox"
            name="highlighted"
            className="form__input"
            placeholder=" "
          />
          <label className="form__label" htmlFor="highlighted">
            Highlighted
          </label>
        </div>
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
}
