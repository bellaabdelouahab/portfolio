import { useEffect } from "react";
import "./Collaborations.css";

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
    <div className="collaborations hidden-area">
      <div className="home-sections-title">
        <span>06. </span>
        Collaborations
        <hr />
      </div>
      <div className="scroller" data-direction="right" data-speed="fast">
        <div className="scroller__inner">
          <img src="network/agri4.0_logo.png" alt="" />
          <img src="network/ensak.png" alt="" />
          <img src="network/um6p_logo.png" alt="" />
          <img src="network/postmaroc_logo.png" alt="" />
          <img src="network/nidinnovation_logo.png" alt="" />
          <img src="network/smart-maint_logo.png" alt="" />
          <img src="network/agri4.0_logo.png" alt="" />
          <img src="network/ensak.png" alt="" />
          <img src="network/um6p_logo.png" alt="" />
          <img src="network/postmaroc_logo.png" alt="" />
          <img src="network/nidinnovation_logo.png" alt="" />
          <img src="network/smart-maint_logo.png" alt="" />
        </div>
      </div>
    </div>
  );
}
