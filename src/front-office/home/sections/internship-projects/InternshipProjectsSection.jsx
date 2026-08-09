import { useEffect, useRef, useState, useCallback } from "react";

const PROFESSIONAL_EXP = [
  {
    title: "Digital ROI Auditor (Freelance)",
    description:
      "Abdelouahab Bella operates as an independent Digital ROI Auditor, providing free digital audits for Moroccan businesses while building a portfolio of proven case studies and measurable results. He leverages web analytics and user behavior data to identify conversion bottlenecks, improve local search visibility, and maximize digital ROI through actionable recommendations.",
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
      "Abdelouahab Bella delivered enterprise-scale WalkMe implementations across SAP Ariba, SAP S/4HANA, Salesforce, ServiceNow, and Oracle platforms. He designed adoption analytics dashboards, ROI models, and user behavior tracking solutions while coordinating multinational stakeholders throughout the software development lifecycle.",
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

// The two date pills in the marker column are identical, so the class list lives
// here rather than twice per row.
const DATE_PILL =
  "rounded-full border border-success/20 bg-success/10 px-1.5 py-0.625 text-center font-mono text-xs whitespace-nowrap text-[#7fd9ac]";

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
    <section className="internship-projects-section relative w-full bg-[#0a0a0a] bg-[linear-gradient(to_bottom,#171717,transparent_30px)] pt-7.5 pb-13.25">
      {/* `home-sections-title` is styled in shared/styles/minw-1000.css, which is
          unlayered and therefore outranks the whole `utilities` layer — so this
          section's long-standing font-size override needs `!` to land. It is
          deliberately not responsive: the old `.experience .home-sections-title`
          rule outranked the mobile media query, so this heading was 20px at
          every width. mb/centring set properties the global never touches. */}
      <div className="home-sections-title mb-7.5 text-center text-xl!">
        <span>04. </span>
        <h2>Professional Experience</h2>
      </div>

      {/* Desktop is a three-column grid — [card][marker][card] — so the date
          pills get a lane of their own and never crowd a card. Below 900px
          (a JS breakpoint, because the snake SVG has to be skipped too) it
          collapses to a row of [marker strip][card]. */}
      <div
        className={
          isMobile
            ? "relative mx-auto flex max-w-400 flex-col gap-6.25 px-[5%]"
            : "relative mx-auto grid max-w-400 grid-cols-[1fr_190px_1fr] gap-x-0 gap-y-10 px-[3%]"
        }
        ref={containerRef}
      >
        {!isMobile && (
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d={pathState.d}
              className="stroke-success stroke-3 [stroke-linecap:round] filter-[drop-shadow(0_0_5px_rgba(42,193,127,0.55))]"
              fill="none"
            />
            {/* opacity and cx/cy are driven from the rAF loop above via inline
                style/attributes, which outrank these utilities. */}
            <circle
              ref={glowRef}
              className="fill-[#7cf5c4] opacity-0 transition-opacity duration-200 ease-standard filter-[drop-shadow(0_0_8px_#2ac17f)_drop-shadow(0_0_16px_rgba(42,193,127,0.6))]"
              r="6"
            />
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
        <div className="mt-3.75 flex justify-center">
          <button
            onClick={handleShowMore}
            aria-label="Show more professional experience entries"
            className="cursor-pointer rounded-full border-none bg-[#268b60] px-4 py-1.75 font-medium text-ink-strong transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:bg-success hover:shadow-[0_8px_20px_rgba(42,193,127,0.25)]"
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
    <div
      className={[
        "z-1 flex flex-col items-center justify-center gap-1.25",
        isMobile ? "shrink-0 pt-3" : "pt-4",
      ].join(" ")}
    >
      <span className={DATE_PILL}>{project.endDate}</span>
      {/* `timeline-marker-dot` is NOT decorative — buildPath() queries it to read
          the dot centres the snake curve is drawn through. Keep the class.
          The 64px nudge pushes the dot toward the card it belongs to; on mobile
          the marker is a straight strip so there is nothing to nudge. */}
      <span
        className={[
          "timeline-marker-dot size-3.5 shrink-0 rounded-full border-[3px] border-success bg-[#0a0a0a]",
          "shadow-[0_0_0_4px_rgba(42,193,127,0.15),0_0_12px_rgba(42,193,127,0.4)]",
          isMobile ? "" : align === "left" ? "-translate-x-16" : "translate-x-16",
        ].join(" ")}
      />
      <span className={DATE_PILL}>{project.startDate}</span>
    </div>
  );

  const card = (
    // Replaced manual JS Class manipulations for `isVisible` state conditional Class rendering.
    // `timeline-card-inner` is queried by the IntersectionObserver below — keep it.
    <div
      className={[
        "timeline-card-inner will-change-[opacity,transform] transition-[opacity,transform] duration-700 ease-standard",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
      ].join(" ")}
      data-index={index}
    >
      {/* `group` so the panel hover can also scale the thumbnail. */}
      <div className="group flex flex-col overflow-hidden rounded-lg border border-success/15 bg-[#202020] transition-[transform,border-color,box-shadow] duration-300 ease-standard hover:-translate-y-1 hover:border-success/40 hover:shadow-lg">
        <div className="aspect-20/8 w-full overflow-hidden bg-[#111]">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-500 ease-standard group-hover:scale-105"
          />
        </div>
        <div className="px-5 pt-4 pb-5">
          <h3 className="mb-1.875 text-xs leading-[1.3] font-bold text-ink-strong sm:text-sm">
            {project.title}
          </h3>
          <p className="mb-3.125 text-xs leading-[1.65] text-ink">
            {project.description}
          </p>
          <ul className="mb-3.125 flex flex-wrap gap-1.25 p-1.25">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-success/25 bg-success/10 px-1.875 py-0.875 text-xs font-medium text-[#4fd99a]"
              >
                {tech}
              </li>
            ))}
          </ul>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.25 rounded-md border border-success bg-transparent px-2.5 py-1.375 text-xs font-medium text-ink-strong no-underline transition-all duration-200 ease-standard hover:gap-1.625 hover:bg-success hover:text-[#0a0a0a]"
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
      <div className="flex items-start gap-2.5">
        {marker}
        {card}
      </div>
    );
  }

  // `contents` dissolves this wrapper so its three children become direct items
  // of the .timeline grid and share one row.
  return (
    <div className="contents">
      {align === "left" ? card : <div />}
      {marker}
      {align === "right" ? card : <div />}
    </div>
  );
}
