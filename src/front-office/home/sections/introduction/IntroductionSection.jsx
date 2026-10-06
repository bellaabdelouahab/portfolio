import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";
// Imported rather than referenced from CSS: only a JS import gets the hashed,
// cache-busted URL Vite emits for a file under src/shared/assets.
import heroBackground from "assets/images/home-section-bg1.jpg";

const PROOF = [
  ["Websites and web apps", "M3 5h18v11H3zM8 20h8M12 16v4"],
  ["Dashboards and reports", "M4 20V10M10 20V4M16 20v-8M22 20H2"],
  ["Fixed price in MAD", "M12 3v18M7 8c0-2 2-3 5-3s5 1 5 3-2 3-5 4-5 2-5 4 2 3 5 3 5-1 5-3"],
];

export default function IntroductionSection() {
  return (
    <section
      className="introduction-section relative w-full bg-[#14192288] bg-cover bg-center bg-no-repeat bg-blend-multiply py-10 md:py-16 flex flex-col md:flex-row"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="flex w-full flex-col items-start gap-8 px-[5vw] md:w-[70%] md:px-[3vw]">
        <p className="font-mono text-sm tracking-[3px] text-success uppercase">
          Abdelouahab Bella · Agadir, Morocco
        </p>
        {/* h1 tracking is forced: global.css sets letter-spacing on h1..h5 unlayered. */}
        <h1 className="text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.15] font-bold tracking-[1px]! text-ink-strong">
          I build websites and turn your data into decisions.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink md:text-lg">
          Freelance web developer and data analyst in Agadir. From the first
          sketch to a live site or dashboard.
        </p>
        <ContactCtaButtons whatsappMessage="Hi Abdelouahab, I found your portfolio and would like to talk about a project." />
        <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
          {PROOF.map(([title, icon]) => (
            <li key={title} className="flex items-center gap-2.5 text-sm font-bold text-ink-strong">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-success" aria-hidden="true">
                <path d={icon} />
              </svg>
              {title}
            </li>
          ))}
        </ul>
      </div>
      <img
        src="/profile.png"
        alt="Abdelouahab Bella"
        width="250"
        height="250"
        className="m-0 mx-auto mt-10 h-48 w-48 shrink-0 self-center rounded-full border-4 border-success/60 object-cover shadow-lg md:mt-0 md:h-[20rem] md:w-[20rem]"
      />
    </section>
  );
}
