import { useEffect, useState } from "react";
import axiosInstance from "utils/axios";

import "./ArrangeProjects.css";

export default function ArrangeProjects() {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from the backend
    axiosInstance
      .get("/projects?fields=title")
      .then((response) => {
        setProjects(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const numColumns = Math.ceil(projects.length / 3); // Calculate the number of columns

const handleValidate = async () => {
    // Get the JWT cookie
    const jwtCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="));

    // Extract the JWT token from the cookie
    const jwtToken = jwtCookie ? jwtCookie.split("=")[1] : "";

    // Pass selected projects and JWT token to the backend
    await axiosInstance
        .put("/projects/overview", {
            projectIds: selectedProjects.map((project) => project._id),
        }, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => console.error(error));
};

  return (
    <div className="arrange-projects-form filldb-form">
      <div className="highlighted-projects">
        {/* Container with 3 highlighted projects */}
        {selectedProjects.length > 0 &&
          selectedProjects
            .filter((_, index) => index < 3)
            .map((project) => (
              <div key={project.title} className="highlighted-project" onClick={() => {
                // remove project from selected projects
                setSelectedProjects(
                    selectedProjects.filter(
                        (selectedProject) => selectedProject !== project
                    )
                );
                }}>

                {/* Render highlighted project */}
                <h3>{project.title}</h3>
                {/* Other project details */}
                {/* ... */}
              </div>
            ))}
      </div>
      <div className="scrollable-grid">
        {/* Scrollable grid */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {projects.length > 0 &&
            projects.map((project) => (
              <div
                key={project.title}
                style={{ flex: `1 0 ${100 / numColumns}%` }}
                className="project"
                onClick={() => {
                  // Add or remove project from selected projects
                  if (selectedProjects.includes(project)) {
                    setSelectedProjects(
                      selectedProjects.filter(
                        (selectedProject) => selectedProject !== project
                      )
                    );
                  } else {
                    // if not more than 3 projects selected
                    if (selectedProjects.length === 3) return;
                    setSelectedProjects([...selectedProjects, project]);
                  }
                }}
              >
                {/* Render project */}
                <h3>{project.title}</h3>
                {/* Other project details */}
                {/* ... */}
              </div>
            ))}
        </div>
      </div>
      {/* validate buttn */}
      <button className="validate-btn" onClick={() => handleValidate()}>
        Validate
      </button>
    </div>
  );
}
