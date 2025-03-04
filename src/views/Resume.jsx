import "../assets/css/resume.css";

const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

const resumes = [
  {
    id: 1,
    title: "Software Engineer Resume",
    description:
      "Resume highlighting full-stack development skills and experience with modern web technologies.",
    image: `./images/resumes/bella-SE.png`,
    bgimages: [],

    downloadUrl: `${backendUploadsApi}/images/resumes/Bella_Abdelouahab-Software-Engineer.pdf`,
  },
  {
    id: 2,
    title: "Data Scientist Resume",
    description:
      "Resume focused on data analysis, machine learning, and statistical modeling experience.",
    image: `./images/resumes/bella-DS.png`,
    bgimages: [],
    downloadUrl: `${backendUploadsApi}/images/resumes/Bella_Abdelouahab-Data-Scientist.pdf`,
  },
  {
    id: 3,
    title: "Data Analyst Resume",
    description:
      "Resume showcasing data analysis, visualization, and business intelligence skills.",
    image: `./images/resumes/bella-DA.png`,
    bgimages: [],
    downloadUrl: `${backendUploadsApi}/images/resumes/Bella_Abdelouahab-Data-Analyst.pdf`,
  },
];

export default function Resume() {
  return (
    <section className="resume-section">
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
