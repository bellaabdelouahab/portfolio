export const aboutContent = {
  name: "Abdelouahab Bella",
  location: "Agadir, Morocco",
  title: "Web Developer & Data Analyst",
  intro: "Abdelouahab Bella is a freelance web developer and data analyst based in Agadir, Morocco. He builds business websites and web applications, and turns raw data into dashboards and reports that teams use to make decisions.",
  detailedIntro: "He holds a Master's in Big Data and Business Intelligence and has worked on enterprise data migration, Power BI reporting and SaaS platforms. Clients get one person who can build the product and measure how it performs, from the first sketch to deployment and monitoring.",
  skills: [
    "React, JavaScript, Django, FastAPI",
    "Docker, CI/CD, PostgreSQL, Linux",
    "SQL (Advanced), Python (Pandas)",
    "Power BI, DAX, ETL pipelines",
    "GA4, Search Console, Microsoft Clarity",
    "SEO and web performance",
    "REST APIs and integrations",
    "Client communication in English, French, Arabic"
  ]
};

// Each entry backs both the homepage cards (ServicesSection.jsx) and its own
// dedicated /services/:id page (ServiceDetailPage.jsx).
//
// relatedProjectTags match against the `tags` array on Firestore `projects`
// documents. ServiceDetailPage falls back to the most recent projects if a
// service's tags match fewer than a handful.
// startingPrice is shown in MAD; budgets in the inquiry forms use the same unit.
export const servicesContent = [
  {
    id: "web",
    title: "Web Development",
    icon: "/icons/web-dev.png",
    description: "Business websites, online stores, booking and management platforms, and internal tools. WordPress or Shopify for a fast launch, a custom build with Django or Next.js when you need more.",
    longDescription: "Business websites, web applications and internal tools, designed for the people who use them and built to be maintained. Work covers the interface, the back end and the database, the deployment on a server you own, and the SEO and performance basics that decide whether the site gets found.",
    deliverables: [
      "Responsive website or web application, fully tested on phone and laptop",
      "Back end, database and admin area you can use without a developer",
      "Deployment on your domain with HTTPS, backups and monitoring",
      "On-page SEO, analytics and a performance report",
      "Source code, documentation and a handover session",
    ],
    process: [
      ["Discovery call", "30 minutes to define goals, users and scope. Free."],
      ["Proposal", "Fixed scope, timeline and price in MAD within two working days."],
      ["Build", "Weekly demos on a private preview link so nothing is a surprise."],
      ["Launch and support", "Deployment, handover and 30 days of fixes included."],
    ],
    startingPrice: "Starting from 6,000 MAD",
    priceFrom: 6000,
    seoTitle: "Web Development in Agadir, Morocco",
    seoDescription: "Freelance web developer in Agadir: business websites, online stores and web apps with WordPress, Shopify, Django or Next.js. Written quote in MAD.",
    relatedSkills: [
      "WordPress and Shopify",
      "React, Next.js, Tailwind CSS",
      "Django, FastAPI, Node.js",
      "PostgreSQL, MongoDB, SQLite",
      "Docker, CI/CD, Nginx, Linux",
      "SEO and technical performance",
    ],
    relatedProjectTags: ["React", "Angular", "Django", "Spring Boot", "JavaScript", "Tailwind CSS", "BootStrap", "Wordpress", "Nginx", "JWT", "CSS", "Node.js"],
    buttonText: "Start a Project",
    schemaType: "Service",
    serviceType: "Web Development",
  },
  {
    id: "data",
    title: "Data Analytics",
    icon: "/icons/AI.png",
    description: "Dashboards, reports and data pipelines that answer the questions your team asks every week. Power BI, SQL and Python, from messy exports to a screen people actually open.",
    longDescription: "Dashboards, automated reports and data pipelines for teams that still work from spreadsheets and exports. Work covers cleaning and modelling the data, building the dashboard in Power BI or on the web, and automating the refresh so the numbers are current without anyone copying files.",
    deliverables: [
      "Interactive dashboard (Power BI or web) built around your decisions",
      "Cleaned, documented data model and automated refresh",
      "KPI definitions agreed with your team, written down",
      "Web and sales analytics setup with GA4 and Search Console",
      "Training session so your team can read and extend it",
    ],
    process: [
      ["Discovery call", "30 minutes on the questions you need answered. Free."],
      ["Data review", "Audit of your sources, quality problems and a feasibility note."],
      ["Build", "Model, dashboard and automation, reviewed with you at each step."],
      ["Handover", "Documentation, training and 30 days of adjustments included."],
    ],
    startingPrice: "Starting from 3,000 MAD",
    priceFrom: 3000,
    seoTitle: "Power BI Dashboards in Morocco",
    seoDescription: "Freelance data analyst in Morocco: Power BI dashboards, automated Excel and SQL reporting and Python pipelines, starting from 3,000 MAD.",
    relatedSkills: [
      "Power BI, DAX, Excel automation",
      "SQL (Advanced), SQL Server, PostgreSQL",
      "Python (Pandas), ETL automation",
      "GA4, Search Console, Microsoft Clarity",
      "Machine learning and computer vision",
    ],
    relatedProjectTags: ["Power Bi", "DAX", "ETL", "SQL Server", "Data", "Data Analytics", "TensorFlow", "Deep Learning", "YOLO", "Data Mining"],
    buttonText: "Discuss Your Data",
    schemaType: "Service",
    serviceType: "Data Analytics and Business Intelligence",
  },
];

// Single canonical source for work history, used by the homepage timeline and
// by each service page's "Relevant Experience" list (filtered by `services`).
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
    services: ["data", "web"],
  },
  {
    title: "Data & Analytics Consultant [eVia Services]",
    description:
      "Delivered analytics for enterprise platforms including SAP Ariba, SAP S/4HANA, Salesforce, ServiceNow and Oracle. Designed user-adoption dashboards, ROI models and behaviour tracking, and coordinated multinational stakeholders throughout delivery.",
    link: "",
    image: "/pro_exp/evia-services.png",
    startDate: "Nov 2025",
    endDate: "Present",
    technologies: [
      "SAP Ariba",
      "SAP S/4HANA",
      "Salesforce",
      "ServiceNow",
      "Oracle",
      "SQL",
      "Analytics",
    ],
    services: ["data"],
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
    services: ["data"],
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
    services: ["data"],
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
    services: ["data", "web"],
  },
];

export const faqData = [
  {
    id: "q1",
    question: "How much does a website cost?",
    answer: "Business websites start at 6,000 MAD and web applications at 15,000 MAD, depending on pages, features and integrations. You receive a fixed price in MAD after a free 30-minute discovery call."
  },
  {
    id: "q2",
    question: "How much does a dashboard or data project cost?",
    answer: "Dashboards and reporting projects start at 3,000 MAD. Larger projects with several data sources and automated refresh are quoted after a short data review."
  },
  {
    id: "q3",
    question: "How long does a project take?",
    answer: "A business website usually takes two to four weeks and a dashboard one to three weeks. Larger applications are planned in phases, with a working demo every week."
  },
  {
    id: "q4",
    question: "Do you work with clients outside Agadir?",
    answer: "Yes. Most projects run remotely with calls and a shared preview link. I work with clients across Morocco and abroad, in English, French and Arabic."
  },
  {
    id: "q4b",
    question: "Are you a registered business? Do you issue invoices?",
    answer: "Yes. I work as a registered auto-entrepreneur in Morocco. You receive a written quote before the work starts and an official invoice at the end, and my taxes are declared, so I can be set up as a supplier in your company."
  },
  {
    id: "q5",
    question: "Who owns the code and the data?",
    answer: "You do. The code, the database and the dashboards are delivered to you at handover, hosted on accounts in your name, with documentation."
  },
  {
    id: "q6",
    question: "Can you improve an existing website?",
    answer: "Yes. I offer SEO audits and technical reviews with a prioritised list of fixes for speed, search visibility and conversion."
  },
  {
    id: "q7",
    question: "Do you provide support after launch?",
    answer: "Every project includes 30 days of fixes after launch. Ongoing maintenance, monitoring and reporting are available on a monthly plan."
  }
];

export const contactContent = {
  title: "Get in Touch",
  content: "Abdelouahab Bella takes on freelance web development and data analytics projects from Agadir, Morocco, as a registered auto-entrepreneur. Book a free 30-minute call, or send a message with a few lines about what you need.",
  buttonText: "Get in Touch",
  email: ""
};
