import { useEffect } from "react";
import "./IntroductionSection.css"
import "./IntroductionSection.mobile.css"
import Skeleton from "react-loading-skeleton";
import CodeCard from "./CodeCard";

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

    return (
      <section className="home-introduction-section">
        <div className="home-introduction-section__title">
          <h1 className="animated-intro-text" data-value="Hi, I'm Abdelouahab">
            Hi, I'm Abdelouahab
          </h1>
        </div>
        <h2 className="home-introduction-section__subtitle">
          {" "}
          ⟫⟫ a Data Analyst & Software Engineer
        </h2>
        <a
          className="home-introduction-section__button"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/bellaabdelouahab"
        >
          Buy Me A Coffee <span>{">"}</span>{" "}
        </a>

        {/* ml-[3vw] matches the title's left edge — the section's children use
            hand-picked vw margins (title 3vw, button 5vw) and are not aligned with
            each other, so the snippet anchors to the dominant edge. mt-12 gives it
            room to read as its own element rather than crowding the call to action. */}
        <div className="mb-16 mt-12 ml-[3vw] mr-[3vw]">
          <CodeCard />
        </div>
      </section>
    );
}