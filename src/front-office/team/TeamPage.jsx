import SEO from "../../shared/ui/SEO";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

const MEMBERS = [
  {
    name: "Abdelouahab Bella",
    role: "Founder, Web Developer and Data Analyst",
    image: "/team/abdelouahab-bella.jpg",
    summary:
      "Leads every engagement: scoping, architecture, delivery and the point of contact for the client. Master's in Big Data and Business Intelligence.",
    skills: ["React", "Django and FastAPI", "Power BI and SQL", "DevOps"],
    links: [
      ["GitHub", "https://github.com/bellaabdelouahab"],
      ["LinkedIn", "https://linkedin.com/in/abdelouahab-bella"],
    ],
  },
  {
    name: "Yassir Loukilia",
    role: "Software Engineer, Front-end",
    image: "/team/yassir-loukilia.jpg",
    summary:
      "Builds the user interface on larger projects: component libraries, responsive layouts and front-end performance.",
    skills: ["React", "JavaScript", "UI implementation"],
    links: [["GitHub", "https://github.com/YASSIR-LOUKILIA"]],
  },
  {
    name: "Yassine Boujrada",
    role: "Engineer, Data Collection and Security",
    image: "/team/yassine-boujrada.jpg",
    summary:
      "Handles web data collection, automation and security reviews when a project needs scraped or monitored data or a hardening pass.",
    skills: ["Web scraping", "Automation", "Cybersecurity"],
    links: [],
  },
];

const WAYS = [
  ["Single point of contact", "You talk to one person, who is accountable for scope, schedule and quality."],
  ["Specialists when needed", "Larger projects bring in a front-end or security specialist, agreed with you beforehand."],
  ["Weekly demos", "A working preview link is updated every week so you see progress, not reports."],
  ["You own the result", "Code, data and accounts are handed over in your name, with documentation."],
];

export default function Team() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Abdelouahab Bella, web development and data analytics",
    url: getAbsoluteUrl("/my-team"),
    areaServed: "Morocco",
    employee: MEMBERS.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role })),
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 md:py-12">
      <SEO
        title="Team"
        description="Who delivers your project: Abdelouahab Bella leads, with front-end and security specialists on larger engagements."
        keywords="web development team Morocco, data analytics freelancer, Abdelouahab Bella team"
        structuredData={structuredData}
      />
      <header className="mb-8 max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">Team</h1>
        <p className="text-base leading-relaxed text-ink">
          A lead you can call directly, supported by specialists on larger projects.
        </p>
      </header>

      <ul className="grid gap-5 md:grid-cols-3">
        {MEMBERS.map((m) => (
          <li key={m.name} className="flex flex-col rounded-md border border-line bg-surface p-5">
            <img
              src={m.image}
              alt={m.name}
              width="96"
              height="96"
              loading="lazy"
              className="mb-4 h-24 w-24 rounded-full border-2 border-success/50 object-cover"
            />
            <h2 className="text-lg font-bold text-ink-strong">{m.name}</h2>
            <p className="mb-3 text-sm font-bold text-success">{m.role}</p>
            <p className="mb-4 text-sm leading-relaxed text-ink">{m.summary}</p>
            <ul className="mt-auto mb-4 flex flex-wrap gap-1.5">
              {m.skills.map((s) => (
                <li key={s} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted">{s}</li>
              ))}
            </ul>
            {m.links.length > 0 && (
              <p className="flex gap-4 text-sm">
                {m.links.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-success! hover:underline">
                    {label}
                  </a>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-bold text-ink-strong">How we work</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WAYS.map(([title, text]) => (
          <li key={title} className="rounded-sm border border-line bg-surface p-4">
            <p className="font-bold text-ink-strong">{title}</p>
            <p className="mt-1 text-sm leading-snug text-ink">{text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-md border border-success/30 bg-[#1a202b] p-7 text-center">
        <h2 className="text-xl font-bold text-ink-strong">Talk to the lead</h2>
        <ContactCtaButtons className="justify-center" whatsappMessage="Hi Abdelouahab, I would like to discuss a project." />
      </div>
    </section>
  );
}
