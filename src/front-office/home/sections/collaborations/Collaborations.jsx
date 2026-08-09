import { useEffect } from "react";
import "./Collaborations.css";

// Every logo is styled the same, and addAnimation() clones these nodes to build
// the second half of the marquee — cloneNode carries the class list with it.
const LOGO = "h-18.75 rounded-full bg-[#80808066] md:h-48.75";

export default function Collaborations() {
  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for reduced motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute("data-animated", true);

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.scroller-inner`
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, []);

  return (
    <div className="collaborations hidden-area bg-[#171717] bg-[linear-gradient(to_bottom,#0A0A0A,transparent_30px)] pt-7.5 pb-5">
      <div className="home-sections-title">
        <span>05. </span>
        Collaborations
      </div>
      {/* `scroller` / `scroller__inner` are queried by the effect above and by
          the surviving marquee CSS — keep both class names. */}
      <div
        className="scroller m-auto max-w-[95%]"
        data-direction="right"
        data-speed="fast"
      >
        <div className="scroller__inner flex flex-wrap gap-12.5 py-2.5">
          <img src="network/agri4.0_logo.png" alt="Agri 4.0 Logo" width="200" height="150" className={LOGO} />
          <img src="network/ensak.png" alt="ENSAK Logo" width="200" height="150" className={LOGO} />
          <img src="network/um6p_logo.png" alt="UM6P Logo" width="200" height="150" className={LOGO} />
          <img src="network/postmaroc_logo.png" alt="Postmaroc Logo" width="200" height="150" className={LOGO} />
          <img src="network/nidinnovation_logo.png" alt="NID Innovation Logo" width="200" height="150" className={LOGO} />
          <img src="network/smart-maint_logo.png" alt="Smart Maint Logo" width="200" height="150" className={LOGO} />
          <img src="network/copag_logo.png" alt="Copag Logo" width="200" height="150" className={LOGO} />
          <img src="network/agri4.0_logo.png" alt="Agri 4.0 Logo" width="200" height="150" className={LOGO} />
          <img src="network/ensak.png" alt="ENSAK Logo" width="200" height="150" className={LOGO} />
          <img src="network/um6p_logo.png" alt="UM6P Logo" width="200" height="150" className={LOGO} />
          <img src="network/postmaroc_logo.png" alt="Postmaroc Logo" width="200" height="150" className={LOGO} />
          <img src="network/nidinnovation_logo.png" alt="NID Innovation Logo" width="200" height="150" className={LOGO} />
          <img src="network/smart-maint_logo.png" alt="Smart Maint Logo" width="200" height="150" className={LOGO} />
          <img src="network/copag_logo.png" alt="Copag Logo" width="200" height="150" className={LOGO} />
        </div>
      </div>
    </div>
  );
}
