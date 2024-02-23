import { useEffect } from "react";
import "./wide-screen.css"
import "./small-screen.css"

export default function IntroductionSection() {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;

    useEffect(() => {
        const handleMouseOver = (event) => {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return event.target.dataset.value[index];
                        }
                        // if the true letter is a space, return a space
                        if (event.target.dataset.value[index] === " ") {
                            return " ";
                        }


                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= event.target.dataset.value.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 25);
        };

        const h1Element = document.querySelector(".animated-intro-text");
        h1Element.addEventListener("mouseover", handleMouseOver);

        handleMouseOver({ target: h1Element });
        return () => {
            // Cleanup the interval when the component unmounts
            clearInterval(interval);
            h1Element.removeEventListener("mouseover", handleMouseOver);
        };
    }, [interval, letters]);

    return <section className="home-introduction-section">
        <div className="home-introduction-section__title">
            <h1 className="animated-intro-text" data-value="Hi, I'm Abdelouahab">Hi, I'm Abdelouahab</h1>
        </div>
        <h2 className="home-introduction-section__subtitle"> ⟫⟫ a Data Scientist & Software Engineer</h2>
        <a
            className="home-introduction-section__button"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/bellaabdelouahab"
        >
            Buy Me A Coffee <span>{">"}</span>{" "}
        </a>

        <div className="home-introduction-section__img" style={{ backgroundImage: 'url(./code.png)' }} />
    </section>;
}