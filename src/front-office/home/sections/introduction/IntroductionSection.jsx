import { Link } from "react-router-dom";
import { useT } from "../../../../shared/i18n/strings";
import { useLocalePath } from "../../../../shared/i18n/i18n";
import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";
// Imported rather than referenced from CSS: only a JS import gets the hashed,
// cache-busted URL Vite emits for a file under src/shared/assets.
import heroBackground from "assets/images/home-section-bg1.webp";

const OFFERS = [
  { key: "web", tags: ["WordPress", "Shopify", "Django", "Next.js", "React"], to: "/services/web" },
  { key: "data", tags: ["Power BI", "SQL", "Excel", "Python"], to: "/services/data" },
  { key: "seo", tags: ["GA4", "Search Console", "Clarity"], to: "/services/web" },
];

export default function IntroductionSection() {
  const t = useT();
  const lp = useLocalePath();
  return (
    <section
      className="introduction-section relative w-full bg-[#17171788] bg-cover bg-center bg-no-repeat bg-blend-multiply py-10 md:py-16 flex flex-col md:flex-row"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="flex w-full flex-col items-start gap-8 px-[5vw] md:w-[70%] md:px-[3vw]">
        <p className="font-mono text-sm tracking-[3px] text-success uppercase">
          {t("hero.kicker")}
        </p>
        {/* h1 tracking is forced: global.css sets letter-spacing on h1..h5 unlayered. */}
        <h1 className="text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.15] font-bold tracking-[1px]! text-ink-strong">
          {t("hero.title")}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink md:text-lg">
          {t("hero.lead")}
        </p>
        <ContactCtaButtons whatsappMessage={t("msg.whatsapp")} />
        <ul className="mt-2 grid w-full max-w-4xl gap-3 sm:grid-cols-3">
          {OFFERS.map((o) => (
            <li key={o.key}>
              <Link to={lp(o.to)} className="group flex h-full flex-col rounded-md border border-line bg-[#171717cc] p-4 transition-colors hover:border-success/60">
                <span className="text-base font-bold text-ink-strong group-hover:text-success">{t(`offer.${o.key}.title`)}</span>
                <span className="mt-1.5 text-sm leading-snug text-ink">{t(`offer.${o.key}.text`)}</span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {o.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-ink-muted">{tag}</span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <img
        src="/profile.webp"
        fetchpriority="high"
        decoding="async"
        alt={t("hero.photoAlt")}
        width="250"
        height="250"
        className="m-0 mx-auto mt-10 h-48 w-48 shrink-0 self-center rounded-full border-4 border-success/60 object-cover shadow-lg md:mt-0 md:h-[20rem] md:w-[20rem]"
      />
    </section>
  );
}
