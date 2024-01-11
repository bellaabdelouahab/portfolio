import ExperienceCarousel from "../ExperienceCarousel";

export default function InternshipProjectsSection() {
    return <section className="internship-projects-section hidden-area" style={{ marginTop: "5rem", height: "auto", width: "100%" }}>
        <div className="experience">
            <div className="home-sections-title">
                <span>03. </span>
                Internship Projects
                <hr />
            </div>
            <div className="experience experience-content">
                <ExperienceCarousel />
                <div>
                    In this example, the --bg-image CSS variable is set inline on the element using the style attribute.
                    The CSS variable is then used as the value for background-image property in the CSS declaration.
                    Note that CSS variables can be defined globally or scoped to specific elements or selectors.
                    The above example demonstrates the usage of a globally defined CSS variable.
                    Regenerate response
                </div>
            </div>

        </div>
    </section>;
}