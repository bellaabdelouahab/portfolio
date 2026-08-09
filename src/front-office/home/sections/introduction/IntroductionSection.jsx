import { useEffect } from "react";
import CodeCard from "./CodeCard";
// Imported rather than referenced from CSS: the background now lives on the
// element as utilities, and only a JS import gets the hashed, cache-busted URL
// Vite emits for a file under src/shared/assets.
import heroBackground from "assets/images/home-section-bg1.jpg";

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
      // The dark wash is a background-COLOUR multiplied into the photo, not a
      // fourth layer — bg-blend-multiply is what dims the image without an
      // overlay element sitting above the content.
      <section
        className="relative w-full bg-[#17171788] bg-cover bg-center bg-no-repeat bg-blend-multiply"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        {/* The clamp is the original fluid heading size, kept verbatim: the h1
            inherits it, so the size lives on the wrapper rather than the heading. */}
        <div className="relative mt-[7vh] ml-[3vw] block font-mono text-[clamp(0.625rem,calc(3vw_+_0.625rem),2.1875rem)] font-bold tracking-[4px] text-ink-strong">
          <h1 className="animated-intro-text" data-value="Hi, I'm Abdelouahab">
            Hi, I'm Abdelouahab
          </h1>
        </div>
        {/* tracking is forced: global.css sets `h1..h5 { letter-spacing: 1px }`
            unlayered, and unlayered rules outrank every utility layer. */}
        <h2 className="my-[3vh] ml-[3vw] block text-center text-[0.9375rem] font-bold leading-[3vh] tracking-[4px]! text-ink md:text-left md:text-[2rem] md:leading-none">
          {" "}
          ⟫⟫ a Data Analyst & Software Engineer
        </h2>
        {/* Same forcing here for `a { letter-spacing: 0.5px }`. Text colour is
            deliberately unset: legacy-base's unlayered `a { color: ... }` would
            beat a utility anyway, and the anchor is meant to inherit. */}
        <a
          className="mx-[5vw] mt-[2vh] mb-[7vh] inline-block w-max rounded-sm bg-[#79d558] py-2.5 pr-5 pl-[50px] align-top text-2xl font-bold tracking-[2px]! md:mt-[7vh]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/bellaabdelouahab"
        >
          Buy Me A Coffee <span className="ml-5">{">"}</span>{" "}
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
