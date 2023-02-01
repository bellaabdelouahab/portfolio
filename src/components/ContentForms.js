import { useState } from "react";
import axios from "axios";

import "../assets/css/codesample.css";
import explode from "../assets/js/codesamples.js";

function ProjectForm() {
  const [codeSamples, setCodeSamples] = useState([]);
  const [carousels, setCarousels] = useState([""]);
  const [codeSampleWindow, setCodeSampleWindow] = useState(false);
  const [carouselleWindow, setCarouselleWindow] = useState(false);
  const [carouselSamples, setCarouselSamples] = useState([]);

  var codeSamplePreviewIndex = false;
  var carousellePreviewIndex = false;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        var data = {};
        data["title"] = e.target.title.value;
        data["description"] = e.target.description.value;
        data["githubLink"] = e.target.githubLink.value;
        data["codeSamples"] = codeSamples;
        data["carousels"] = carousels;
        const imageinput = e.target.image;
        const image = imageinput.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          data["image"] = reader.result;
          console.log(data);
          axios
            .post("http://localhost:5000/api/projects", data, {
              withCredentials: true,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        reader.readAsDataURL(image);
      }}
      className="project-form filldb-form"
    >
      <h1 className="project-form__title">Project</h1>
      <br />
      <div className="input-container">
        <div className="input-flow">
          <input type="text" name="title" className="form__input" placeholder=" "/>
          <label className="form__label" for="title">Title</label>
        </div>
        <input type="text" name="githubLink" placeholder="Github Link" />
      </div>
      <textarea
        className="description"
        type="text"
        name="description"
        placeholder="description"
      />

      <input type="file" name="image" placeholder="image" />
      <br />

      {/* // for code samples */}

      <div className="input-container">
        <h2 className="code-samples-title">Code Samples</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Code"
          onClick={(e) => {
            setCodeSampleWindow(true);
          }}
        />
      </div>
      <div
        className="code-samples h-list"
        style={
          codeSamples.length === 0 ? { display: "none" } : { display: "flex" }
        }
      >
        {/* <ul className='h-list'> */}
        {codeSamples.map((codeSample, index) => {
          return (
            <li key={index} className="tab tabSelected">
              <button
                className="btn title"
                title="View Code"
                onClick={(e) => {
                  setCodeSampleWindow(true);
                  codeSamplePreviewIndex = index;
                }}
              >
                {codeSample.title}
              </button>
              <button
                className="btn closeTab"
                onClick={(e) => {
                  e.preventDefault();
                  let temp = [...codeSamples];
                  temp.splice(index, 1);
                  setCodeSamples(temp);
                  explode();
                }}
              >
                ✕
              </button>
            </li>
          );
        })}
      </div>
      <br />
      <br />

      {/* // for carousels */}
      <div className="input-container">
        <h2 className="code-samples-title">Carousels</h2>
        <input
          type="button"
          className="add-code-sample"
          value="Add Carousel"
          onClick={(e) => {
            setCarouselleWindow(true);
          }}
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
        {/* <ul className='h-list'> */}
        {carouselSamples.map((carouselSample, index) => {
          return (
            <li key={index} className="tab tabSelected">
              <button
                className="btn title"
                title="View Code"
                onClick={(e) => {
                  setCarouselleWindow(true);
                  carousellePreviewIndex = index;
                }}
              >
                {carouselSample.title}
              </button>
              <button
                className="btn closeTab"
                onClick={(e) => {
                  e.preventDefault();
                  let temp = [...carouselSamples];
                  temp.splice(index, 1);
                  setCarouselSamples(temp);
                  explode();
                }}
              >
                ✕
              </button>
            </li>
          );
        })}
      </div>
      <br />
      <br />

      <input type="submit" value="Submit" />

      {codeSampleWindow && (
        <div className="code-sample-container">
          <div className="code-sample">
            <p
              onClick={(e) => {
                setCodeSampleWindow(false);
              }}
            >
              X
            </p>
            <input
              type="text"
              className="codeSampleTitle"
              name="codeSampleTitle"
              placeholder="Code Sample Title"
            />
            <textarea
              type="text"
              className="codeSample-code"
              name="codeSample"
              placeholder="Code Sample"
            />
            <button
              onClick={(e) => {
                let temp = [...codeSamples];
                temp.push({
                  title: document.querySelector(".codeSampleTitle").value,
                  code: document.querySelector(".codeSample-code").value,
                });
                setCodeSamples(temp);
                setCodeSampleWindow(false);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* // for caroussel add window */}
      {carouselleWindow && (
        <div className="code-sample-container">
          <div className="code-sample">
            <p
              onClick={(e) => {
                setCarouselleWindow(false);
              }}
            >
              X
            </p>
            <input
              type="text"
              className="carouselSampleTitle"
              name="carouselSampleTitle"
              placeholder="carousel Sample Title"
            />

            <input
              type="file"
              className="image_carussel"
              accept="image/jpeg,image/jpg,image/png"
              name="image"
            />

            <button
              onClick={(e) => {
                let temp = [...carouselSamples];
                temp.push({
                  title: document.querySelector(".carouselSampleTitle").value,
                  code: document.querySelector(".image_carussel").files,
                });
                setCarouselSamples(temp);
                setCarouselleWindow(false);
                console.log(temp);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

function SkillForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        var data = {};
        data["title"] = e.target.title.value;
        data["description"] = e.target.description.value;
        const imageinput = e.target.roadmapImage;
        const image = imageinput.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          data["roadmapImage"] = reader.result;
          console.log(data);
          axios
            .post("http://localhost:5000/api/skills", data)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        reader.readAsDataURL(image);
      }}
      className="skill-form filldb-form"
    >
      <input type="text" name="title" placeholder="title" />
      <input type="text" name="description" placeholder="description" />
      <input type="file" name="roadmapImage" placeholder="roadmapImage" />
      <input type="submit" value="Submit" />
    </form>
  );
}

function ReportForm() {
  return (
    <form
      className="report-form filldb-form"
      onSubmit={(e) => {
        e.preventDefault();
        var data = {};
        data["title"] = e.target.title.value;
        data["description"] = e.target.description.value;
        const reportFileinput = e.target.reportFile;
        const reportFile = reportFileinput.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          data["reportFile"] = reader.result;
          console.log(data);
          axios
            .post("http://localhost:5000/api/reports", data)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        reader.readAsDataURL(reportFile);
      }}
    >
      <input type="text" name="title" placeholder="title" />
      <input type="text" name="description" placeholder="description" />
      <input type="file" name="reportFile" placeholder="image" />
      <input type="submit" value="Submit" />
    </form>
  );
}

export { ProjectForm, SkillForm, ReportForm };
