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
        className="relative w-full bg-[#17171788] bg-cover bg-center bg-no-repeat bg-blend-multiply"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        {/* Photo last in the DOM (name/heading stays first for SEO and screen
            readers) but flex-col-reverse puts it on top visually on mobile —
            a client sees the face before the sales copy, per the user's call
            that this matters. At md+ it sits beside the text instead, the
            usual consulting-site "portrait next to pitch" layout. */}
        <div className="flex flex-col-reverse items-center gap-6 px-[3vw] md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="w-full">
            {/* The clamp is the original fluid heading size, kept verbatim: the h1
                inherits it, so the size lives on the wrapper rather than the heading. */}
            <div className="relative mt-[7vh] block font-mono text-[clamp(0.625rem,calc(3vw_+_0.625rem),2.1875rem)] font-bold tracking-[4px] text-ink-strong">
              <h1 className="animated-intro-text" data-value="Hi, I'm Abdelouahab">
                Hi, I'm Abdelouahab
              </h1>
            </div>
            {/* tracking is forced: global.css sets `h1..h5 { letter-spacing: 1px }`
                unlayered, and unlayered rules outrank every utility layer. */}
            <h2 className="my-[3vh] block text-center text-[0.9375rem] font-bold leading-[3vh] tracking-[4px]! text-ink md:text-left md:text-[2rem] md:leading-none">
              {" "}
              ⟫⟫ a Data Analyst & Software Engineer
            </h2>
            {/* Primary CTA: how a visitor actually starts a conversation. This used
                to be the only button in the hero, and it was "Buy Me A Coffee" — a
                tip jar left over from open-source work, not a way to hire the
                person the rest of the page is trying to sell. Removed rather than
                demoted, at the user's call. */}
            <div className="mt-[2vh] mb-[7vh] md:mt-[7vh]">
              <ContactCtaButtons whatsappMessage="Hi Abdelouahab, I found your portfolio and would like to talk about a project." />
            </div>
          </div>

          <img
            src="/profile.png"
            alt="Abdelouahab Bella"
            width="176"
            height="176"
            className="mt-[7vh] size-32 shrink-0 rounded-full border-4 border-success/60 object-cover shadow-lg md:size-44"
          />
        </div>

        {/* px-[3vw] matches the row above — the section's children used to use
            hand-picked, mismatched vw margins (title 3vw, button 5vw); now
            everything above the snippet shares one gutter. mt-12 gives it room
            to read as its own element rather than crowding the call to action. */}
        <div className="mb-16 mt-12 px-[3vw]">
          <CodeCard />
        </div>
      </section>
    );
}
