import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "./ProjectListPage.scss";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import SEO from "../../shared/ui/SEO";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

/** One filter pill. Extracted so every chip is guaranteed to look identical. */
function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-200",
        active
          ? "border-success bg-success/15 text-success"
          : "border-line bg-surface text-ink hover:border-success/40 hover:text-ink-strong",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

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
          "description": typeof project.description === "string" && project.description.trim()
            ? project.description.trim().substring(0, 160)
            : "Project details from Abdelouahab Bella's portfolio.",
          "url": getAbsoluteUrl(`/projects/${project.title.replace(/\s/g, "-")}`),
          "codeRepository": project.githubLink
        }
      }))
    }
  };

  // Tag counts across all projects, most-used first. The back office calls these
  // "tags", so the UI does too rather than inventing a second word for them.
  const tagCounts = projects.reduce((acc, project) => {
    (project.tags || []).forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const rankedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  // Only the tags that actually group things are worth a permanent chip; a tag
  // used once is a filter that hides everything but one card. The rest stay
  // reachable through the dropdown.
  const PRIMARY_TAG_COUNT = 6;
  const primaryTags = rankedTags.filter(([, n]) => n > 1).slice(0, PRIMARY_TAG_COUNT);
  const overflowTags = rankedTags.filter(([tag]) => !primaryTags.some(([t]) => t === tag));

  const selectFilter = (tag) => {
    setFilter(tag);
    setShowFilter(false);
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
      <section className="inline-block h-auto w-full pb-7.5">
        {/* Centred on phones, spread to the edges once the title is full size. */}
        <div className="mx-auto mt-2.5 flex h-[8vh] w-[90%] flex-row items-center justify-center border-b border-line sm:mt-[4vh] sm:items-stretch sm:justify-between">
          <h1 className="inline-block w-fit text-base font-bold leading-tight tracking-[4px] text-ink-strong sm:pb-5 sm:text-5xl">
            Projects Library
          </h1>
        </div>

        {/* Was ml-[7vw] against a 90%-wide (5vw) header — now on the same
            gutter as the header and the filter row. */}
        <h2 className="mx-auto mb-[3vh] mt-[2vh] w-[90%] text-2xl font-bold leading-snug tracking-[4px] text-ink">
          Get Access To All My Public Projects
        </h2>

        {/* Filter bar. The common tags are visible as chips rather than hidden
            behind a dropdown — a filter nobody can see is a filter nobody uses,
            and the tags double as a summary of what the work actually covers.
            The dropdown now sits beside them and holds only the long tail. */}
        <div className="mx-auto mb-6 flex w-[90%] flex-wrap items-center gap-2">
          <FilterChip active={filter === "All"} onClick={() => selectFilter("All")}>
            All <span className="opacity-60">({projects.length})</span>
          </FilterChip>

          {primaryTags.map(([tag, count]) => (
            <FilterChip key={tag} active={filter === tag} onClick={() => selectFilter(tag)}>
              {tag} <span className="opacity-60">({count})</span>
            </FilterChip>
          ))}

          {overflowTags.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilter((open) => !open)}
                aria-expanded={showFilter}
                className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-success/40 hover:text-ink-strong"
              >
                More tags <span aria-hidden="true">{showFilter ? "▲" : "▼"}</span>
              </button>

              {showFilter && (
                /* Opaque background and a border on purpose: the old panel was
                   translucent over the cards behind it and became unreadable. */
                <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-64 overflow-y-auto rounded-lg border border-line bg-surface p-2 shadow-lg">
                  {overflowTags.map(([tag, count]) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => selectFilter(tag)}
                      className={[
                        "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors duration-150",
                        filter === tag
                          ? "bg-success/15 text-success"
                          : "text-ink hover:bg-surface-raised hover:text-ink-strong",
                      ].join(" ")}
                    >
                      <span>{tag}</span>
                      <span className="opacity-60">{count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* id is required: the mousemove handler above looks it up by id, and
            the spotlight rules in the stylesheet key off `#cards:hover`. */}
        <div
          id="cards"
          className="mx-auto flex min-h-[70vh] w-full max-w-[1000px] flex-row flex-wrap justify-center gap-x-[30px] gap-y-5 py-2.5 lg:max-w-none lg:py-0"
        >
          {projects &&
            projects.map((project, index) => {
              // Filter projects based on selected filter
              if (filter !== "All" && !(project.tags || []).includes(filter)) {
                return null;
              }
              
              const description = project.description;
              let truncatedDescription = description.slice(0, 150); // Increased limit slightly
              const lastSpaceIndex = truncatedDescription.lastIndexOf(" ");
              truncatedDescription = truncatedDescription.slice(
                0,
                lastSpaceIndex
              );
              if (description.length > 200) truncatedDescription += "...";
              return (
                <div
                  key={project._id}
                  /* `card` stays as the hook for the dot texture, the two
                     spotlight pseudo-elements and the mousemove lookup — the
                     rest of the card is utilities. */
                  className="card relative h-[60vh] w-full cursor-pointer rounded-lg border border-line bg-surface pb-1.25 shadow-md transition-all duration-300 ease-standard hover:border-success/40 sm:h-auto sm:w-[calc(50%-4px)] sm:min-w-82.5 sm:shrink lg:w-82.5"
                  onClick={(e) => {
                    Navigate("/projects/" + project.title.replace(/\s/g, "-"), {
                      state: project,
                    });
                  }}
                  aria-label={`View details of ${project.title} project`}
                >
                  <div
                    className="h-50 rounded-t-lg bg-center bg-no-repeat"
                    style={{
                      backgroundImage: imageLoaded[project._id]
                        ? `url(${project.image})`
                        : "none",
                      // Stretch, not cover — the old rule was
                      // `background-size: 100% 100%`, and it lives here rather
                      // than in a utility because the sibling backgroundImage
                      // is already inline.
                      backgroundSize: "100% 100%",
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
                      <h3 className="mx-2.5 mt-2.5 flex min-h-11.25 items-center justify-center text-center text-3xl font-bold leading-snug text-ink-strong">
                        {project.title}
                      </h3>
                      <p className="hyphens-auto break-keep px-3.75 py-2.5 text-left text-sm font-extralight leading-5 text-ink">
                        {truncatedDescription}
                      </p>
                    </>
                  ) : (
                    /* These two used to borrow
                       `home-projects-section__projects__project__description`
                       from the home page's featured-projects section purely for
                       its `width: 90%; margin: auto`. Same result, no
                       cross-feature dependency. */
                    <div>
                      <div className="mx-auto flex w-[90%] justify-center">
                        <Skeleton
                          height={24}
                          width={`6.25rem`}
                          style={{
                            marginBottom: "10px",
                            marginTop: "10px",
                            marginLeft: "10px",
                          }}
                        />
                      </div>
                      <div className="mx-auto w-[90%]">
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
  // Firestore returns documents in unspecified order, so without this the list
  // could differ between visits. Newest work first is also the right order for a
  // portfolio; startDate is present on every project document.
  return data.sort((a, b) => new Date(b.startDate ?? 0) - new Date(a.startDate ?? 0));
};
