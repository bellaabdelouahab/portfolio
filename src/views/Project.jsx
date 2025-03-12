import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../assets/css/project.css";
import CodeSamples from "../components/project-components/project-code-samples/CodeSamples";
import Carousel from "../components/project-components/projecct-carousel/Carousel";
import Collaborators from "components/project-components/project-collaborators/Collaborators";
import ProjectOverView from "components/project-components/project-overview/ProjectOverView";
import ProjectTools from "components/project-components/project-tools/ProjectTools";
import ProjectDataSources from "components/project-components/project-datasource/ProjectDataSources";
import SEO from "../components/common/SEO";
import Skeleton from "react-loading-skeleton";

export default function Project() {
  const location = useLocation();
  const { title } = useParams();
  const navigate = useNavigate();
  
  // Define state for loading projects, project data, and errors
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  // Try to fetch project data directly from Firebase using the URL parameter
  useEffect(() => {
    // Create stars background effect
    const createStarsBackground = () => {
      const starsContainer = document.createElement("div");
      starsContainer.className = "stars-container";
      document.querySelector(".project-page")?.appendChild(starsContainer);

      // Generate random stars
      const numberOfStars = 500;
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.className = "star";
        
        // Random properties
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.7 + 0.3;
        const duration = Math.random() * 50 + 50;
        const delay = Math.random() * 50;

        // Apply styles
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = opacity;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
      }

      return starsContainer;
    };
    
    // Function to fetch project data from Firebase
    const fetchProject = async () => {
      setLoading(true);
      try {
        // Use state from routing if available (for faster loading)
        if (location.state) {
          setProject(location.state);
          setLoading(false);
        }
        
        // Fetch from Firebase anyway (to ensure data is fresh and available)
        // First try to find the project by its formatted title in the URL
        const projectTitle = title.replace(/-/g, " ");
        
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("title", "==", projectTitle));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Found project by title
          const projectData = {
            _id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          };
          setProject(projectData);
          setLoading(false);
        } 
        else if (location.state) {
          // We already set the project from state, so we're good
        }
        else {
          // Try to find by ID in case the title is in URL format
          const projectDoc = await getDoc(doc(db, "projects", title));
          
          if (projectDoc.exists()) {
            const projectData = {
              _id: projectDoc.id,
              ...projectDoc.data()
            };
            setProject(projectData);
            setLoading(false);
          } else {
            // If we get here, the project doesn't exist
            setError("Project not found");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project. Please try again later.");
        setLoading(false);
      }
    };
    
    // Call both functions
    let starsContainer;
    fetchProject();
    
    // Create stars after a short delay to ensure project-page element exists
    setTimeout(() => {
      starsContainer = createStarsBackground();
    }, 200);
    
    // Cleanup function
    return () => {
      if (starsContainer?.parentNode) {
        starsContainer.parentNode.removeChild(starsContainer);
      }
    };
  }, [location.state, title]);

  // Generate structured data for SEO
  const generateProjectStructuredData = () => {
    if (!project) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": project.title,
      "description": project.description,
      "datePublished": project.startDate,
      "programmingLanguage": project.tools?.techs?.map(tech => tech.title).join(", "),
      "codeRepository": project.githubLink,
      "author": {
        "@type": "Person",
        "name": "Abdelouahab Bella"
      }
    };
  };

  if (loading) {
    return (
      <section className="project-page">
        <SEO title="Loading Project" description="Loading project details..." />
        <div className="project-loading">
          <h2><Skeleton width={300} /></h2>
          <Skeleton height={200} />
          <Skeleton count={5} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="project-page">
        <SEO title="Project Not Found" description="The requested project could not be found." />
        <div className="project-error">
          <h2>Project Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/projects')} className="back-to-projects">
            Back to Projects
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="project-page">
      <SEO 
        title={project.title}
        description={project.description.substring(0, 160)}
        keywords={`${project.title}, project, portfolio, ${project.tools?.techs?.map(tech => tech.title).join(", ")}`}
        image={project.image}
        type="article"
        structuredData={generateProjectStructuredData()}
      />
      <ProjectOverView project={project} />
      <ProjectTools tools={project.tools} />
      <ProjectDataSources dataSources={project.dataSources} />
      <Carousel carouselImages={project.carouselImages} />
      <CodeSamples codeSamples={project.codeSamples} />
      <Collaborators collaborators={project.collaborators} />
    </section>
  );
}
