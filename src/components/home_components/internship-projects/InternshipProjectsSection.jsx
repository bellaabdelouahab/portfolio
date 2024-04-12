// import style from assets
import { useEffect } from "react";
import "./intership_projects.wide.css";

export default function InternshipProjectsSection() {
  useEffect(() => {
    // get the size of each intership project and set the height of lineanimation to half of the size of the intership project
    const intershipProjects = document.querySelectorAll(".intership-project");
    intershipProjects.forEach((project) => {
      const height = project.clientHeight;
      // get  the lineAnimation element
      const index = Array.from(project.parentElement.children).indexOf(project);
      const lineAnimation = document.querySelector(
        `.gradientLine-${(index - 1) * 2}`
      );
      lineAnimation.style.height = `${height / 2}px`;
      const lineAnimation2 = document.querySelector(
        `.gradientLine-${(index - 1) * 2 + 1}`
      );
      lineAnimation2.style.height = `${height / 2}px`;
    });
  }, []);

  return (
    <section
      className="internship-projects-section hidden-area"
      style={{ marginTop: "5rem", height: "auto", width: "100%" }}
    >
      <div className="experience">
        <div className="home-sections-title">
          <span>04. </span>
          Professional Experience
          <hr />
        </div>
      </div>
      <div className="intership-project">
        <div className="intership-project__img">
          <img
            src="./internshipes/agri4.0.png"
            width="250px"
            height="200px"
            alt="Internship-Project-1"
            border="0"
            style={{
              outline: "#fff 3px solid",
            }}
          />
        </div>
        <div className="intership-project__content">
          <h1>E-khsab : A Connected Cow Monitoring System [Agri4.0]</h1>
          <p className="content">
            Development of e-services to monitor in real-time the health status
            and well-being of cows, plan artificial inseminations, enhance herd
            reproduction, and implement a heat detection system within a core
            group of breeders, which will be extended to a larger number of
            breeders on a national scale.
          </p>
          {/* link to interprise */}
          <a
            href="https://poledigital.ma/projets/projets-elevage-4-0/e-khsab"
            style={{
              outline: "1px solid #268b60",
              borderRadius: "5px",
              padding: ".5rem",
            }}
            target="_blank"
            className="intership-project__content__link"
          >
            <img
              src="./icons/site.png"
              width="20px"
              height="20px"
              alt="Internship-Project-1"
              border="0"
              style={{ marginRight: ".4rem" }}
            />
            Link to website for more details
          </a>
          <ul className="intership-project__content__list">
            <li>Spring Boot</li>
            <li>JHipster</li>
            <li>React</li>
            <li>PostgreSQL</li>
            <li>RabbitMQ</li>
            <li>WebSockets</li>
            <li>Ardunio</li>
          </ul>
        </div>
      </div>
      <div className="intership-project">
        <div className="intership-project__img">
          <img
            src="./internshipes/1200px-GBAM_LOGO.png"
            width="250px"
            height="200px"
            alt="Internship-Project-1"
            border="0"
            style={{
              outline: "#0163ad 3px solid",
            }}
          />
        </div>
        <div className="intership-project__content">
          <h1>
            Desktop application for managing package sending for special clients
          </h1>
          <p className="content">
            During this internship, I have created a desktop application using
            JavaFX as a UI library and Oracle as a database. The application is
            used to manage the sending of packages for special clients (Lawyers,
            Journalists, Writers). This application was created to make it easy
            for them to send packages instead of waiting in lines. The
            application is used by the post office employees.
          </p>
          <ul className="intership-project__content__list">
            <li>JavaFX</li>
            <li>Oracle - Cloud</li>
            <li>XML</li>
            <li>CSS</li>
            <li>Python</li>
            <li>SMTP</li>
          </ul>
        </div>
      </div>
      <div className="intership-project">
        <div className="intership-project__img">
          <img
            src="./internshipes/PosteMaroc.jpg"
            width="250px"
            height="200px"
            alt="Not Found"
            border="0"
            style={{
              outline: "#fce533 3px solid",
            }}
          />
        </div>
        <div className="intership-project__content">
          <h1>A web Site For Envolop Database Managmnet </h1>
          <p className="content">
            {" "}
            duringing this intership i have worked on a web site for the
            management of the envelops database the workflow of the application
            is as follows : a costumer bring a package or an envelop to the post
            office, the post office employee will regester the envolop and scan
            its code and the system will automatically generate a tracking
            number for the envelop and the costumer will receive a receipt with
            the tracking number on it, the costumer can use the tracking number
            to track the status of the envelop on the web site.{" "}
          </p>
          <ul className="intership-project__content__list">
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>Flask</li>
          </ul>
        </div>
      </div>

      <div className="lineAnimation">
        <div className="gradientLine-both gradientLine-0" />
        <div className="iconContainer">
          <img
            src="./icons/calendar.png"
            width="25px"
            height="25px"
            alt="Internship-Project-1"
            border="0"
          />
        </div>
        <div className="gradientLine-end  gradientLine-1" />
        <div className="gradientLine-start gradientLine-2" />
        <div className="iconContainer">
          <img
            src="./icons/calendar.png"
            width="25px"
            height="25px"
            alt="Internship-Project-1"
            border="0"
          />
        </div>
        <div className="gradientLine-end  gradientLine-3" />
        <div className="gradientLine-start gradientLine-4" />
        <div className="iconContainer">
          <img
            src="./icons/calendar.png"
            width="25px"
            height="25px"
            alt="Internship-Project-1"
            border="0"
          />
        </div>
        <div className="gradientLine-both gradientLine-5" />
      </div>
    </section>
  );
}
