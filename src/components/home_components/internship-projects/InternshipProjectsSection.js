// import style from assets
import "./intership_projects.wide.css";

export default function InternshipProjectsSection() {
    return <section className="internship-projects-section hidden-area" style={{ marginTop: "5rem", height: "27vh", width: "100%" }}>
        <div className="experience">
            <div className="home-sections-title">
                <span>03. </span>
                Professional Experience
                <hr />
            </div>
        </div>

        <div className="intership-project">
            <div className="intership-project__img">
                <img src="./No_image_available.svg.png" width="250px" height="200px" alt="Not Found" border="0" />
            </div>
            <div className="intership-project__logo" style={{ backgroundImage: "url(./PosteMaroc.jpg)" }} >
            </div>
            <div className="intership-project__content">
                <h1>A web Site For Envolop Database Managmnet </h1>
                <p className="content"> duringing this intership i have worked on a web site for the management of
                 the envelops database the workflow of the application is as follows
                  : a costumer bring a package or an envelop to the post office, 
                  the post office employee will regester the envolop and scan its code and the system will automatically
                   generate a tracking number for the envelop and the costumer will receive
                    a receipt with the tracking number on it, the costumer can use the tracking 
                    number to track the status of the envelop on the web site. </p>
                <ul className="intership-project__content__list">
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                    <li>Flask</li>
                </ul>
            </div>
        </div>
        <div className="intership-project">
            <div className="intership-project__img">
                <img src="./PostMarocProject.png" width="250px" height="200px" alt="Internship-Project-1" border="0" />
            </div>
            <div className="intership-project__logo" style={{ backgroundImage: "url(./1200px-GBAM_LOGO.png)" }}>
            </div>
            <div className="intership-project__content">
                <h1>Desktop application for managing package sending for special clients</h1>
                <p className="content">
                    During this internship, I have created a desktop application using JavaFX as a UI library and Oracle as a database.
                    The application is used to manage the sending of packages for special clients (Lawyers, Journalists, Writers). This application was created
                    to make it easy for them to send packages instead of waiting in lines. The application is used by the post office employees.
                </p>
                {/* link to interprise */}
                <a href="#" target="_blank" className="intership-project__content__link">
                    <img src="./icons8-site-50.png" width="20px" height="20px" alt="Internship-Project-1" border="0" style={{ marginRight: ".4rem" }} />
                    CodeMaster.test.ninja
                </a>
                <ul className="intership-project__content__list">
                    <li>JavaFX</li>
                    <li>Oracle</li>
                    <li>XML</li>
                    <li>CSS</li>
                    <li>Python</li>
                    <li>SMTP</li>
                </ul>
            </div>
        </div>
        <div className="intership-project">
            <div className="intership-project__img">
                <img src="./linkedin.png" width="250px" height="200px" alt="Internship-Project-1" border="0" />
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
                    <img src="./icons8-site-50.png" width="20px" height="20px" alt="Internship-Project-1" border="0" style={{ marginRight: ".4rem" }} />
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
            <div className="iconContainer">
                <img src="./icons8-calendar-50.png" width="25px" height="25px" alt="Internship-Project-1" border="0" />
            </div>
            {/* <div className="gradientLine animation-line2" /> */}
        </div>
    </section>;
}