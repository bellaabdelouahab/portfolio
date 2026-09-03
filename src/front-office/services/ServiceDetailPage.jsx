import { useLoaderData } from "react-router-dom";
import { getCollectionDocs } from "../../shared/lib/firestoreAccess";
import { byNewest } from "../../shared/lib/dates";
import { servicesContent, professionalExperience } from "../home/homeContent";
import { ProjectCard } from "../projects/components/ProjectCard";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import SEO from "../../shared/ui/SEO";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

const RELATED_PROJECTS_LIMIT = 3;

/**
 * Related projects come from Firestore `projects.tags`, but those tags are
 * freeform and sparse (most appear on a single project — see homeContent.js's
 * comment on relatedProjectTags), so a strict tag filter alone would leave
 * some services with one card or none. Filling up to the limit with the most
 * recent remaining projects keeps the section from looking broken/empty
 * while still favoring genuinely related work when it exists.
 */
export async function getServiceDetail({ params }) {
  const service = servicesContent.find((s) => s.id === params.id);
  if (!service) {
    throw new Response("Service not found", { status: 404 });
  }

  const docs = await getCollectionDocs("projects");
  const allProjects = docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .sort(byNewest("startDate"));

  const tagged = service.relatedProjectTags.length
    ? allProjects.filter((project) =>
        (project.tags || []).some((tag) => service.relatedProjectTags.includes(tag)),
      )
    : [];

  const relatedProjects =
    tagged.length >= RELATED_PROJECTS_LIMIT
      ? tagged.slice(0, RELATED_PROJECTS_LIMIT)
      : [
          ...tagged,
          ...allProjects
            .filter((project) => !tagged.some((t) => t._id === project._id))
            .slice(0, RELATED_PROJECTS_LIMIT - tagged.length),
        ];

  return { service, relatedProjects };
}

export default function ServiceDetailPage() {
  const { service, relatedProjects } = useLoaderData();
  const relevantExperience = professionalExperience.filter((exp) =>
    (exp.services || []).includes(service.id),
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.longDescription || service.description,
    serviceType: service.serviceType,
    provider: {
      "@type": "Person",
      name: "Abdelouahab Bella",
      url: getAbsoluteUrl("/"),
    },
    areaServed: ["Agadir", "Morocco"],
    url: getAbsoluteUrl(`/services/${service.id}`),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <SEO
        title={service.title}
        description={service.longDescription || service.description}
        keywords={`${service.title}, ${service.serviceType}, Abdelouahab Bella, Agadir, Morocco`}
        structuredData={structuredData}
      />

      <div className="mb-10 flex flex-col items-center text-center">
        <img src={service.icon} alt="" width="75" height="75" className="mb-5" />
        <h1 className="mb-5 text-4xl leading-snug font-bold text-success">{service.title}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-ink">
          {service.longDescription || service.description}
        </p>
      </div>

      {service.relatedSkills?.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-2xl leading-snug font-bold text-ink-strong">
            What&apos;s Included
          </h2>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {service.relatedSkills.map((skill) => (
              <li
                key={skill}
                className="rounded-sm border border-line bg-surface p-3 text-ink"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-2xl leading-snug font-bold text-ink-strong">
            Related Projects
          </h2>
          <div className="flex flex-wrap justify-center gap-7.5">
            {relatedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {relevantExperience.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-2xl leading-snug font-bold text-ink-strong">
            Relevant Experience
          </h2>
          <ul className="flex flex-col gap-4">
            {relevantExperience.map((exp) => (
              <li
                key={exp.title}
                className="rounded-sm border border-line bg-surface p-4"
              >
                <h3 className="text-lg font-bold text-success">{exp.title}</h3>
                <p className="mb-2 text-sm text-ink/70">
                  {exp.startDate} – {exp.endDate}
                </p>
                <p className="text-ink">{exp.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col items-center gap-4 rounded-md border border-success/30 bg-[#1e1e1e] p-7.5 text-center">
        <h2 className="text-2xl leading-snug font-bold text-ink-strong">
          Interested in {service.title}?
        </h2>
        <ContactCtaButtons
          whatsappMessage={`Hi, I'm interested in your ${service.title} service`}
        />
      </section>
    </div>
  );
}
