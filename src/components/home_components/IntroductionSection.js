export default function IntroductionSection() {
    return <section className="home-introduction-section hidden-area">
        <h1 className="home-introduction-section__title">
            Hi, I'm Bella Abdelouahab
        </h1>
        <h2 className="home-introduction-section__subtitle">Your Coding Skills</h2>
        <a
            className="home-introduction-section__button"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/bellaabdelouahab"
        >
            Find Me On Github <span>{">"}</span>{" "}
        </a>

        <p className="home-introduction-section__img" alt="code" />
    </section>;
}