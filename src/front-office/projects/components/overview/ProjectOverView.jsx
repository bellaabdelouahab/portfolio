import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function ProjectOverView({ project }) {
  const startDate = project.startDate ? project.startDate.slice(0, 10) : "";
  const endDate = project.endDate
    ? project.endDate.slice(0, 10)
    : "Still Working";

  return (
    // z-[1] lifts the hero above the absolutely-positioned starfield, which sits
    // at z-0 and is appended to .project-page after mount.
    <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-5 bg-linear-to-b from-[#212429] to-[#1a1c1f] px-[6vw] py-[4vh] md:flex-row md:gap-[1.875rem] md:py-[5vh]">
      {/* backgroundImage, not the `background` shorthand: the shorthand resets
          background-size / -position / -repeat, and inline styles outrank
          classes, so bg-cover & friends would have been discarded. The old CSS
          worked around that with three !important declarations. */}
      <div
        className="min-h-[220px] w-full flex-1 rounded-lg bg-black bg-cover bg-center bg-no-repeat shadow-lg ring-1 ring-[#2db811]/20 transition-[transform,box-shadow] duration-300 ease-standard hover:-translate-y-1 hover:ring-[#2db811]/35 md:min-h-[320px] md:w-auto md:max-w-[560px] md:min-w-[480px]"
        style={{ backgroundImage: `url(${project.image})` }}
      />

      <div className="relative flex w-full flex-col items-start py-[0.3125rem] text-ink-strong md:w-1/2 md:max-w-[640px]">
        {/* Gradient text. The three-stop linear-gradient stays an arbitrary
            value rather than from-/via-/to- utilities so the 40% midpoint and
            the 100deg angle read as one unit. -webkit-text-fill-color is kept
            alongside text-transparent for older WebKit. */}
        <h1 className="mb-3 bg-clip-text text-xl leading-tight font-extrabold tracking-[-0.01em]! text-transparent [background-image:linear-gradient(100deg,#4ade80_0%,#22c55e_40%,#6366f1_100%)] [-webkit-text-fill-color:transparent] md:mb-4 md:text-3xl">
          {project.title}
        </h1>

        <p className="mb-4 w-full text-xs leading-relaxed font-normal text-ink-muted md:mb-6">
          {project.description}
        </p>

        <div className="flex w-full flex-col items-start gap-2 border-t border-[#2db811]/20 pt-3 md:flex-row md:items-center md:justify-between md:gap-0">
          <p className="text-xs leading-normal font-medium tracking-wide! text-ink-muted">
            {startDate} ⇒ {endDate} | Duration : {project?.durration}
          </p>
          <div className="flex items-center justify-center text-xs leading-normal tracking-wide! text-ink-muted">
            {/* text-* needs ! on anchors: legacy-base.css has an unlayered
                `a { color: var(--brand_secondary) }` whose var is undefined, so
                it computes to `inherit` and still beats the utility layer. */}
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="mr-0 inline-flex items-center gap-1 rounded-full border border-[#2db811]/20 bg-[#2db811]/15 px-2.5 py-1 text-xs font-medium text-ink-strong! transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:border-[#2db811] hover:bg-[#2db811] hover:text-[#0e1710]!"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            Github
          </div>
        </div>
      </div>
    </div>
  );
}
