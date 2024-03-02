import { useState, useEffect } from "react";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";
import "./ProjectForm.css";
import CarouselForm from "./components/caousel-form/CarouselForm";
import CodeSampleForm from "./components/code-sample-form/CodeSampleForm";
import TechsForm from "./components/techs-form/TechsForm";
import ResourcesForm from "./components/resources_form/ResourceForm";
import DataSourcesForm from "./components/data-sources-form/DataSourcesForm";

import axiosInstance from "utils/axios";
import {
  InputComponent,
  FileInputComponent,
  CheckboxComponent,
  ProjectDataComponent,
} from "./components/IndexForm";

export default function ProjectForm() {
  const [popupWindow, setPopupWindow] = useState(null);
  const [codeSamples, setCodeSamples] = useState([]);
  const [carouselSamples, setCarouselSamples] = useState([]);
  const [techs, setTechs] = useState([]);
  const [resources, setResources] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [tags, setTags] = useState(""); // Added tags state
  const [submitButtonText, setSubmitButtonText] = useState("Submit");

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
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate")?formData.get("endDate"):null,
      tools: {
        techs: techs,
        resources: resources,
      },
      dataSources: dataSources,
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
      setSubmitButtonText("Successfully Submitted");
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

  useEffect(() => {
    const handleInputChange = () => {
      setSubmitButtonText("Submit");
    };

    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", handleInputChange);
      });
    };
  }, []);

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
  const handleTechClose = (e, index) => {
    e.preventDefault();
    let temp = [...techs];
    temp.splice(index, 1);
    setTechs(temp);
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
    <TechsForm
      techs={techs}
      setTechs={setTechs}
      setPopupWindow={setPopupWindow}
    />,
    <ResourcesForm
      resources={resources}
      setResources={setResources}
      setPopupWindow={setPopupWindow}
    />,
    <DataSourcesForm
      dataSources={dataSources}
      setDataSources={setDataSources}
      setPopupWindow={setPopupWindow}
    />,
  ];

  return (
    <form onSubmit={handleFormSubmit} className="filldb-form project-form">
      <h1 className="project-form__title">Project</h1>
      <br />

      <div className="input-container">
        <InputComponent name="title" label="Title" />
        <InputComponent name="githubLink" label="Github Link" />
      </div>
      <div className="input-container">
        <InputComponent type="date" name="startDate" label="Start Date" />
        <InputComponent
          type="date"
          name="endDate"
          required={false}
          label="End Date"
        />
      </div>

      <textarea
        className="description"
        type="text"
        name="description"
        required
        placeholder="Write a Brief Description of the Project"
      />

      <FileInputComponent name="image" />
      <br />
      {/* code samples */}
      <ProjectDataComponent
        items={codeSamples}
        setItems={setCodeSamples}
        title="Code Samples"
        formComponent={forms[0]}
        setPopupWindow={setPopupWindow}
      />

      <ProjectDataComponent
        items={carouselSamples}
        setItems={setCarouselSamples}
        title="Carousels"
        formComponent={forms[1]}
        setPopupWindow={setPopupWindow}
      />

      <ProjectDataComponent
        items={techs}
        setItems={setTechs}
        title="Technologies"
        formComponent={forms[2]}
        setPopupWindow={setPopupWindow}
      />

      <ProjectDataComponent
        items={resources}
        setItems={setResources}
        title="Resources"
        formComponent={forms[3]}
        setPopupWindow={setPopupWindow}
      />

      <ProjectDataComponent
        items={dataSources}
        setItems={setDataSources}
        title="Data Sources"
        formComponent={forms[4]}
        setPopupWindow={setPopupWindow}
      />

      {popupWindow}
      <br />
      <br />
      {/* highlighted start or basic  */}
      <CheckboxComponent name="highlighted" />

      <InputComponent
        type="text"
        name="tags"
        className="form__input"
        placeholder=" "
        required
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        label="Tags (separated by comma)"
      />

      <input type="submit" value={submitButtonText} />
    </form>
  );
}

