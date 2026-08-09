import { useEffect } from "react";
import CodeCard from "./CodeCard";
import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";
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
        className="introduction-section relative w-full bg-[#17171788] bg-cover bg-center bg-no-repeat bg-blend-multiply py-10 md:py-16 flex flex-col md:flex-row"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <style>{`
          .introduction-section a[href^="mailto:"] {
            color: #25D366 !important;
            background-color: #25D36611 !important;
          }
        `}</style>
        {/* Photo last in the DOM (name/heading stays first for SEO and screen
            readers) but on mobile the image should sit under the copy for a
            cleaner vertical flow; at md+ it sits beside the text, matching
            the screenshot position. */}
        <div className="flex flex-col items-start gap-8 px-[3vw] md:flex-col md:items-start md:justify-between md:gap-8">
          <div className="w-full max-w-xl md:max-w-none">
            {/* The clamp is the original fluid heading size, kept verbatim: the h1
                inherits it, so the size lives on the wrapper rather than the heading. */}
            <div className="relative block font-mono text-[clamp(1rem,calc(4vw_+_0.5rem),2.5rem)] font-bold tracking-[4px] text-ink-strong">
              <h1
                className="animated-intro-text"
                data-value="Hi, I'm Abdelouahab"
              >
                Hi, I'm Abdelouahab
              </h1>
            </div>
            {/* tracking is forced: global.css sets `h1..h5 { letter-spacing: 1px }`
                unlayered, and unlayered rules outrank every utility layer. */}
            <h2 className="my-8 block text-center text-[1rem] font-bold leading-[1.2] tracking-[4px]! text-ink md:text-left md:text-[2rem] md:leading-none">
              {" "}
              ⟫⟫ a Data Analyst & Software Engineer
            </h2>
            {/* Primary CTA: how a visitor actually starts a conversation. This used
                to be the only button in the hero, and it was "Buy Me A Coffee" — a
                tip jar left over from open-source work, not a way to hire the
                person the rest of the page is trying to sell. Removed rather than
                demoted, at the user's call. */}
            <div className="mt-8 mb-12 md:mt-10">
              <ContactCtaButtons whatsappMessage="Hi Abdelouahab, I found your portfolio and would like to talk about a project." />
            </div>
          </div>
          <div className="mb-16 mt-12 px-[3vw] w-full max-w-xl md:max-w-none md:mb-0">
            <CodeCard />
          </div>
        </div>

        <img
          src="/profile.png"
          alt="Abdelouahab Bella"
          width="250"
          height="250"
          className="m-0 mx-auto w-48 h-48 shrink-0 rounded-full border-4 border-success/60 object-cover shadow-lg md:mt-0 md:w-[25rem] md:h-[25rem] self-center md:w-[20%]"
        />
      </section>
    );
}



