import { ProjectCard } from "../../../projects/components/ProjectCard";

export default function ProjectsSection({ projectHighlight }) {
    return (
      // Gradient fade into the hero above, over the section's own black.
      <section className="home-projects-section hidden-area w-full bg-[#0A0A0A] bg-[linear-gradient(to_bottom,#131412,transparent_30px)] pt-7.5">
        {/* tracking is forced: global.css sets `h1..h5 { letter-spacing: 1px }`
            unlayered, and unlayered rules outrank every utility layer. */}
        <h2 className="mt-[2vh] mb-[2vh] ml-[3vw] text-2xl font-bold tracking-[4px]! text-ink-strong">
          ❤️ Projects Highlights
        </h2>
        {/* border-0 undoes preflight's `hr { border-top-width: 1px }`, otherwise
            the rule renders as its border rather than its own 0.5px height. */}
        <hr className="h-[0.5px] w-[95%] border-0 bg-[#6a6666]" />
        <div className="mx-auto flex w-full flex-row flex-wrap justify-center gap-7.5 p-5">
            {projectHighlight &&
                projectHighlight.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
        </div>
      </section>
    );
}
