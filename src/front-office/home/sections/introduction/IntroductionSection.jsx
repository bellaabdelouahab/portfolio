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
      className="introduction-section relative isolate w-full py-10 md:py-16 flex flex-col md:flex-row"
      
    >
      {/* Background: the photograph, inverted in the light theme so its lines
          stay visible as darker strokes on a pale ground, then a tint on top. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat in-data-[theme=light]:invert"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "var(--hero-overlay)" }} />
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
              <Link to={lp(o.to)} className="group flex h-full flex-col rounded-md border border-line bg-rail/80 p-4 transition-colors hover:border-success/60">
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
      <figure className="order-first m-0 mx-auto mb-6 flex shrink-0 flex-col items-center gap-3 self-center text-center md:order-none md:mb-0 md:mt-0 md:gap-4">
        <img
          src="/profile.webp"
          fetchpriority="high"
          decoding="async"
          alt={t("hero.photoAlt")}
          width="250"
          height="250"
          className="m-0 h-32 w-32 shrink-0 rounded-full border-4 border-success/60 object-cover shadow-lg md:h-[20rem] md:w-[20rem]"
        />
        <figcaption>
          <span className="block text-xl font-bold tracking-[1px] text-ink-strong">Abdelouahab Bella</span>
          <span className="mt-1 block text-sm text-ink">{t("hero.role")}</span>
        </figcaption>
      </figure>
      {/* Fades the photographic background into the flat colour the projects
          section starts with (the rail colour; white in light theme), so the two never meet at a hard edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-rail" />
    </section>
  );
}
