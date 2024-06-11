import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/projects.css";
import axiosInstance from "utils/axios";
const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

export default function Projects() {
  const InitProjects = useLoaderData();
  const [projects, setProjects] = useState(InitProjects);
  const Navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState("All");

  let filters = [
    {
      All: -1,
    },
  ];
  InitProjects.map((project) => {
    project?.tags?.map((tag) => {
      // search if the tag is in filters
      // if so we increment the tag value by 1 else we initialize it by 1
      const updateFilters = (tag) => {
        const filterIndex = filters.findIndex((filter) =>
          filter.hasOwnProperty(tag)
        );
        if (filterIndex !== -1) {
          filters[filterIndex][tag] += 1;
        } else {
          filters.push({ [tag]: 1 });
        }
      };
      updateFilters(tag);
      return;
    });
    return;
  });

  useEffect(() => {
    const handleFilterClick = (e) => {
      const selectedTag = e.target.getAttribute("data-tag");
      console.log(selectedTag);
      setFilter(selectedTag);
    };

    const filterElements = document.querySelectorAll(".filter-element");
    filterElements.forEach((element) => {
      console.log(element);
      element.addEventListener("click", handleFilterClick);
    });

    return () => {
      filterElements.forEach((element) => {
        element.removeEventListener("click", handleFilterClick);
      });
    };
  }, []);

  useEffect(() => {
    const handleFilter = (filterElement) => {
      filterElement.innerHTML = filter + " ▼";
      setShowFilter(false);
      // Perform filtering logic here based on the selected tag
      const filteredProjects = InitProjects.filter((project) => {
        if (filter === "All") {
          return true;
        }
        return project.tags.includes(filter);
      });
      // Update the UI with the filtered projects
      setProjects(filteredProjects);
    };
    const filterElement = document.querySelector(".filter");
    handleFilter(filterElement);
    const filters = document.querySelector(".filters");
    filters.classList.add("hidden");
    filterElement.innerHTML = filter + " ▼";
    setShowFilter(false);
  }, [filter, InitProjects]);

  // handleFilterShow
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
  // use effet :
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
  }, []);
  return (
    <>
      <section className="projects-section">
        <div className="projects-header">
          <h1 className="projects-section__title">Projects Library</h1>
          <div className="projects-section__filters">
            <label onClick={handleFilterShow}>
              Category:{" "}
              <span className="filter">
                {filter} ▼
              </span>{" "}
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
              const description = project.description
              let truncatedDescription = description.slice(0, 350);
              const lastSpaceIndex = truncatedDescription.lastIndexOf(" ");
              truncatedDescription = truncatedDescription.slice(
                0,
                lastSpaceIndex
              );
              if (description.length> 350) truncatedDescription += "...";
              return (
                <div
                  key={project._id}
                  className="card"
                  onClick={(e) => {
                    Navigate("/projects/" + project.title.replace(/\s/g, "-"), {
                      state: project,
                    });
                  }}
                >
                  <div
                    className="projects-section__projects__project__img"
                    style={{
                      backgroundImage: `url(${backendUploadsApi}/${project.image}) `,
                    }}
                  />
                  <h3 className="projects-section__projects__project__title">
                    {project.title}
                  </h3>
                  <p className="projects-section__projects__project__description">
                    {truncatedDescription}
                  </p>
                </div>
              );
            })}
        </div>
      </section>
    </>
  );
}
export const getProjects = async () => {
  return await axiosInstance
    .get("projects")
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
