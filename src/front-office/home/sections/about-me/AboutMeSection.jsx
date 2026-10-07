import { useT } from "../../../../shared/i18n/strings";
import { useContent } from "../../../../shared/i18n/useContent";

/**
 * The skill bullet marker used to be a `li::before` whose `content` changed at
 * the narrow breakpoint (✓ on desktop, ▹ on mobile). Pseudo-element content is
 * not something a utility can express, so both glyphs are real spans and the
 * breakpoint picks one. The fixed-width marker column reproduces the original
 * `padding-left: 20px` + absolutely-positioned marker.
 */
function SkillItem({ children }) {
  return (
    <li className="mb-2.5 flex w-max items-baseline text-[0.6875rem] font-bold leading-none text-ink">
      <span aria-hidden="true" className="w-5 shrink-0 text-[0.9375rem] leading-3 text-success">
        <span className="md:hidden">▹</span>
        <span className="hidden md:inline">✓</span>
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function AboutMeSection() {
  const t = useT();
  const { about } = useContent();
  const skills = about.skills;
  return (
    // The gradient is the 30px fade from the previous section's black into this
    // section's own #171717 — background-image over background-colour, so both
    // halves of the original shorthand survive as separate utilities.
    <section className="relative w-full bg-[#171717] bg-[linear-gradient(to_bottom,#1c1c1c,transparent_30px)] py-[30px]">
      <div className="kra"></div>
      <div className="hidden-area">
        <div className="home-sections-title">
          <span>02. </span>
          {t("home.about")}
        </div>
        {/* Fixed 45vh height only from md up; below that the columns stack and the
            section has to grow with its content. */}
        <div className="mx-auto flex h-max w-4/5 flex-col items-center justify-center gap-2.5 md:h-[45vh] md:flex-row">
          <div className="w-full md:w-fit">
            {/* leading-5 explicitly — body { line-height: 1 } is global. */}
            <p className="p-2.5 text-justify text-xs font-bold leading-5 text-ink md:p-[1.875rem]">
              {about.intro}
            </p>
            <p className="p-2.5 text-justify text-xs font-bold leading-5 text-ink md:p-[1.875rem]">
              {about.detailedIntro}
            </p>
            <span className="flex h-min w-fit items-center justify-center p-[2vh] text-[0.9375rem] font-medium tracking-[4px] text-success underline">
              {t("home.skills")}
            </span>
            <div className="w-fit">
              {/* One column below md, two above — the tracks keep their original
                  minmax so a long skill still clips rather than widening the grid. */}
              <ul className="mt-[1vh] grid grid-cols-[minmax(100px,250px)] gap-x-[6.25rem] gap-y-[5px] overflow-hidden p-[1vh] md:grid-cols-[repeat(2,minmax(100px,250px))]">
                {skills.map((skill) => (
                  <SkillItem key={skill}>{skill}</SkillItem>
                ))}
              </ul>
            </div>
          </div>
          <div className="z-[1] flex h-[84vw] w-[70vw] items-center justify-center rounded-sm bg-[#202020] md:h-[300px] md:w-[300px]">
            {/* ::before is a scrim that lifts on hover; ::after is the offset teal
                frame that slides in to meet the photo. after sits at -z-[1] so it
                reads as behind the image inside the parent's stacking context. */}
            <div
              className={[
                "relative h-full w-full rounded-sm bg-cover bg-center bg-no-repeat",
                "before:absolute before:h-full before:w-full before:rounded-sm before:bg-[#373737]",
                "before:opacity-50 before:transition-opacity before:duration-300 before:ease-standard before:content-['']",
                "hover:before:opacity-20",
                "after:absolute after:top-5 after:left-5 after:-z-[1] after:h-full after:w-full",
                "after:rounded-sm after:border-[3px] after:border-[#80cbc4]",
                "after:transition-all after:duration-300 after:ease-standard after:content-['']",
                "hover:after:top-2.5 hover:after:left-2.5",
              ].join(" ")}
              style={{ backgroundImage: "url('/profile-photo.webp')" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
