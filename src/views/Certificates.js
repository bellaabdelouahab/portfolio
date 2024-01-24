
import "assets/css/certification.css"


export default function Certificates(){
    return (
        <>
        <div className="certifications-header">
            <div className="count">+10 Badges & Certifications</div>
            <label >Sorted By :<span className='filter'> Date Earned ▼</span> </label>
        </div>
            <div className="certifications-content">
                <div className="certification-element">
                    <img src="http://localhost:5000/resume.png" alt="NoImage" />
                    <div className="certification-title">Certifications X got From Y in Z field</div>
                </div>
                <div className="certification-element">
                    <img src="http://localhost:5000/resume.png" alt="NoImage" />
                    <div className="certification-title">Certifications X got From Y in Z field</div>
                </div>
                <div className="certification-element">
                    <img src="http://localhost:5000/resume.png" alt="NoImage" />
                    <div className="certification-title">Certifications X got From Y in Z field</div>
                </div>
                <div className="certification-element">
                    <img src="http://localhost:5000/resume.png" alt="NoImage" />
                    <div className="certification-title">Certifications X got From Y in Z field</div>
                </div>
                <div className="certification-element">
                    <img src="http://localhost:5000/resume.png" alt="NoImage" />
                    <div className="certification-title">Certifications X got From Y in Z field</div>
                </div>
                <div className="certification-element">
                    <img src="http://localhost:5000/resume.png" alt="NoImage" />
                    <div className="certification-title">Certifications X got From Y in Z field</div>
                </div>
        </div>
        </>
    );
}


export function getCertificates(){
    return 3
}