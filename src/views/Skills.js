
import '../assets/css/skills.css'


export default function Skills() {
    return (
        <div className="skills">
            <h1 className="skills__title">Skills</h1>
            <div className="skills__container">
                <div className="skills__container__skill">
                    <img className="skills__container__skill__image" src="https://cdn3.iconfinder.com/data/icons/glypho-social-and-other-logos/64/logo-html5-circle-512.png" alt="html"/>
                    <p className="skills__container__skill__name">HTML</p>
                    <p className='skills__container__skill__disc'></p>
                    <button className="skills__container__skill__button">See My Road Map</button>
                </div>
            </div>
        </div>
    )
}