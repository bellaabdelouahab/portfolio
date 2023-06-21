
import ExperienceCarousel from "./ExperienceCarousel";


export default function About() { 
    return (
      <>
        <section className="home-last-sections">
          <div className="about hidden-area">
            <div className="title">
              <span>01. </span>
              About Me
              <hr />
            </div>
            <div className="about-content">
              <div className="about-content-main">
                <div id="about-content-img_flow"></div>
              </div>

              <p>
                Hi, my name is Bella Abdelouahab and I am an experienced data
                scientist with six months of experience. I have strong training
                in decision-making, data science and computer systems
                engineering and software. I have developed expertise in web
                development and machine learning. I am passionate about my work
                and always seek new challenges to improve my skills and broaden
                my experience. In addition to my technical skills, I am an
                excellent communicator and enjoy working in a team to achieve
                common goals.
              </p>
              <div className="about-skills-list">
                <ul>
                  <li>Python</li>
                  <li>Machine learning/deep learning</li>
                  <li>Java (Spring Boot)</li>
                  <li>Oracle SQL/PLSQL</li>
                  <li>MongoDB</li>
                  <li>Back-end API (Django-Node)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="get-in-touch hidden-area">
            <div className="title">
              <span>03. </span>
              Get in Touch
              <hr />
            </div>
            <p className="get-in-touch-content">
              I am actively seeking new career opportunities and my inbox is
              open for potential job offers. Feel free to reach out with any
              relevant job opportunities or to connect for potential future
              collaborations. I look forward to hearing from you!
            </p>
            <div className="get-in-touch-btn">
              <a href="mailto:">
                <button style={{ marginBottom: "5rem" }}>Get in Touch</button>
              </a>
            </div>
          </div>
        </section>
        <section className="home-last-sections" style={{ marginTop: "5rem", height:"90rem" }}>
          <div className="experience hidden-area">
            <div className="title">
              <span>03. </span>
              Internship Projects
            </div>
            <div className="experience-content">
              <ExperienceCarousel />
              <div>
                In this example, the --bg-image CSS variable is set inline on the element using the style attribute.
                 The CSS variable is then used as the value for background-image property in the CSS declaration.
                  Note that CSS variables can be defined globally or scoped to specific elements or selectors.
                The above example demonstrates the usage of a globally defined CSS variable.
                Regenerate response
              </div>
            </div>

          </div>
        </section>
      </>
    );
}