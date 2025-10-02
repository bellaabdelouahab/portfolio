import "../assets/css/resume.css";
import SEO from "../components/common/SEO";

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

export default function Resume() {
  const resumeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Abdelouahab Bella",
    "jobTitle": "Data Scientist & Software Engineer",
    "url": "https://abdelouahab.xyz/#/resume",
    "workLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Morocco"
      }
    }
  };

  return (
    <section className="resume-section">
      <SEO
        title="Resume"
        description="Professional resume of Abdelouahab Bella - Data Scientist & Software Engineer with experience in web development and machine learning."
        keywords="Resume, CV, Abdelouahab Bella, Data Scientist, Software Engineer, Career, Experience, Skills"
        structuredData={resumeStructuredData}
      />
      <h1 className="resume-section__title">My Resumes</h1>
      <p className="resume-section__subtitle">
        Select a resume based on your interest
      </p>

      <div className="resume-grid">
        {resumes.map((resume) => (
          <div key={resume.id} className="resume-card">
            <div className="resume-preview">
              <div className="image-stack">
                {/* Create 5 copies of the image for the stack effect */}
                <img src={resume.image} alt="" />
                <img src={resume.image} alt="" />
                <img src={resume.image} alt="" />
                <img src={resume.image} alt="" />
                <img src={resume.image} alt={resume.title} />
              </div>
            </div>
            <h2 className="resume-title">{resume.title}</h2>
            <p className="resume-description">{resume.description}</p>
            <a
              href={resume.downloadUrl}
              className="resume-download"
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
