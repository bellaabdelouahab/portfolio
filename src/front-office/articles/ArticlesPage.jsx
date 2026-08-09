import SEO from "../../shared/ui/SEO";
// Imported rather than referenced from CSS: these are the only two bundled
// images this page uses, and an import keeps the hashed filename correct
// without a stylesheet surviving just to hold two url() rules.
import downloadIcon from "assets/images/download.png";
import newTabIcon from "assets/images/newtab.png";

export default function Articles() {
    return (
      <>
      <SEO
        title="Articles"
        description="Technical articles and research write-ups by Abdelouahab Bella on machine learning, reinforcement learning, and software engineering."
        keywords="Abdelouahab Bella articles, machine learning research, deep reinforcement learning, technical writing"
      />
      <div className="mx-auto mt-[7vh] flex max-w-full flex-wrap justify-between px-5">
        {/* Card shell matches the projects / certificates / reports grids:
            surface + line border + rounded-lg + shadow-md, green border on hover. */}
        <div className="relative mb-5 w-full rounded-lg border border-line bg-surface p-5 shadow-md transition-colors duration-200 hover:border-success/40">
          {/* Pulled outside the card on both axes, so it reads as a badge on the
              corner rather than as content. */}
          <h2 className="absolute -left-5 -top-5 flex size-12.5 items-center justify-center rounded-full bg-surface-raised text-xl font-bold leading-none text-ink-strong">
            #1
          </h2>
          <h1 className="text-center text-2xl font-black leading-snug text-ink-strong">
            Self Driving Car Using Double Deep Q-learning Network
          </h1>
          <p className="mx-auto my-[4vh] w-4/5 text-justify text-base leading-relaxed text-ink">
            {" "}
            <span className="font-bold text-ink-strong">Abstract </span>
            this is an abstract that is a summary of the article which will be
            displayed on the home page,this is an abstract that is a this is an
            abstract that is a summary of the article which will be displayed on
            the home page,this is an abstract that is a this is an abstract that
            is a summary of the article which will be displayed on the home
            page,this is an abstract that is athis is an abstract that is a
            summary of the article which will be displayed on the home page,this
            is an abstract that is a this is an abstract that is a summary of
            the article which will be displayed on the home page,this is an
            abstract that is a
          </p>
          {/* row-reverse keeps the DOM order (download first, as the primary
              action) while rendering download rightmost, which is where the old
              float:right put it. Flex also gives the footer a real height —
              with two floated children it collapsed to zero and the buttons
              hung over the card's bottom padding. */}
          <div className="flex flex-row-reverse justify-start gap-[1vw]">
            <button
              type="button"
              className="size-7 shrink-0 rounded-sm border-2 border-surface-raised"
              aria-label="Download article"
            >
              <img src={downloadIcon} alt="" className="size-full" />
            </button>
            <button
              type="button"
              className="size-7 shrink-0"
              aria-label="Open article in a new tab"
            >
              <img src={newTabIcon} alt="" className="size-full" />
            </button>
          </div>
        </div>
      </div>
      </>
    );
}
