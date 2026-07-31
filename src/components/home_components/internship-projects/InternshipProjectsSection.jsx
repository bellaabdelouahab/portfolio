import { useEffect, useRef, useState, useCallback } from "react";
import "./internship_projects.wide.css";

const PROFESSIONAL_EXP = [
  {
    title: "Digital ROI Auditor (Freelance)",
    description:
      "Operating as an independent consultant providing free digital audits for Moroccan businesses while building a portfolio of proven case studies and measurable results. Leveraging web analytics and user behavior data to identify conversion bottlenecks, improve local search visibility, and maximize digital ROI through actionable recommendations.",
    link: "",
    image: "./pro_exp/digital-roi-auditor.png",
    startDate: "Apr 2026",
    endDate: "Present",
    technologies: [
      "Microsoft Clarity",
      "Google Analytics 4",
      "Google Search Console",
      "SEO",
      "Web Analytics",
      "Data Analysis",
    ],
  },
  {
    title: "Digital Adoption Consultant [eVia Services]",
    description:
      "Delivered enterprise-scale WalkMe implementations across SAP Ariba, SAP S/4HANA, Salesforce, ServiceNow, and Oracle platforms. Designed adoption analytics dashboards, ROI models, and user behavior tracking solutions while coordinating multinational stakeholders throughout the software development lifecycle.",
    link: "",
    image: "./pro_exp/evia-services.png",
    startDate: "Nov 2025",
    endDate: "Present",
    technologies: [
      "WalkMe",
      "SAP Ariba",
      "SAP S/4HANA",
      "Salesforce",
      "ServiceNow",
      "Oracle",
      "SQL",
      "Analytics",
    ],
  },
  {
    title: "Python Developer & Automation Engineer (Freelance)",
    description:
      "Providing freelance Python development and automation engineering services specializing in backend systems, ETL workflow automation, CI/CD pipelines, scalable API development, and data migration solutions for client projects.",
    link: "",
    image: "./pro_exp/python_dev_automation.png",
    startDate: "Sep 2025",
    endDate: "Apr 2026",
    technologies: [
      "Python",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "Docker",
      "GitHub",
      "CI/CD",
    ],
  },
  {
    title: "Data Engineer & BI Architect [COPAG]",
    description:
      "Contributed to an enterprise-scale data migration project transferring 100M+ records from legacy systems to a modern data platform. Developed Python ETL automation scripts with robust validation and logging mechanisms while assisting in CI/CD pipeline implementation and executive-level analytics delivery.",
    link: "",
    image: "./pro_exp/copag.png",
    startDate: "Jun 2025",
    endDate: "Sep 2025",
    technologies: [
      "Python",
      "Pandas",
      "SQL",
      "Power BI",
      "Ansible",
      "GitLab CI/CD",
      "Linux",
    ],
  },
  {
    title: "Backend Developer & Web Analyst [Smart Maint]",
    description:
      "Developed and deployed a SaaS platform serving 50+ users using Django and FastAPI. Designed automated CI/CD pipelines enabling zero-downtime deployments, implemented infrastructure monitoring solutions, and optimized SEO performance to achieve first-page search rankings for target keywords.",
    link: "",
    image: "./pro_exp/smart-maint.jpg",
    startDate: "Mar 2024",
    endDate: "Jan 2025",
    technologies: [
      "Django",
      "FastAPI",
      "Docker",
      "GitLab CI/CD",
      "PostgreSQL",
      "Linux",
      "SEO",
    ],
  },
  {
    title: "Full Stack Engineer [NidInnovation]",
    description:
      "Developed and delivered a modern company website and digital platform showcasing NidInnovation's services and offerings while implementing scalable full-stack architecture and responsive user experiences.",
    link: "",
    image: "./pro_exp/nidinnovation.png",
    startDate: "Apr 2024",
    endDate: "Jun 2024",
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
    title: "Smart Parking System [AGRI 4.0]",
    description:
      "Developed a production-grade computer vision solution for a government-funded smart parking initiative, achieving 99% real-time parking spot detection accuracy and contributing to securing follow-on investor funding through advanced image processing techniques.",
    link: "",
    image: "./pro_exp/agri4.0.png",
    startDate: "Apr 2023",
    endDate: "Jun 2023",
    technologies: ["Python", "OpenCV", "FastAPI", "Computer Vision", "Linux"],
  },
  {
    title:
      "CRJEA Website : Reference Center for Young Entrepreneurs [UM6P & CRJEA]",
    description:
      "Developed a multi-administrator platform providing project and beneficiary management capabilities for young entrepreneurs and agricultural cooperatives. Integrated REST APIs and implemented client-facing features enabling seamless data exchange and user management.",
    link: "",
    image: "./pro_exp/um6p_crjea.png",
    startDate: "Aug 2022",
    endDate: "Jan 2023",
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
    title: "E-Khsab: A Connected Cow Monitoring System [AGRI 4.0]",
    description:
      "Developed IoT-powered livestock analytics solutions for real-time cattle monitoring, artificial insemination planning, and heat detection. The platform automated breeding and health monitoring workflows, reducing manual intervention while enabling predictive analytics capabilities across multiple breeding sites.",
    link: "",
    image: "./pro_exp/agri4.0.png",
    startDate: "Oct 2021",
    endDate: "Dec 2021",
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
  // {
  //   title:
  //     "Desktop Application for Managing Package Sending for Special Clients",
  //   description:
  //     "Developed a JavaFX desktop application used by postal employees to manage package delivery services for special clients, including lawyers, journalists, and writers. The system streamlined package registration processes and significantly reduced customer waiting times.",
  //   link: "",
  //   image: "",
  //   startDate: "Add start date",
  //   endDate: "Add end date",
  //   technologies: ["JavaFX", "Oracle Cloud", "XML", "CSS", "Python", "SMTP"],
  // },
  // {
  //   title: "Envelope Database Management System",
  //   description:
  //     "Developed a web-based platform for managing postal envelope and package registrations. The system automated tracking number generation and receipt printing workflows, improving operational efficiency for postal service employees and customers.",
  //   link: "",
  //   image: "",
  //   startDate: "Add start date",
  //   endDate: "Add end date",
  //   technologies: ["HTML", "CSS", "JavaScript", "Flask"],
  // },
];

const MOBILE_BREAKPOINT = 900;

export default function InternshipProjectsSection() {
  const [displayCount, setDisplayCount] = useState(4);
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

  const handleShowMore = () => setDisplayCount(PROFESSIONAL_EXP.length);

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

        {PROFESSIONAL_EXP.slice(0, displayCount).map((project, index) => {
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

      {displayCount < PROFESSIONAL_EXP.length && (
        <div className="show-more-button">
          <button
            onClick={handleShowMore}
            aria-label="Show more professional experience entries"
          >
            View More Experience ({PROFESSIONAL_EXP.length - displayCount})
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
        {project.endDate}
      </span>
      <span className={`timeline-marker-dot timeline-marker-dot--${align}`} />
      <span className="timeline-date timeline-date--end">
        {project.startDate}
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
