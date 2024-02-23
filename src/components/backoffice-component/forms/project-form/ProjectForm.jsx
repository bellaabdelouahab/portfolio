import { useState } from "react";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";
import "./ProjectForm.css";
import CarouselForm from "./caousel-form/CarouselForm";
import CodeSampleForm from "./code-sample-form/CodeSampleForm";
import ToolsForm from "./tools-form/ToolsForm";
import axiosInstance from "utils/axios";

export default function ProjectForm() {
  const [popupWindow, setPopupWindow] = useState(null);
  const [codeSamples, setCodeSamples] = useState([]);
  const [carouselSamples, setCarouselSamples] = useState([]);
  const [tools, setTools] = useState([]);
  const [tags, setTags] = useState(""); // Added tags state

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const image = formData.get("image");

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      githubLink: formData.get("githubLink"),
      image: null,
      codeSamples: codeSamples,
      carouselImages: [],
      startDate: startDate,
      endDate: endDate,
      tools: tools,
      highlighted: formData.get("highlighted") === "on" ? "star" : "basic",
      tags: tags.split(",").map((tag) => tag.trim()), // Added tags field
    };

    if (image) {
      data.image = await convertImageToBase64(image);
    }

    for (let i = 0; i < carouselSamples.length; i++) {
      const element = carouselSamples[i];
      const carouselImage = await convertImageToBase64(element.img[0]);
      data.carouselImages.push({
        img: carouselImage,
        title: element.title,
      });
    }

    try {
      const response = await axiosInstance.post("projects", data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
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
            required
          />
          <label className="form__label">Title</label>
        </div>
        <div className="input-flow">
          <input
            type="text"
            name="githubLink"
            className="form__input"
            placeholder=" "
            required
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
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="form__label">Start Date</label>
        </div>
        <div className="input-flow">
          <input
            type="date"
            name="endDate"
            placeholder=" "
            className="form__input"
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
        required
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

      <div className="input-container">
        <div className="input-flow">
          <input
            type="text"
            name="tags"
            className="form__input"
            placeholder=" "
            required
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <label className="form__label">Tags (separated by comma)</label>
        </div>
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
}
