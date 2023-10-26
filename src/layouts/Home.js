import { useEffect } from "react";
import axios from "axios";
import About from "../components/About";
import { useLoaderData } from "react-router-dom";

export default function Home() {
  const projectHighlight = useLoaderData();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });

    const hiddenAreas = document.querySelectorAll(".hidden-area");
    hiddenAreas.forEach((el) => {
      observer.observe(el);
    });
  }, []);

  return (
    <>
      <section className="home-first-sections hidden-area">
        <h1 className="home-first-sections__title">
          Hi, I'm Bella Abdelouahab
        </h1>
        <h2 className="home-first-sections__subtitle">Your Coding Skills</h2>
        <a
          className="home-first-sections__button"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/bellaabdelouahab"
        >
          Find Me On Github <span>{">"}</span>{" "}
        </a>

        <p className="home-first-sections__img" alt="code" />
      </section>
      <section className="home-second-sections hidden-area">
        <h2 className="home-second-sections__title">❤️ Projects Highlights</h2>
        <hr className="home-second-sections__hr" />
        <div className="home-second-sections__projects">
          {projectHighlight &&
            projectHighlight.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
        </div>
      </section>
      <section className="home-third-sections hidden-area">
        <h2 className="home-third-sections__title">Github Progress</h2>
        <hr className="home-third-sections__hr" />
        <div className="home-third-sections__img" />
      </section>
      <section>
        <About />
      </section>

      <iframe id="jsoncrackEmbed" src="https://jsoncrack.com/widget" width="70%" height="600px"></iframe>
    </>
  );
}

function ProjectCard({ project }) {
  const { title, description, image, githubLink, highlighted } = project;

  return (
    <div
      className="home-second-sections__projects__project"
      style={{
        border: highlighted === "star" ? "2px solid #ffda59" : "none",
        borderRadius: "5px",
      }}
    >
      <div
        className="home-second-sections__projects__project__img"
        style={{ backgroundImage: `url(http://localhost:5000/${image})` }}
      />
      <h3 className="home-second-sections__projects__project__title">
        {title}
      </h3>
      <p className="home-second-sections__projects__project__description">
        {description}
      </p>
      <div className="home-second-sections__projects__project__buttons">
        <a
          className="home-second-sections__projects__project__buttons__view"
          target="_blank"
          rel="noopener noreferrer"
          href={githubLink}
        >
          View Project
        </a>
        {highlighted === "star" && (
          <a
            className="home-second-sections__projects__project__buttons__sponsor"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/bellaabdelouahab/"
          >
            1$/Sponsor
          </a>
        )}
      </div>
    </div>
  );
}



export const getHighlightedProjects = async () => {
  console.log("getProjects");
  return await axios
    .get(
      "http://localhost:5000/api/projects?limit=3&fields=title,description,githubLink,highlight"
    )
    .then((res) => {
      console.log(res.data.data);
      return res.data.data;
    });
};


