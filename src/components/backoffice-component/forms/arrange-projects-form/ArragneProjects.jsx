import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../firebase";

import "./ArrangeProjects.css";

export default function ArrangeProjects() {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from Firebase Firestore
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsList);
        console.log(projectsList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    
    fetchProjects();
  }, []);

  const numColumns = Math.ceil(projects.length / 3); // Calculate the number of columns

  const handleValidate = async () => {
    try {
      // Get the Firebase authentication token (optional, for enhanced security)
      const authToken = localStorage.getItem("firebaseAuthToken");

      if (!authToken) {
        console.error("Authentication token is missing.");
        alert(
          "Authentication token is missing.  Cannot update featured projects."
        );
        return;
      }

      // 1. Set showInOverview to false for all projects
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);

      // Create an array of promises to update each project
      const updatePromises = projectsSnapshot.docs.map(async (docSnapshot) => {
        const projectRef = doc(db, "projects", docSnapshot.id);
        await updateDoc(projectRef, {
          showInOverview: false,
          authToken: authToken, // Include the token here
        });
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // 2. Set showInOverview to true for selected projects
      const selectedProjectIds = selectedProjects.map((project) => project.id);

      // Create an array of promises to update selected projects
      const selectedUpdatePromises = selectedProjectIds.map(
        async (projectId) => {
          const projectRef = doc(db, "projects", projectId);
          await updateDoc(projectRef, {
            showInOverview: true,
            authToken: authToken, // Include the token here
          });
        }
      );

      // Wait for all updates to complete
      await Promise.all(selectedUpdatePromises);

      alert("Featured projects updated successfully!");
    } catch (error) {
      console.error("Error updating featured projects:", error);
      alert("Failed to update featured projects. See console for details.");
    }
  };

  return (
    <div className="arrange-projects-form filldb-form">
      <div className="highlighted-projects">
        {/* Container with 3 highlighted projects */}
        {selectedProjects.length > 0 &&
          selectedProjects
            .filter((_, index) => index < 3)
            .map((project) => (
              <div key={project.id || project.title} className="highlighted-project" onClick={() => {
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
                key={project.id || project.title}
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
      {/* validate button */}
      <button className="validate-btn" onClick={() => handleValidate()}>
        Validate
      </button>
    </div>
  );
}
