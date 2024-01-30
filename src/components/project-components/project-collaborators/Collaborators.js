import "./wide-screen.css"


export default function Collaborators({ collaborators }){
    return (
        <div className="collaborators-container">
            <h2 className="collaborators-title">Collaborators</h2>
            <hr className="collaborators-hr" />
            <div className="collaborators">
                {/* {collaborators &&
                    collaborators.map((collaborator) => ( */}
                <div key="{collaborator._id}" className="colaborator-card">
                    <a href="/" className="colaborator-image-container">
                        <img className="colaborator-pic" src="https://via.placeholder.com/75" alt="colaborator" />
                    </a>
                    <h3>Yassin Bouj</h3>
                </div>
                <div key="{collaborator._id}1" className="colaborator-card">
                    <a href="/" className="colaborator-image-container">
                        <img className="colaborator-pic" src="https://via.placeholder.com/75" alt="colaborator" />
                    </a>
                    <h3>Yassin Bouj</h3>
                </div>
                    {/* ))} */}
            </div>
        </div>
    )
}