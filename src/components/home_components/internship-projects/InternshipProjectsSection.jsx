import { useEffect, useRef, useState, useCallback } from "react";
import "./internship_projects.wide.css";

const PROJECTS = [
  {
    title: "S-maint Website [Smart Maintenance]",
    description:
      "Smart Maintenance is a Moroccan company that offers a wide range of services in the field of maintenance. The website is a platform that provides information about the company and its services, and it also allows users to contact the company for more information or to request a service. The website features a blog, services, staff management, and digital resources management.",
    link: "https://s-maint.com",
    image: "./internshipes/smart-maint.jpg",
    startDate: "Add start date",
    endDate: "Add end date",
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
    startDate: "Add start date",
    endDate: "Add end date",
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
      "Development of e-services to monitor in real-time the health status and well-being of cows, plan artificial inseminations, enhance herd reproduction, and implement a heat detection system within a core group of breeders, extended to a larger number of breeders on a national scale.",
    link: "https://poledigital.ma/projets/projets-elevage-4-0/e-khsab",
    image: "./internshipes/agri4.0.png",
    startDate: "Add start date",
    endDate: "Add end date",
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
      "The CRJEA is a reference center that offers tailored support to young project holders or newly created companies and cooperatives in the field of agriculture. The website is a platform that provides a full tracking system for the projects and the project holders.",
    link: "http://crjea-rsk.com",
    image: "./internshipes/crjea.jpg",
    startDate: "Add start date",
    endDate: "Add end date",
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
      "During this internship, I created a desktop application using JavaFX as a UI library and Oracle as a database. The application is used to manage the sending of packages for special clients (lawyers, journalists, writers), so they no longer need to wait in lines. It is used daily by post office employees.",
    image: "./internshipes/1200px-GBAM_LOGO.png",
    startDate: "Add start date",
    endDate: "Add end date",
    technologies: ["JavaFX", "Oracle - Cloud", "XML", "CSS", "Python", "SMTP"],
  },
  {
    title: "A Web Site For Envelope Database Management",
    description:
      "During this internship, I worked on a website for managing the envelope database. Workflow: a customer brings a package or envelope to the post office, the employee registers it and scans its code, and the system automatically generates a tracking number, printed on a receipt for the customer.",
    image: "./internshipes/PosteMaroc.jpg",
    startDate: "Add start date",
    endDate: "Add end date",
    technologies: ["HTML", "CSS", "JavaScript", "Flask"],
  },
];

const MOBILE_BREAKPOINT = 900;

export default function InternshipProjectsSection() {
  const [displayCount, setDisplayCount] = useState(3);
  const [pathState, setPathState] = useState({ d: "", points: [] });
  const [isMobile, setIsMobile] = useState(false);
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(-1);

  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const glowRef = useRef(null);

  const targetLengthRef = useRef(0);
  const currentLengthRef = useRef(0);
  const prevTotalLengthRef = useRef(0);
  const animFrameRef = useRef(null);

  const handleShowMore = () => setDisplayCount(PROJECTS.length);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ---------- Build the snake path & store dot points coordinates ----------
  const buildPath = useCallback(() => {
    if (isMobile || !containerRef.current) {
      setPathState({ d: "", points: [] });
      return;
    }
    const dots = containerRef.current.querySelectorAll(".timeline-marker-dot");
    if (dots.length < 2) {
      setPathState({ d: "", points: [] });
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const points = Array.from(dots).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - containerRect.left,
        y: r.top + r.height / 2 - containerRect.top,
      };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
    setPathState({ d, points });
  }, [isMobile]);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(buildPath);
    });
    if (document.fonts?.ready) document.fonts.ready.then(buildPath);
    window.addEventListener("resize", buildPath);
    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", buildPath);
    };
  }, [buildPath, displayCount, isMobile]);

  // ---------- Draw progress of the snake exactly to the last revealed card ----------
  useEffect(() => {
    if (!pathRef.current || pathState.points.length === 0) return;
    const pathEl = pathRef.current;

    let totalLength = 0;
    try {
      totalLength = pathEl.getTotalLength();
    } catch (e) {
      return;
    }
    if (totalLength === 0) return;

    // Scale current length if window gets resized to prevent jarring jumps
    if (
      prevTotalLengthRef.current &&
      prevTotalLengthRef.current !== totalLength
    ) {
      currentLengthRef.current =
        currentLengthRef.current * (totalLength / prevTotalLengthRef.current);
    }
    prevTotalLengthRef.current = totalLength;

    let targetL = 0;
    if (maxVisibleIndex === -1) {
      targetL = 0;
    } else {
      const targetIdx = Math.min(maxVisibleIndex, pathState.points.length - 1);
      const targetY = pathState.points[targetIdx].y;

      if (targetIdx === pathState.points.length - 1) {
        targetL = totalLength;
      } else if (targetIdx === 0) {
        targetL = 0;
      } else {
        // Binary search the exact segment length matching the Target dot Y
        let low = 0,
          high = totalLength;
        for (let i = 0; i < 20; i++) {
          const mid = (low + high) / 2;
          const pt = pathEl.getPointAtLength(mid);
          if (pt.y < targetY) {
            targetL = mid;
            low = mid;
          } else {
            high = mid;
          }
        }
      }
    }

    targetLengthRef.current = targetL;
    let cancel = false;

    // Request animation loop tracking target dynamically
    const animate = () => {
      if (cancel) return;
      const diff = targetLengthRef.current - currentLengthRef.current;

      if (Math.abs(diff) < 0.5) {
        currentLengthRef.current = targetLengthRef.current;
      } else {
        currentLengthRef.current += diff * 0.08; // easing speed
        animFrameRef.current = requestAnimationFrame(animate);
      }

      const l = currentLengthRef.current;
      pathEl.style.strokeDasharray = `${totalLength}`;
      pathEl.style.strokeDashoffset = `${totalLength - l}`;

      if (glowRef.current) {
        if (maxVisibleIndex > -1) {
          try {
            const pt = pathEl.getPointAtLength(l);
            glowRef.current.setAttribute("cx", pt.x);
            glowRef.current.setAttribute("cy", pt.y);
            glowRef.current.style.opacity = "1";
          } catch (e) {}
        } else {
          glowRef.current.style.opacity = "0";
        }
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancel = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [maxVisibleIndex, pathState]);

  // ---------- IntersectionObserver specifically updating state  ----------
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") {
      return;
    }
    const cards = Array.from(
      containerRef.current.querySelectorAll(".timeline-card-inner"),
    );
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let highest = -1;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute("data-index"), 10);
            if (!isNaN(idx) && idx > highest) {
              highest = idx;
            }
            observer.unobserve(entry.target);
          }
        });
        if (highest !== -1) {
          setMaxVisibleIndex((prev) => Math.max(prev, highest));
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [displayCount, isMobile]);

  return (
    <section className="internship-projects-section">
      <div className="experience">
        <div className="home-sections-title">
          <span>04. </span>
          <h2>Professional Experience</h2>
        </div>
      </div>

      <div
        className={`timeline ${isMobile ? "timeline--mobile" : ""}`}
        ref={containerRef}
      >
        {!isMobile && (
          <svg className="timeline-snake" aria-hidden="true">
            <path
              ref={pathRef}
              d={pathState.d}
              className="timeline-snake__path"
              fill="none"
            />
            <circle ref={glowRef} className="timeline-snake__glow" r="6" />
          </svg>
        )}

        {PROJECTS.slice(0, displayCount).map((project, index) => {
          const align = isMobile ? "left" : index % 2 === 0 ? "left" : "right";
          return (
            <ProjectRow
              key={project.title}
              project={project}
              align={align}
              isMobile={isMobile}
              index={index}
              isVisible={index <= maxVisibleIndex}
            />
          );
        })}
      </div>

      {displayCount < PROJECTS.length && (
        <div className="show-more-button">
          <button
            onClick={handleShowMore}
            aria-label="Show more professional experience entries"
          >
            View More Experience ({PROJECTS.length - displayCount})
          </button>
        </div>
      )}
    </section>
  );
}

function ProjectRow({ project, align, isMobile, index, isVisible }) {
  const marker = (
    <div className="timeline-marker-col">
      <span className="timeline-date timeline-date--start">
        {project.startDate}
      </span>
      <span className={`timeline-marker-dot timeline-marker-dot--${align}`} />
      <span className="timeline-date timeline-date--end">
        {project.endDate}
      </span>
    </div>
  );

  const card = (
    // Replaced manual JS Class manipulations for `isVisible` state conditional Class rendering
    <div
      className={`timeline-card-inner ${isVisible ? "is-visible" : ""}`}
      data-index={index}
    >
      <div className="timeline-card__panel">
        <div className="timeline-card__img">
          <img src={project.image} alt={project.title} loading="lazy" />
        </div>
        <div className="timeline-card__content">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <ul className="timeline-card__tech">
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="timeline-card__link"
              aria-label={`Visit ${project.title} project website`}
            >
              Visit project website
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="timeline-row timeline-row--mobile">
        {marker}
        {card}
      </div>
    );
  }

  return (
    <div className="timeline-row">
      {align === "left" ? card : <div />}
      {marker}
      {align === "right" ? card : <div />}
    </div>
  );
}
