export const aboutContent = {
  name: "Abdelouahab Bella",
  location: "Agadir, Morocco",
  title: "Digital Adoption Consultant & Data Analytics Specialist",
  intro: "Abdelouahab Bella is a Digital Adoption Consultant and Data Analytics Specialist based in Agadir, Morocco, delivering WalkMe implementations across SAP Ariba, S/4HANA, Salesforce, ServiceNow, and Oracle for enterprise clients.",
  detailedIntro: "He turns user behavior data into adoption KPIs, ROI models, and executive-ready dashboards, backed by a technical foundation in Python, SQL, and ETL pipeline design. He holds a Master's in Big Data and Business Intelligence and works across the full analytics stack — from raw data to stakeholder-facing insight — while collaborating closely with cross-functional and multinational teams.",
  skills: [
    "WalkMe (SmartTips, SmartWalkThrus, Insights, Segmentation)",
    "SQL (Advanced), Python (Pandas, scripting)",
    "Power BI, GA4, Google Search Console, Microsoft Clarity",
    "User Behavior & Funnel Analytics",
    "Back-end (Django, FastAPI)",
    "Docker, GitLab CI/CD, PostgreSQL, Linux",
    "REST APIs",
    "Stakeholder Communication & Change Management"
  ]
};

// Each entry backs both the homepage cards (ServicesSection.jsx) and its own
// dedicated /services/:id page (ServiceDetailPage.jsx).
//
// relatedProjectTags match against the `tags` array on Firestore `projects`
// documents (see ProjectListPage.jsx's filter chips for the same field).
// Tags there are freeform and sparse — most appear on only one project — so
// ServiceDetailPage falls back to the most recent projects if a service's
// tags match fewer than a handful. "learning" has no natural tag cluster of
// its own (tutoring isn't a technology), so it deliberately relies entirely
// on that fallback to show a representative spread of work.
export const servicesContent = [
  {
    id: "ai",
    title: "AI solutions",
    icon: "/icons/AI.png",
    description: "Abdelouahab Bella delivers AI solutions including chatbots, predictive analytics, and automation to transform business operations and generate actionable insights. His expertise spans enterprise-grade AI integration, helping organizations stay ahead in today's data-centric environment.",
    longDescription: "From computer-vision systems to ETL pipelines that turn raw data into predictive, decision-ready insight, Abdelouahab Bella builds AI and automation that fits into how a business actually operates — not a demo that never ships. That includes chatbots and conversational interfaces, predictive analytics on operational data, and automating the manual reporting work that eats up a team's week.",
    relatedSkills: [
      "Python (Pandas, scripting, automation)",
      "Computer Vision (OpenCV)",
      "ETL pipeline design",
      "SQL (Advanced)",
      "Docker, GitLab CI/CD",
    ],
    relatedProjectTags: ["TensorFlow", "Deep Learning", "Chatbot", "YOLO", "Data Mining", "Algorithms", "DDQN"],
    buttonText: "Learn More",
    schemaType: "Service",
    serviceType: "AI Solutions & Automation",
  },
  {
    id: "web",
    title: "Web Development",
    icon: "/icons/web-dev.png",
    description: "Abdelouahab Bella has built 100+ websites blending creativity and functionality to deliver visually stunning, high-performance web applications. Specializing in both front-end and back-end development, he guarantees seamless performance and intuitive user interfaces for your digital success.",
    longDescription: "Full-stack web development from React front ends to Django/FastAPI back ends, REST APIs, and the SEO/performance work that makes a site actually findable. Recent work spans SaaS platforms, agency and NGO sites, and internal tools — deployed with Docker and CI/CD, not handed off as a one-off build.",
    relatedSkills: [
      "React, JavaScript",
      "Back-end (Django, FastAPI)",
      "Docker, GitLab CI/CD, PostgreSQL, Linux",
      "REST APIs",
      "SEO & technical performance",
    ],
    relatedProjectTags: ["React", "Angular", "Django", "Spring Boot", "JavaScript", "Tailwind CSS", "BootStrap", "Wordpress", "Nginx", "JWT", "CSS"],
    buttonText: "Hire Me",
    schemaType: "Service",
    serviceType: "Full-Stack Web Development",
  },
  {
    id: "learning",
    title: "Online Learning",
    icon: "/icons/online-learning.png",
    description: "Abdelouahab Bella offers personalized online tutoring to help you master programming languages and frameworks. Whether you're a beginner or an experienced coder, he provides tailored lessons to suit your learning style and help you achieve your goals.",
    longDescription: "One-on-one tutoring in Python, JavaScript, React, and Node.js, tailored to where you actually are — a first script or a production app. Lessons are built around real projects rather than generic exercises, drawing on the same stack used in the client work below.",
    relatedSkills: [
      "Python, JavaScript, React, Node.js",
      "SQL & data fundamentals",
      "Git & collaborative workflows",
      "Project-based curriculum design",
    ],
    relatedProjectTags: [],
    buttonText: "Contact Me",
    schemaType: "Service",
    serviceType: "Online Programming Tutoring",
  },
];

// Single canonical source for work history — used by InternshipProjectsSection.jsx
// (the homepage timeline) and ServiceDetailPage.jsx (each service's "Relevant
// Experience" list, filtered by the `services` tag below). Not every entry maps
// cleanly to one of the three services in servicesContent (e.g. WalkMe/SAP
// consulting isn't AI, web, or tutoring) — those are left untagged rather than
// force-fit, so they still appear on the homepage timeline but on no service page.
export const professionalExperience = [
  {
    title: "Digital ROI Auditor (Freelance)",
    description:
      "Abdelouahab Bella operates as an independent Digital ROI Auditor, providing free digital audits for Moroccan businesses while building a portfolio of proven case studies and measurable results. He leverages web analytics and user behavior data to identify conversion bottlenecks, improve local search visibility, and maximize digital ROI through actionable recommendations.",
    link: "",
    image: "/pro_exp/digital-roi-auditor.png",
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
    services: [],
  },
  {
    title: "Digital Adoption Consultant [eVia Services]",
    description:
      "Abdelouahab Bella delivered enterprise-scale WalkMe implementations across SAP Ariba, SAP S/4HANA, Salesforce, ServiceNow, and Oracle platforms. He designed adoption analytics dashboards, ROI models, and user behavior tracking solutions while coordinating multinational stakeholders throughout the software development lifecycle.",
    link: "",
    image: "/pro_exp/evia-services.png",
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
    services: [],
  },
  {
    title: "Python Developer & Automation Engineer (Freelance)",
    description:
      "Providing freelance Python development and automation engineering services specializing in backend systems, ETL workflow automation, CI/CD pipelines, scalable API development, and data migration solutions for client projects.",
    link: "",
    image: "/pro_exp/python_dev_automation.png",
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
    services: ["web"],
  },
  {
    title: "Data Engineer & BI Architect [COPAG]",
    description:
      "Contributed to an enterprise-scale data migration project transferring 100M+ records from legacy systems to a modern data platform. Developed Python ETL automation scripts with robust validation and logging mechanisms while assisting in CI/CD pipeline implementation and executive-level analytics delivery.",
    link: "",
    image: "/pro_exp/copag.png",
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
    services: ["ai"],
  },
  {
    title: "Backend Developer & Web Analyst [Smart Maint]",
    description:
      "Developed and deployed a SaaS platform serving 50+ users using Django and FastAPI. Designed automated CI/CD pipelines enabling zero-downtime deployments, implemented infrastructure monitoring solutions, and optimized SEO performance to achieve first-page search rankings for target keywords.",
    link: "",
    image: "/pro_exp/smart-maint.jpg",
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
    services: ["web"],
  },
  {
    title: "Full Stack Engineer [NidInnovation]",
    description:
      "Developed and delivered a modern company website and digital platform showcasing NidInnovation's services and offerings while implementing scalable full-stack architecture and responsive user experiences.",
    link: "",
    image: "/pro_exp/nidinnovation.png",
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
    services: ["web"],
  },
  {
    title: "Smart Parking System [AGRI 4.0]",
    description:
      "Developed a production-grade computer vision solution for a government-funded smart parking initiative, achieving 99% real-time parking spot detection accuracy and contributing to securing follow-on investor funding through advanced image processing techniques.",
    link: "",
    image: "/pro_exp/agri4.0.png",
    startDate: "Apr 2023",
    endDate: "Jun 2023",
    technologies: ["Python", "OpenCV", "FastAPI", "Computer Vision", "Linux"],
    services: ["ai"],
  },
  {
    title:
      "CRJEA Website : Reference Center for Young Entrepreneurs [UM6P & CRJEA]",
    description:
      "Developed a multi-administrator platform providing project and beneficiary management capabilities for young entrepreneurs and agricultural cooperatives. Integrated REST APIs and implemented client-facing features enabling seamless data exchange and user management.",
    link: "",
    image: "/pro_exp/um6p_crjea.png",
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
    services: ["web"],
  },
  {
    title: "E-Khsab: A Connected Cow Monitoring System [AGRI 4.0]",
    description:
      "Developed IoT-powered livestock analytics solutions for real-time cattle monitoring, artificial insemination planning, and heat detection. The platform automated breeding and health monitoring workflows, reducing manual intervention while enabling predictive analytics capabilities across multiple breeding sites.",
    link: "",
    image: "/pro_exp/agri4.0.png",
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
    services: ["ai", "web"],
  },
];

export const faqData = [
  {
    id: "q1",
    question: "Do you provide services in Agadir?",
    answer: "Yes, I provide digital adoption, web development, and analytics services in Agadir for enterprise teams and small businesses."
  },
  {
    id: "q2",
    question: "Can I get an SEO audit for my website?",
    answer: "Yes, I offer SEO audits and technical website reviews with actionable recommendations for better visibility and faster performance."
  },
  {
    id: "q3",
    question: "Are you a web developer?",
    answer: "Yes, I am a web developer building React front ends, Django/FastAPI back ends, REST APIs, and SEO-friendly web applications."
  },
  {
    id: "q4",
    question: "Do you offer WalkMe consulting in Morocco?",
    answer: "Yes, I offer WalkMe consulting across Morocco, including SmartTips, SmartWalkThrus, Insights, and adoption analytics for enterprise tools."
  },
  {
    id: "q5",
    question: "Can you do remote digital adoption consulting?",
    answer: "Yes, I work remotely with clients worldwide to deliver digital adoption consulting, onboarding automation, and analytics support."
  },
  {
    id: "q6",
    question: "Are you a Power BI expert in Agadir?",
    answer: "Yes, I am a Power BI expert in Agadir, creating dashboards, integrating GA4, and delivering SQL-powered analytics for local and international clients."
  },
  {
    id: "q7",
    question: "Do you work as a data analyst freelancer in Morocco?",
    answer: "Yes, I work as a data analyst freelancer in Morocco, specializing in dashboards, user behavior metrics, and executive reporting."
  },
  {
    id: "q8",
    question: "Can you implement WalkMe for SAP Ariba?",
    answer: "Yes, I can implement WalkMe for SAP Ariba and related enterprise systems to improve adoption, reduce support tickets, and measure success."
  }
];

export const contactContent = {
  title: "Get in Touch",
  content: "Abdelouahab Bella is currently taking on freelance and consulting projects as an independent auto-entrepreneur in Agadir, Morocco. If you need help with digital adoption, data analytics, or web development, his inbox is open — let's talk about how he can help your business grow.",
  buttonText: "Get in Touch",
  email: "" // User left it blank in the component
};
