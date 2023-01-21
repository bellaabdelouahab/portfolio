import { useNavigate } from 'react-router-dom'
import '../assets/css/projects.css'


export default function Projects() {
    const Navigate = useNavigate();
    return (
        <>
            <section className="projects-section">
                <h1 className="projects-section__title">Projects Library</h1>
                <h2 className="projects-section__subtitle">Get Access To All My Public Projects</h2>
                <div className="projects-section__projects">
                    <div className="projects-section__projects__project" onClick={e=>{Navigate('/projects/1')}} >
                        <div className="projects-section__projects__project__img">
                        </div>
                            <h3 className="projects-section__projects__project__title">Ninja Github</h3>
                            <p className="projects-section__projects__project__description">dfjfgkldfgldfghdfgjdlkj</p>  
                    </div>
                </div>
            </section>
        </>
    )
}