import "./wide-screen.css"

export default function Collaborators({ collaborators }) {
    if (!collaborators || collaborators.length === 0) return null
    return (
        <div className="collaborators-container">
            <h2 className="collaborators-title">Collaborators</h2>
            <hr className="collaborators-hr" />
            <div className="collaborators">
                {collaborators.map((collaborator) => (
                    <div key={collaborator._id} className="colaborator-card">
                        <a href="/" className="colaborator-image-container">
                            <img className="colaborator-pic" src={collaborator.image} alt="colaborator" />
                        </a>
                        <h3>{collaborator.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}