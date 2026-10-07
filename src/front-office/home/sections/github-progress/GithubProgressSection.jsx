import "./GithubProgressSection.css";

import { useT } from "../../../../shared/i18n/strings";
export default function GithubProgressSection() {
    const t = useT();
    return (
      // Gradient fade into the section above, over the section's own black.
      <section className="github-progress-section hidden-area relative w-full bg-[#1c1c1c] bg-[linear-gradient(to_bottom,#171717,transparent_30px)] pt-7.5">
        <h2 className="home-sections-title">
          <span>03. </span>
          {t("home.githubProgress")}
        </h2>
        {/* The class is still load-bearing: GithubProgressSection.css keeps the
            animated gradient glow (pseudo-elements + keyframes) and the remote
            activity-graph background, which only loads once HomePage's
            IntersectionObserver adds .visible to the section. */}
        <div className="github-progress-section__img relative mx-auto mb-7.5 h-[35vw] w-[95%] rounded-sm md:h-[25vw] md:w-[90%]" />
      </section>
    );
}
