import "./technologes_used.css"
export default function TechnologesUsed({technologes}) {
    return (
        <div className="project__technologes">
            <h2 className="project__technologes__title">Technology Stack...</h2>
            <ul className="project__technologes__list">
                {technologes.map((tech, index) => (
                    <li key={index} className="project__technologes__item">
                        {tech.title} <span>{tech.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}