import "./AboutMeSection.css";

export default function AboutMeSection() {
  return (
    <section className="home-about-section">
      <div className="hidden-area">
        <div className="home-sections-title">
          <span>02. </span>
          About Me
        </div>
        <div className="about-content">
          <div className="about-content-text">
            <p>
              I am Bella Abdelouahab, an accomplished data scientist with ten
              months of extensive experience. My educational foundation
              encompasses robust training in decision-making, data science,
              computer systems engineering, and software development. Proficient
              in both web development and machine learning, I am deeply
              passionate about my profession. I actively pursue new challenges
              to enhance my skills and expand my expertise.
              <br />
              In addition to my technical proficiency, I excel as a communicator
              and thrive in collaborative team environments, dedicated to
              achieving shared objectives.
            </p>
            <span className="about-content-skills_title">Skills:</span>
            <div className="about-skills-list">
              <ul>
                <li>Python(advanced), Java(advanced), C, C++</li>
                <li>Machine learning/deep learning</li>
                <li>Oracle SQL/PLSQL</li>
                <li>MongoDB</li>
                <li>Back-end (Django-Node-SpringBoot)</li>
                <li>Front-end (ReactJS, NextJs, ViewJs)</li>
                {/* disktop apps skills */}
                <li>JavaFX & Swing</li>
                <li>Tkinter & Pyglet</li>

                <li>Microsoft Power BI</li>
                <li>Data warehousing</li>
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
