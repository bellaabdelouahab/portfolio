import { useEffect, useState, useRef } from "react";
import "./internship_projects.wide.css";

export default function InternshipProjectsSection() {
  const [projects, setProjects] = useState([
    {
      title: "S-maint Website [Smart Maintenance]",
      description:
        "Smart Maintenance is a Moroccan company that offers" +
        "a wide range of services in the field of maintenance." +
        " The website is a platform that provides information about" +
        " the company and its services, and it also allows users to" +
        " contact the company for more information or to request a service." +
        " The website various features such as a blog, services, staff management," +
        " and digital resources management.",
      link: "https://s-maint.com",
      image: "./internshipes/smart-maint.jpg",
      technologies: [
        "Angular",
        "Spring Boot",
        "Mongodb",
        "Docker",
        "Nginx",
        "Plausible",
        "SendGrid",
      ],
    },
    {
      title: "NidInnovation Website",
      description:
        "Nid Innovation is a Moroccan company that offers a wide range of services in the field of innovation. The website is a platform that provides information about the company and its services, and it also allows users to contact the company for more information or to request a service.",
      link: "https://nidinnovation.com",
      image: "./internshipes/nidinnovation.png",
      technologies: [
        "React",
        "PHP",
        "Node.js",
        "Express",
        "MongoDB",
        "Docker",
        "SendGrid",
      ],
    },
    {
      title: "E-khsab: A Connected Cow Monitoring System [Agri4.0]",
      description:
        "Development of e-services to monitor in real-time the health status and well-being of cows, plan artificial inseminations, enhance herd reproduction, and implement a heat detection system within a core group of breeders, which will be extended to a larger number of breeders on a national scale.",
      link: "https://poledigital.ma/projets/projets-elevage-4-0/e-khsab",
      image: "./internshipes/agri4.0.png",
      technologies: [
        "Spring Boot",
        "JHipster",
        "React",
        "PostgreSQL",
        "RabbitMQ",
        "WebSockets",
        "Arduino",
      ],
    },
    {
      title:
        "CRJEA Website : Reference Center for Young Entrepreneurs [UM6P & CRJEA]",
      description:
        "The CRJEA is a reference center that offers tailored support to young project holders or newly created companies and cooperatives. in the field of agriculture. The website is a platform that provides a full tracking system for the projects and the project holders.",
      link: "http://crjea-rsk.com",
      image: "./internshipes/crjea.jpg",
      technologies: [
        "Django",
        "React",
        "Bootstrap",
        "MongoDB",
        "Docker",
        "Nginx",
      ],
    },
    {
      title:
        "Desktop application for managing package sending for special clients",
      description:
        "During this internship, I created a desktop application using JavaFX as a UI library and Oracle as a database. The application is used to manage the sending of packages for special clients (Lawyers, Journalists, Writers). This application was created to make it easy for them to send packages instead of waiting in lines. The application is used by the post office employees.",
      image: "./internshipes/1200px-GBAM_LOGO.png",
      technologies: [
        "JavaFX",
        "Oracle - Cloud",
        "XML",
        "CSS",
        "Python",
        "SMTP",
      ],
    },
    {
      title: "A Web Site For Envelope Database Management",
      description:
        "During this internship, I worked on a website for the management of the envelopes database. The workflow of the application is as follows: a customer brings a package or an envelope to the post office, the post office employee will register the envelope and scan its code, and the system will automatically generate a tracking number for the envelope which the customer will receive a receipt with.",
      image: "./internshipes/PosteMaroc.jpg",
      technologies: ["HTML", "CSS", "JavaScript", "Flask"],
    },
  ]);
  const ref = useRef(null);
  const [displayCount, setDisplayCount] = useState(3);

  const handleShowMore = () => {
    setDisplayCount(projects.length);
  };

  const handleReset = () => {
    setDisplayCount(3);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: null, // relative to the viewport
        rootMargin: "0px",
        threshold: 0.1, // 10% of the item is visible
      }
    );

    const elements = ref.current.querySelectorAll(".animatable");
    elements.forEach((el) => observer.observe(el));

    const internshipProjects = document.querySelectorAll(".internship-project");
    internshipProjects.forEach((project, index) => {
      const height = project.clientHeight;
      const lineAnimation = document.querySelectorAll(
        `.gradientLine-${index * 2}, .gradientLine-${index * 2 + 1}`
      );
      lineAnimation.forEach((line) => (line.style.height = `${height / 2}px`));
    });

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [displayCount, projects]);

  return (
    <section className="internship-projects-section" ref={ref}>
      <div className="experience">
        <div className="home-sections-title">
          <span>04. </span>
          Professional Experience
        </div>
      </div>
      <div className="internship-projects-section__projects">
        {projects.slice(0, displayCount).map((project, index) => (
          <InternshipProject key={index} project={project} />
        ))}
        <div className="lineAnimation">
          {projects.slice(0, displayCount).map((_, index) => (
            <div className="animatable" key={index}>
              <div className={`gradientLine-start gradientLine-${index * 2}`} />
              <div className="iconContainer">
                <img src="./icons/calendar.png" alt="Calendar" width="30" />
              </div>
              <div
                className={`gradientLine-end gradientLine-${index * 2 + 1}`}
              />
            </div>
          ))}
        </div>

        {displayCount < projects.length ? (
          <div className="show-more-button">
            <button onClick={handleShowMore}>
              Show More ({projects.length - displayCount})
            </button>
          </div>
        ) : (
          <div className="show-more-button">
            <button onClick={handleReset}>Hide</button>
          </div>
        )}
      </div>
    </section>
  );
}

function InternshipProject({ project }) {
  return (
    <div className="internship-project ">
      <div className="internship-project__img">
        <img src={project.image} alt={project.title} />
      </div>
      <div className="internship-project__content">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            className="internship-project__content__link"
          >
            <img src="./icons/site.png" alt="Link icon" width="20" />
            Link to website for more details
          </a>
        )}
        <ul className="internship-project__content__list">
          {project.technologies.map((tech, idx) => (
            <li key={idx}>{tech}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
