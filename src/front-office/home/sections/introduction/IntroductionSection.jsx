import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";
// Imported rather than referenced from CSS: only a JS import gets the hashed,
// cache-busted URL Vite emits for a file under src/shared/assets.
import heroBackground from "assets/images/home-section-bg1.jpg";

const PROOF = [
  ["Websites and web apps", "React, Django and FastAPI, deployed on your domain"],
  ["Dashboards and reports", "Power BI, SQL and Python, refreshed automatically"],
  ["Fixed price in MAD", "Free 30-minute call, proposal in two working days"],
];

export default function IntroductionSection() {
  return (
    <section
      className="introduction-section relative w-full bg-[#17171788] bg-cover bg-center bg-no-repeat bg-blend-multiply py-10 md:py-16 flex flex-col md:flex-row"
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
          Freelance web developer and data analyst. I take a project from the
          first sketch to a live site or dashboard, and show you the numbers
          that prove it works.
        </p>
        <ContactCtaButtons whatsappMessage="Hi Abdelouahab, I found your portfolio and would like to talk about a project." />
        <ul className="mt-2 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {PROOF.map(([title, text]) => (
            <li key={title} className="rounded-sm border border-line bg-[#0a0a0a99] p-3">
              <p className="text-sm font-bold text-ink-strong">{title}</p>
              <p className="mt-1 text-xs leading-snug text-ink">{text}</p>
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
