


export default function Home() {
    return (
        <>
        <section className="home-first-sections">
            <h1 className="home-first-sections__title">Hi, I'm Bella Abdelouahab</h1>
            <h2 className="home-first-sections__subtitle">Your Coding Skills</h2>
            <button className="home-first-sections__button">Find Me On Github <span>{">"}</span> </button>
            <p className="home-first-sections__img" alt="code"/>
        </section>
        <section className="home-second-sections">
            {/* projects highlights */}
            <h2 className="home-second-sections__title">❤️ Projects Highlights</h2>
            <hr className="home-second-sections__hr"/>
            <div className="home-second-sections__projects">
                <div className="home-second-sections__projects__project">
                    <img className="home-second-sections__projects__project__img" src="" alt="somthing for now"/>
                    <h3 className="home-second-sections__projects__project__title">Project Title</h3>
                    <p className="home-second-sections__projects__project__description">Project Description is dkldfbvdslk ghdfgkjhagfd bdkaghern;vl kdskgna dfb nfg fjbkgj</p>
                    {/* button to view project and button to sponsor */}
                    <div className="home-second-sections__projects__project__buttons">
                        <button className="home-second-sections__projects__project__buttons__view">View Project</button>
                        <button className="home-second-sections__projects__project__buttons__sponsor">1$/Sponsor</button>
                    </div>
                </div>
            </div>
        </section>
        <section className="home-third-sections">
            <h2 className="home-third-sections__title">Github Progress</h2>
            <hr className="home-third-sections__hr"/>
            <div className="home-third-sections__img" />
        </section>
        <section className="home-last-sections">
        </section>
        </>
    )
}

export const getProjects = async () => {
    return fetch('https://api.github.com/users/alexanderjacksongit/repos')
    .then(res => res.data)
    .catch(err => console.log(err))
}