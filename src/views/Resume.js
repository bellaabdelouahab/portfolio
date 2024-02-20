import '../assets/css/resume.css'

const backendUploadsApi = process.env.REACT_APP_BACKEND_UPLOADS_API;



export default function Resume() {
    return (
        <>
        <section className="resume-section">
            <h1 className="resume-section__title">Resume</h1>
            <hr className="resume-section__hr"/>
            <div className="resume-section__resume" style={{background: `url(${backendUploadsApi}resume.png) no-repeat center center/cover`}}>
                <div className="resume-section__tools">
                    <h2 className="resume-section__tools__title">Bella Abdelouahab Resume</h2>
                    <button className="resume-section__tools__download">Download Resume PDF</button>
                </div>
            </div>
        </section></>
    )
}