// import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import About from "../components/About";
import { useLoaderData } from "react-router-dom";

export default function Home() {
  const projectHighlight = useLoaderData()
  console.log("projectHighlight", projectHighlight);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
        // else {
        //   entry.target.classList.remove("visible");
        // }
      });
    });
    document.querySelectorAll(".hidden-area").forEach((el) => {
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
          {/* projects highlights */}
          <h2 className="home-second-sections__title">
            ❤️ Projects Highlights
          </h2>
          <hr className="home-second-sections__hr" />
          <div className="home-second-sections__projects">
            {projectHighlight &&
              projectHighlight.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  title={project.title}
                  description={project.description}
                  img={project.image}
                  link={project.githubLink}
                  sponsorLink={
                    project.highlighted === "star"
                      ? "https://github.com/bellaabdelouahab/"
                      : null
                  }
                />
              ))}
            {/* {ProjectCard()} */}
          </div>
        </section>
        <section className="home-third-sections hidden-area">
          <h2 className="home-third-sections__title">Github Progress</h2>
          <hr className="home-third-sections__hr" />
          <div className="home-third-sections__img" />
        </section>
        <section>
          <About />
          {/* <iframe id="jsoncrackEmbed" src="https://jsoncrack.com/widget" width="100%" height="900vh"></iframe> */}

          {/* <button onClick={e=>sendToEmbed()}>SEND TO JSON EMBED</button> */}
        </section>
      </>
    );

  function ProjectCard({title, description, img, link, sponsorLink=null}) {
    return (
      <div
        className="home-second-sections__projects__project"
        style={{
          border: sponsorLink ? "2px solid #ffda59" : "none",
          borderRadius:"5px",
        }}
      >
        <div
          className="home-second-sections__projects__project__img"
          style={{ backgroundImage: `url(http://localhost:5000/${img})` }}
        />
        <h3 className="home-second-sections__projects__project__title">
          {title}
        </h3>
        <p className="home-second-sections__projects__project__description">
          {description}
        </p>
        {/* button to view project and button to sponsor */}
        <div className="home-second-sections__projects__project__buttons">
          <a
            className="home-second-sections__projects__project__buttons__view"
            target="_blank"
            rel="noopener noreferrer"
            href={link}
          >
            View Project
          </a>
          {sponsorLink && (
            <a
              className="home-second-sections__projects__project__buttons__sponsor"
              rel="noopener noreferrer"
              target="_blank"
              href={sponsorLink}
            >
              1$/Sponsor
            </a>
          )}
        </div>
      </div>
    );
  }
  function sendToEmbed() {
    const jsonCrackEmbed = document.getElementById("jsoncrackEmbed");
    var json = JSON.stringify({
      congrats: "You did it!",
      you: {
        can: "send",
        any: {
          json: "object",
        }
      },
      send: "any",
      json: "object",
    });
    const options = {
      theme: "dark", // "light" or "dark"
      direction: "DOWN", // "UP", "DOWN", "LEFT", "RIGHT"
    };
    jsonCrackEmbed.contentWindow.postMessage(
      {
        json,
        options,
      },
      "*"
    );
  }
}

export const getHighlightedProjects = async () => {
    console.log("getProjects");
    return await axios
      .get(
        "http://localhost:5000/api/projects?limit=2&fields=title,description,githubLink,highlight"
      )
      .then((res) => {
        console.log(res.data.data);
        return res.data.data;
      });
  };