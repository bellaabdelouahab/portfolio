export default function IntroductionSection() {
    return <section className="home-introduction-section">
        <h1 className="home-introduction-section__title">
            Hi, I'm B.Abdelouahab
        </h1>
        <h2 className="home-introduction-section__subtitle"> ⟫⟫ a Data Scientist & Software Engineer</h2>
        <a
            className="home-introduction-section__button"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/bellaabdelouahab"
        >
            Find Me On Github <span>{">"}</span>{" "}
        </a>

        <div className="home-introduction-section__img" style={{ backgroundImage: 'url(./code.png)' }} />
    </section>;
}