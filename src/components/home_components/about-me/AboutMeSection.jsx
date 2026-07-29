import "./AboutMeSection.css";

export default function AboutMeSection() {
  return (
    <section className="home-about-section">
      <div className="kra"></div>
      <div className="hidden-area">
        <div className="home-sections-title">
          <span>02. </span>
          About Me
        </div>
        <div className="about-content">
          <div className="about-content-text">
            <p>
              I am Abdelouahab Bella, a Digital Adoption Consultant and Data
              Analytics Specialist with hands-on experience delivering WalkMe
              implementations across enterprise platforms including SAP Ariba,
              S/4HANA, Salesforce, ServiceNow, and Oracle. I turn user behavior
              data into adoption KPIs, ROI models, and executive-ready
              dashboards, backed by a technical foundation in Python, SQL, and
              ETL pipeline design.
              <br />I hold a Master's in Big Data and Business Intelligence and
              enjoy working across the full analytics stack, from raw data to
              stakeholder-facing insight, while collaborating closely with
              cross-functional and multinational teams.
            </p>
            <span className="about-content-skills_title">Skills:</span>
            <div className="about-skills-list">
              <ul>
                <li>
                  WalkMe (SmartTips, SmartWalkThrus, Insights, Segmentation)
                </li>
                <li>SQL (Advanced), Python (Pandas, scripting)</li>
                <li>Power BI, GA4, Google Search Console, Microsoft Clarity</li>
                <li>User Behavior & Funnel Analytics</li>
                <li>Back-end (Django, FastAPI)</li>
                <li>Docker, GitLab CI/CD, PostgreSQL, Linux</li>
                <li>REST APIs</li>
                <li>Stakeholder Communication & Change Management</li>
              </ul>
            </div>
          </div>
          <div className="about-content-image">
            <div
              id="about-content-img_flow"
              style={{ backgroundImage: "url('./Personal Picture.jpg')" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
