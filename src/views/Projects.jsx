import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "../assets/css/projects.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SEO from "../components/common/SEO";

export default function Projects() {
  const projects = useLoaderData();
  const Navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState("All");
  const [imageLoaded, setImageLoaded] = useState({});
  
  // Create ProjectsPage structured data
  const projectsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Abdelouahab Bella's Projects",
    "description": "A collection of projects developed by Abdelouahab Bella, including web development, machine learning, and data science projects.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareSourceCode",
          "name": project.title,
          "description": project.description.substring(0, 160),
          "url": `https://abdelouahab.xyz/#/projects/${project.title.replace(/\s/g, "-")}`,
          "codeRepository": project.githubLink
        }
      }))
    }
  };

  // Generate a list of unique tags from all projects
  const allTags = projects.reduce((acc, project) => {
    const projectTags = project.tags || [];
    projectTags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = 1;
      } else {
        acc[tag] += 1;
      }
    });
    return acc;
  }, {});

  // Convert tags object to array of objects for filtering
  const filters = [{ All: -1 }];
  Object.entries(allTags).forEach(([tag, count]) => {
    filters.push({ [tag]: count });
  });

  const handleFilterClick = (e) => {
    // Only filter if we clicked on a filter element
    if (!e.target.dataset.tag) return;
    
    const filterValue = e.target.dataset.tag;
    setFilter(filterValue);
    // Hide filters panel after selection
    const filtersElem = document.querySelector(".filters");
    const filterElement = document.querySelector(".filter");
    filtersElem.classList.add("hidden");
    filterElement.innerHTML = filterValue + " ▼";
    setShowFilter(false);
  };

  const handleFilterShow = (e) => {
    const filterElement = document.querySelector(".filter");
    const filtersElem = document.querySelector(".filters");
    if (!showFilter) {
      filtersElem.classList.remove("hidden");
      filterElement.innerHTML = filter + " ▶";
      setShowFilter(true);
    } else {
      filtersElem.classList.add("hidden");
      filterElement.innerHTML = filter + " ▼";
      setShowFilter(false);
    }
  };

  useEffect(() => {
    document.getElementById("cards").onmousemove = (e) => {
      for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };
    
    // Add click handler for filter options
    const filtersContainer = document.querySelector(".filters");
    filtersContainer?.addEventListener("click", handleFilterClick);
    
    return () => {
      filtersContainer?.removeEventListener("click", handleFilterClick);
    };
  }, []);

  const handleImageLoad = (projectId) => {
    setImageLoaded((prevState) => ({ ...prevState, [projectId]: true }));
  };

  return (
    <>
      <SEO 
        title="Projects"
        description="Browse through all projects developed by Abdelouahab Bella, including web development, machine learning, and data science projects."
        keywords="Projects, Portfolio, Web Development, Software Engineering, Data Science, Machine Learning"
        structuredData={projectsStructuredData}
      />
      <section className="projects-section">
        <div className="projects-header">
          <h1 className="projects-section__title">Projects Library</h1>
          <div className="projects-section__filters">
            <label onClick={handleFilterShow}>
              Category: <span className="filter">{filter} ▼</span>{" "}
            </label>
          </div>
        </div>
        <div className="filters-container">
          <div className="filters hidden">
            {filters.map((filter, index) =>
              Object.entries(filter).map(([tag, count]) => (
                <div key={index} className="filter-element" data-tag={tag}>
                  {tag} {count !== -1 ? "(" + count + ")" : ""}
                </div>
              ))
            )}
          </div>
        </div>

        <h2 className="projects-section__subtitle">
          Get Access To All My Public Projects
        </h2>
        <div id="cards">
          {projects &&
            projects.map((project, index) => {
              // Filter projects based on selected filter
              if (filter !== "All" && !(project.tags || []).includes(filter)) {
                return null;
              }
              
              const description = project.description;
              let truncatedDescription = description.slice(0, 250); // Increased limit slightly
              const lastSpaceIndex = truncatedDescription.lastIndexOf(" ");
              truncatedDescription = truncatedDescription.slice(
                0,
                lastSpaceIndex
              );
              if (description.length > 200) truncatedDescription += "...";
              return (
                <div
                  key={project._id}
                  className="card"
                  onClick={(e) => {
                    Navigate("/projects/" + project.title.replace(/\s/g, "-"), {
                      state: project,
                    });
                  }}
                  aria-label={`View details of ${project.title} project`}
                >
                  <div
                    className="projects-section__projects__project__img"
                    style={{
                      backgroundImage: imageLoaded[project._id]
                        ? `url(${project.image})`
                        : "none",
                    }}
                  >
                    {!imageLoaded[project._id] && <Skeleton height="100%" />}
                    <img
                      src={`${project.image}`}
                      alt={`Preview of ${project.title} project`}
                      style={{ display: "none" }}
                      onLoad={() => handleImageLoad(project._id)}
                      // on error set image as not found image at assets/images/notfound.png
                       
                    />
                  </div>
                  {imageLoaded[project._id] ? (
                    <>
                      <h3 className="projects-section__projects__project__title">
                        {project.title}
                      </h3>
                      <p className="projects-section__projects__project__description">
                        {truncatedDescription}
                      </p>
                    </>
                  ) : (
                    <div>
                      
                      <div className="home-projects-section__projects__project__description" style={{
                        display:"flex",
                        justifyContent:"center",
                        width:"100%"
                      }}>
                      <Skeleton
                        height={24}
                        width={`10rem`}
                        style={{
                          marginBottom: "10px",
                          marginTop: "10px",
                          marginLeft: "10px",
                        }}
                      />
                      </div>
                      <div className="home-projects-section__projects__project__description">
                        <Skeleton count={7} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </>
  );
}

export const getProjects = async () => {
  const colRef = collection(db, "projects");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  return data;
};
