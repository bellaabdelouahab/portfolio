import SEO from "../../shared/ui/SEO";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";

const resumes = [
  {
    id: 1,
    title: "Software Engineer Resume",
    description:
      "Resume highlighting full-stack development skills and experience with modern web technologies.",
    image: `./images/resumes/bella-SE.png`,
    bgimages: [],

    downloadUrl: `images/resumes/Bella_Abdelouahab-Software-Engineer.pdf`,
  },
  {
    id: 3,
    title: "Data Analyst Resume",
    description:
      "Resume showcasing data analysis, visualization, and business intelligence skills.",
    image: `./images/resumes/bella-DA.png`,
    bgimages: [],
    downloadUrl: `images/resumes/Bella_Abdelouahab-Data-Analyst.pdf`,
  },
];

// The fanned-out "stack" behind each cover was `.image-stack img:nth-child(n)`.
// Indexing an array keeps the same offsets but makes the depth order readable:
// each layer sits further right, smaller and fainter, with the last (unshifted)
// entry as the front cover. Adding a sixth layer is now a one-line change.
const stackLayers = [
  "translate-x-[calc(60%_+_48px)] scale-[0.8] opacity-60",
  "translate-x-[calc(45%_+_36px)] scale-[0.85] opacity-70",
  "translate-x-[calc(30%_+_24px)] scale-[0.9] opacity-80",
  "translate-x-[calc(15%_+_12px)] scale-[0.95] opacity-90",
  "",
];

export default function Resume() {
  const resumeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Abdelouahab Bella",
    "jobTitle": "Data Analyst & Software Engineer",
    "url": getAbsoluteUrl("/resume"),
    "workLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Morocco"
      }
    }
  };

  return (
    <section className="min-h-screen bg-surface px-5 py-10">
      <SEO
        title="Resume"
        description="Professional resume of Abdelouahab Bella - Data Analyst & Software Engineer with experience in web development and machine learning."
        keywords="Resume, CV, Abdelouahab Bella, Data Scientist, Software Engineer, Career, Experience, Skills"
        structuredData={resumeStructuredData}
      />
      <h1 className="mb-2 text-center text-3xl text-ink-strong">My Resumes</h1>
      <p className="mb-10 text-center text-base leading-relaxed text-ink">
        Select a resume based on your interest
      </p>

      {/* Single column below md; above it the cards flow into as many
          300px-or-wider tracks as fit. The 15vw gutter is intentional — the
          fanned image stack overflows its card to the right and needs room. */}
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-[15vw] px-5 md:grid-cols-[repeat(auto-fit,minmax(300px,2fr))]">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="relative w-87.5 rounded-lg border border-line bg-surface-raised p-6 transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative mb-6 h-62.5">
              <div className="relative h-full w-full">
                {/* Five copies of the same cover, fanned out to read as a stack */}
                {stackLayers.map((layer, index) => (
                  <img
                    key={index}
                    src={resume.image}
                    alt={index === stackLayers.length - 1 ? resume.title : ""}
                    className={[
                      "absolute h-full w-[55%] rounded-md object-cover",
                      "transition-transform duration-300 ease-standard",
                      layer,
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>
            <h2 className="mb-4 text-xl text-ink-strong">{resume.title}</h2>
            <p className="mb-6 text-xs leading-normal text-ink">
              {resume.description}
            </p>
            <a
              href={resume.downloadUrl}
              className="inline-block rounded-sm bg-[#00b3b3] px-4 py-2 text-xs text-ink-strong transition-colors duration-200 hover:bg-[#008080]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request PDF
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
