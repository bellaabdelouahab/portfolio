import { Link } from "react-router-dom";
import { ProjectCard } from "../../../projects/components/ProjectCard";

import { useT } from "../../../../shared/i18n/strings";
import { useLocalePath } from "../../../../shared/i18n/i18n";
export default function ProjectsSection({ projectHighlight }) {
    const t = useT();
    const lp = useLocalePath();
    return (
      // Gradient fade into the hero above, over the section's own black.
      <section className="home-projects-section hidden-area w-full bg-main bg-[linear-gradient(to_bottom,var(--color-rail),transparent_30px)] pt-7.5">
        {/* tracking is forced: global.css sets `h1..h5 { letter-spacing: 1px }`
            unlayered, and unlayered rules outrank every utility layer. */}
        <h2 className="mt-[2vh] mb-[2vh] ml-[3vw] text-2xl font-bold tracking-[4px]! text-ink-strong">
          {t("home.selected")}
        </h2>
        {/* border-0 undoes preflight's `hr { border-top-width: 1px }`, otherwise
            the rule renders as its border rather than its own 0.5px height. */}
        <hr className="h-[0.5px] w-[95%] border-0 bg-ink-muted" />
        <div className="mx-auto grid w-[94%] grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {projectHighlight &&
                projectHighlight.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
        </div>
        <p className="pb-6 text-center">
          <Link to={lp("/projects")} className="font-bold tracking-[2px]! text-success! hover:underline">
            {t("home.seeAll")}
          </Link>
        </p>
      </section>
    );
}
