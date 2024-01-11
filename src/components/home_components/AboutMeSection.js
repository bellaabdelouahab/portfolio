export default function AboutMeSection() {
    return <section className="home-about-sections hidden-area">
        <div className="home-sections-title">
            <span>04. </span>
            About Me
            <hr />
        </div>
        <div className="about-content">
            <div className="about-content-main">
                <div id="about-content-img_flow" style={{ backgroundImage: "url('./Personal Picture.jpg') no-repeat center center" }} />
            </div>

            <p>
                Hi, my name is Bella Abdelouahab and I am an experienced data
                scientist with ten months of experience. I have strong training
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
    </section>;
}




