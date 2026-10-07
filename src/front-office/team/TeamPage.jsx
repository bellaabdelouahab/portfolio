import SEO from "../../shared/ui/SEO";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

import { useT } from "../../shared/i18n/strings";
import { useLang } from "../../shared/i18n/i18n";
const MEMBERS = [
  {
    name: "Abdelouahab Bella",
    role: "Founder, Web Developer and Data Analyst",
    roleFr: "Fondateur, développeur web et analyste de données",
    image: "/team/abdelouahab-bella.webp",
    summary:
      "Leads every engagement: scoping, architecture, delivery and the point of contact for the client. Master's in Big Data and Business Intelligence.",
    summaryFr:
      "Pilote chaque mission : cadrage, architecture, livraison, et interlocuteur unique du client. Master en Big Data et Business Intelligence.",
    skills: ["React", "Django and FastAPI", "Power BI and SQL", "DevOps"],
    skillsFr: ["React", "Django et FastAPI", "Power BI et SQL", "DevOps"],
    links: [
      ["GitHub", "https://github.com/bellaabdelouahab"],
      ["LinkedIn", "https://linkedin.com/in/abdelouahab-bella"],
    ],
  },
  {
    name: "Yassir Loukilia",
    role: "Software Engineer, Front-end",
    roleFr: "Ingénieur logiciel, front-end",
    image: "/team/yassir-loukilia.webp",
    summary:
      "Builds the user interface on larger projects: component libraries, responsive layouts and front-end performance.",
    summaryFr:
      "Construit l'interface sur les projets plus importants : bibliothèques de composants, mises en page responsives et performance front-end.",
    skills: ["React", "JavaScript", "UI implementation"],
    skillsFr: ["React", "JavaScript", "Intégration d'interfaces"],
    links: [["GitHub", "https://github.com/YASSIR-LOUKILIA"]],
  },
  {
    name: "Yassine Boujrada",
    role: "Engineer, Data Collection and Security",
    roleFr: "Ingénieur, collecte de données et sécurité",
    image: "/team/yassine-boujrada.webp",
    summary:
      "Handles web data collection, automation and security reviews when a project needs scraped or monitored data or a hardening pass.",
    summaryFr:
      "Prend en charge la collecte de données web, l'automatisation et les revues de sécurité quand un projet nécessite des données collectées ou surveillées, ou un renforcement.",
    skills: ["Web scraping", "Automation", "Cybersecurity"],
    skillsFr: ["Collecte de données web", "Automatisation", "Cybersécurité"],
    links: [],
  },
];

const WAYS = [
  ["Single point of contact", "You talk to one person, who is accountable for scope, schedule and quality."],
  ["Specialists when needed", "Larger projects bring in a front-end or security specialist, agreed with you beforehand."],
  ["Weekly demos", "A working preview link is updated every week so you see progress, not reports."],
  ["You own the result", "Code, data and accounts are handed over in your name, with documentation."],
];

const WAYS_FR = [
  ["Un interlocuteur unique", "Vous parlez à une seule personne, responsable du périmètre, du calendrier et de la qualité."],
  ["Des spécialistes au besoin", "Les projets plus importants font appel à un spécialiste front-end ou sécurité, convenu avec vous au préalable."],
  ["Des démonstrations chaque semaine", "Un lien de prévisualisation fonctionnel est mis à jour chaque semaine : vous voyez l'avancement, pas des rapports."],
  ["Le résultat vous appartient", "Le code, les données et les comptes vous sont remis à votre nom, avec la documentation."],
];

export default function Team() {
  const t = useT();
  const lang = useLang();
  const fr = lang === "fr";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Abdelouahab Bella, web development and data analytics",
    url: getAbsoluteUrl(fr ? "/fr/my-team" : "/my-team"),
    areaServed: "Morocco",
    employee: MEMBERS.map((m) => ({ "@type": "Person", name: m.name, jobTitle: fr ? m.roleFr : m.role })),
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 md:py-12">
      <SEO
        title={t("team.title")}
        description={fr ? "Qui réalise votre projet : Abdelouahab Bella pilote, avec des spécialistes front-end et sécurité sur les missions plus importantes." : "Who delivers your project: Abdelouahab Bella leads, with front-end and security specialists on larger engagements."}
        keywords="web development team Morocco, data analytics freelancer, Abdelouahab Bella team"
        structuredData={structuredData}
      />
      <header className="mb-8 max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">{t("team.title")}</h1>
        <p className="text-base leading-relaxed text-ink">
          {t("team.intro")}
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
            <p className="mb-3 text-sm font-bold text-success">{fr ? m.roleFr : m.role}</p>
            <p className="mb-4 text-sm leading-relaxed text-ink">{fr ? m.summaryFr : m.summary}</p>
            <ul className="mt-auto mb-4 flex flex-wrap gap-1.5">
              {(fr ? m.skillsFr : m.skills).map((s) => (
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

      <h2 className="mt-12 mb-4 text-2xl font-bold text-ink-strong">{t("team.how")}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(fr ? WAYS_FR : WAYS).map(([title, text]) => (
          <li key={title} className="rounded-sm border border-line bg-surface p-4">
            <p className="font-bold text-ink-strong">{title}</p>
            <p className="mt-1 text-sm leading-snug text-ink">{text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-md border border-success/30 bg-[#202020] p-7 text-center">
        <h2 className="text-xl font-bold text-ink-strong">{t("team.talk")}</h2>
        <ContactCtaButtons className="justify-center" whatsappMessage={t("msg.whatsappTeam")} />
      </div>
    </section>
  );
}
