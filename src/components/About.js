



export default function About() { 
    return (
      <section className="home-last-sections">
        <div className="about">
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
              scientist with six months of experience. I have strong training in
              decision-making, data science and computer systems engineering and
              software. I have developed expertise in web development and
              machine learning. I am passionate about my work and always seek
              new challenges to improve my skills and broaden my experience. In
              addition to my technical skills, I am an excellent communicator
              and enjoy working in a team to achieve common goals.
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
        <div className="get-in-touch">
          <div className="title">
            <span>02. </span>
            Get in Touch
            <hr />
          </div>
          <p className="get-in-touch-content">
            I am actively seeking new career opportunities and my inbox is open
            for potential job offers. Feel free to reach out with any relevant
            job opportunities or to connect for potential future collaborations.
            I look forward to hearing from you!
          </p>
          <div className="get-in-touch-btn">
            <a href="mailto:">
              <button>Get in Touch</button>
            </a>
          </div>
        </div>
      </section>
    );
}