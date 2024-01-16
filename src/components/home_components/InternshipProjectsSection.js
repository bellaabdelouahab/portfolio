// import style from assets
import "../../assets/css/internship/index.css";

export default function InternshipProjectsSection() {
    return <section className="internship-projects-section hidden-area" style={{ marginTop: "5rem", height: "27vh", width: "100%"}}>
        <div className="experience">
            <div className="home-sections-title">
                <span>03. </span>
                Internship Projects
                <hr />
            </div>
        </div>
        <div className="lineAnimation">
            <div style={{ height: "25vh", width: ".4rem", background: "linear-gradient(transparent, #33b3ae 40%)" }} />
            <div style={{ height: "4rem", 
            width: "6rem",
            backgroundColor:"transparent",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            color:"#33b3ae",
            fontSize:"1.2rem",
            }}>
                →→ 2023
            </div>
            <div style={{ height: "20vh", transform:"rotate(180deg)", width: ".4rem", background: "linear-gradient(transparent, #33b3ae 40%)" }} />

        </div>
        <div className="intership-project">
            <div className="intership-project__img">
                <img src="https://via.placeholder.com/200" width="250px" height="200px" alt="Internship-Project-1" border="0" />
            </div>
            <div className="intership-project__logo">
                {/* <img src="https://i.ibb.co/7b6hHfD/Internship-Project-1.png" width="150px" height="150px" alt="Internship-Project-1" border="0" /> */}
            </div>
            <div className="intership-project__content">
                <h1>Internship Project 1</h1>
            </div>
        </div>
    </section>;
}