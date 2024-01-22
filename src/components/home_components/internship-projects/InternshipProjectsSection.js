// import style from assets
import "./intership_projects.wide.css";

export default function InternshipProjectsSection() {
    return <section className="internship-projects-section hidden-area" style={{ marginTop: "5rem", height: "27vh", width: "100%"}}>
        <div className="experience">
            <div className="home-sections-title">
                <span>03. </span>
                Professional Experience
                <hr /> 
            </div>
        </div>
        <div className="lineAnimation">
            <div className="gradientLine" />
            <div className="iconContainer">
                <img src="./icons8-calendar-50.png" width="25px" height="25px" alt="Internship-Project-1" border="0" />
            </div>
            <div className="gradientLine animation-line2" />
            <div className="iconContainer">
                <img src="./icons8-calendar-50.png" width="25px" height="25px" alt="Internship-Project-1" border="0" />
            </div>
            <div className="gradientLine animation-line2" />
        </div>
        <div className="intership-project">
            <div className="intership-project__img">
                <img src="https://via.placeholder.com/200" width="250px" height="200px" alt="Internship-Project-1" border="0" />
            </div>
            <div className="intership-project__logo">
            </div>
            <div className="intership-project__content">
                <h1>Internship Project 1</h1>
                <p className="content">lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim 
                    ad minim veniam, quis nostrud
                </p>
                {/* link to interprise */}
                <a href="#" target="_blank" className="intership-project__content__link">
                    <img src="./icons8-site-50.png" width="20px" height="20px" alt="Internship-Project-1" border="0" style={{marginRight:".4rem"}} />
                    CodeMaster.test.ninja
                </a>
                <ul className="intership-project__content__list">
                    <li>Nodejs</li>
                    <li>Express</li>
                    <li>React</li>
                    <li>Redux</li>
                </ul>
            </div>
        </div>
    </section>;
}