import { useState, useEffect } from "react";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";
import "./ProjectForm.css";
import CarouselForm from "./components/caousel-form/CarouselForm";
import CodeSampleForm from "./components/code-sample-form/CodeSampleForm";
import TechsForm from "./components/techs-form/TechsForm";
import ResourcesForm from "./components/resources_form/ResourceForm";
import DataSourcesForm from "./components/data-sources-form/DataSourcesForm";
import TagInput from "./components/tag-input/TagInput";

// Import Firebase related functions
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { v4 as uuidv4 } from 'uuid';

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
  const [tags, setTags] = useState([]); // Change tags state to an array
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState("");
  
  // GitHub commit related states
  const [commitStatus, setCommitStatus] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  // GitHub repo details - hardcoded for this implementation
  const githubDetails = {
    owner: "bellaabdelouahab",
    repo: "portfolio",
    branch: "master", // Note: using master branch as per the repo URL
    baseImagePath: "public/images/projects/",
    token: localStorage.getItem("githubToken") || "" // Get token from localStorage if available
  };

  // Function to convert file to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract the base64 data (remove the data:image/xxx;base64, prefix)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to commit a file to GitHub
  const commitFileToGithub = async (file, filePath, commitMessage) => {
    if (!file || !githubDetails.token) {
      throw new Error("Missing file or GitHub token");
    }

    try {
      // Convert file to base64
      const base64Content = await getBase64(file);
      
      // Check if file already exists to get its SHA (needed for updates)
      let fileSha = null;
      try {
        const checkResponse = await fetch(
          `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}?ref=${githubDetails.branch}`,
          {
            headers: {
              Authorization: `token ${githubDetails.token}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );
        
        if (checkResponse.status === 200) {
          const fileData = await checkResponse.json();
          fileSha = fileData.sha;
        }
      } catch (error) {
        // File doesn't exist, which is fine for creating new files
        console.log(`File does not exist yet: ${filePath}`);
      }

      // Prepare commit payload
      const commitData = {
        message: commitMessage,
        content: base64Content,
        branch: githubDetails.branch
      };

      // If we're updating an existing file, include the SHA
      if (fileSha) {
        commitData.sha = fileSha;
      }

      // Make the commit
      const response = await fetch(
        `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${githubDetails.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commitData)
        }
      );

      const responseData = await response.json();

      if (response.status === 200 || response.status === 201) {
        return responseData;
      } else {
        throw new Error(`GitHub API Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error committing to GitHub:', error);
      throw error;
    }
  };

  // Function to commit all project images to GitHub
  const commitProjectImages = async (
    mainImage,
    mainImageName,
    carouselImages,
    carouselImageNames,
    newProjectId
  ) => {
    setIsCommitting(true);
    setCommitStatus("Starting to commit images to GitHub...");

    try {
      const basePath = githubDetails.baseImagePath + newProjectId;
      const carouselPath = `${basePath}/carousel`;

      // Create arrays to track all commits
      const commitPromises = [];

      // Commit main image
      if (mainImage) {
        const timestamp = Date.now();
        const mainImagePath = `${basePath}/${mainImageName}`;

        setCommitStatus(`Committing main image: ${mainImageName}`);

        const mainImagePromise = commitFileToGithub(
          mainImage,
          mainImagePath,
          `Add project main image: ${mainImageName}`
        );

        commitPromises.push(mainImagePromise);
      }

      // Commit carousel images
      for (let i = 0; i < carouselImages.length; i++) {
        const carouselItem = carouselImages[i];
        if (carouselItem.img && carouselItem.img[0]) {
          const carouselImageName = carouselImageNames[i];
          const carouselImagePath = `${carouselPath}/${carouselImageName}`;

          setCommitStatus(
            `Committing carousel image ${i + 1}/${
              carouselImages.length
            }: ${carouselImageName}`
          );

          const carouselPromise = commitFileToGithub(
            carouselItem.img[0],
            carouselImagePath,
            `Add project carousel image: ${carouselImageName}`
          );

          commitPromises.push(carouselPromise);
        }
      }

      // Wait for all commits to complete
      await Promise.all(commitPromises);

      setCommitStatus("All images successfully committed to GitHub!");
      setTimeout(() => {
        setCommitStatus("");
        setIsCommitting(false);
      }, 3000);

      return true;
    } catch (error) {
      console.error("Error committing images to GitHub:", error);
      setCommitStatus(`Error committing images: ${error.message}`);
      setIsCommitting(false);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitButtonText("Submitting...");

    try {
      const formData = new FormData(e.target);
      const mainImage = formData.get("image");
      
      // Check if main image is provided and is a .webp file
      if (mainImage && mainImage.type !== "image/webp") {
        alert("Only .webp images are accepted for the main image.");
        setSubmitButtonText("Submit");
        setIsSubmitting(false);
        return;
      }
      
      // Check if GitHub token exists
      if (!githubDetails.token) {
        const token = prompt("Please enter your GitHub token to commit images:");
        if (!token) {
          alert("GitHub token is required to commit images.");
          setSubmitButtonText("Submit");
          setIsSubmitting(false);
          return;
        }
        
        // Save token to localStorage for future use
        localStorage.setItem("githubToken", token);
        githubDetails.token = token;
      }

      // Generate a unique ID for this project (MongoDB style, without hyphens)
      const newProjectId = uuidv4().replace(/-/g, "").substring(0, 24);
      setProjectId(newProjectId);
      
      // Set up file paths according to the repository structure
      const projectPath = `public/images/projects/${newProjectId}`;
      const carouselPath = `${projectPath}/carousel`;
      
      // Create base data object
      const projectData = {
        _id: newProjectId,
        title: formData.get("title"),
        description: formData.get("description"),
        githubLink: formData.get("githubLink"),
        startDate: formData.get("startDate") ? new Date(formData.get("startDate")).toISOString() : null,
        endDate: formData.get("endDate") ? new Date(formData.get("endDate")).toISOString() : null,
        durration: formData.get("endDate") ? "completed" : "ongoing",
        highlighted: formData.get("highlighted") === "on" ? "star" : "basic",
        tags: tags, // now using the tags array
        showInOverview: false,
        codeSamples: codeSamples,
        dataSources: dataSources,
        tools: {
          techs: techs.map((tech, index) => ({
            _id: `${newProjectId}${index}t`,
            title: tech.title,
            description: tech.description
          })),
          resources: resources.map((resource, index) => ({
            _id: `${newProjectId}${index}r`,
            title: resource.title,
            description: resource.description
          })),
        },
        carouselImages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      };
      
      // Set up image paths in projectData
      const timestamp = Date.now();
      let mainImageName = null;
      if (mainImage) {
        mainImageName = `${timestamp}.webp`;
        projectData.image = `/images/projects/${newProjectId}/${mainImageName}`;
      }

      let carouselImageNames = [];
      // Set up carousel image paths in projectData
      for (let i = 0; i < carouselSamples.length; i++) {
        const carouselItem = carouselSamples[i];
        if (carouselItem.img && carouselItem.img[0]) {
          if (carouselItem.img[0].type !== "image/webp") {
            alert(`Only .webp images are accepted for carousel image ${i + 1}.`);
            setSubmitButtonText("Submit");
            setIsSubmitting(false);
            return;
          }
          const carouselImageName = `${timestamp}-${i}.webp`;
          carouselImageNames.push(carouselImageName);
          projectData.carouselImages.push({
            _id: `${newProjectId}${i}c`,
            img: `/images/projects/${newProjectId}/carousel/${carouselImageName}`,
            title: carouselItem.title
          });
        }
      }

      // Add the project to Firestore
      setSubmitButtonText("Saving to Firebase...");
      const projectRef = doc(db, "projects", newProjectId);
      await setDoc(projectRef, projectData);
      
      // Now commit images to GitHub
      setSubmitButtonText("Committing images...");
      await commitProjectImages(mainImage, mainImageName, carouselSamples,carouselImageNames, newProjectId);
      
      // Display success message
      setSubmitButtonText("Successfully Submitted!");
      
      // Reset form after successful submission
      setTimeout(() => {
        e.target.reset();
        setCodeSamples([]);
        setCarouselSamples([]);
        setTechs([]);
        setResources([]);
        setDataSources([]);
        setTags([]);
        setSubmitButtonText("Submit");
        setIsSubmitting(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting project:", error);
      setSubmitButtonText("Error: Please try again");
      setIsSubmitting(false);
    }
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
      <h1 className="project-form__title">Create New Project</h1>
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

      {/* Replace simple tags input with TagInput */}
      <TagInput 
        tags={tags} 
        setTags={setTags} 
      />

      <input 
        type="submit" 
        value={submitButtonText} 
        disabled={isSubmitting || isCommitting}
        className={isSubmitting || isCommitting ? "submitting" : ""} 
      />
      
      {/* GitHub commit status message */}
      {(isCommitting || commitStatus) && (
        <div className={`commit-status ${
          commitStatus.includes("Error") 
            ? "error" 
            : commitStatus.includes("success") 
              ? "success" 
              : "info"
        }`}>
          {commitStatus}
          {isCommitting && <div className="spinner"></div>}
        </div>
      )}
    </form>
  );
}

