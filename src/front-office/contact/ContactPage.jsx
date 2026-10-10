import SEO from "../../shared/ui/SEO";
import ContactCtaButtons from "../../shared/ui/ContactCtaButtons";
import BusinessStatus from "../../shared/ui/BusinessStatus";
import { getAbsoluteUrl } from "../../shared/lib/siteConfig";
import { CONTACT_EMAIL, PHONE_DISPLAY, getTelephone } from "../../shared/lib/contactConfig";
import { useT } from "../../shared/i18n/strings";
import { useLang } from "../../shared/i18n/i18n";

/**
 * A page of its own for the thing visitors (and search engines) look for after
 * the brand name: how to reach you. Contact details come from the central
 * settings, so editing them in the back office updates this page too.
 */
export default function ContactPage() {
  const t = useT();
  const lang = useLang();
  const path = lang === "fr" ? "/fr/contact" : "/contact";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: getAbsoluteUrl(path),
    name: t("contact.title"),
    about: { "@id": getAbsoluteUrl("/#business") },
    mainEntity: {
      "@type": "ProfessionalService",
      "@id": getAbsoluteUrl("/#business"),
      name: "Abdelouahab Bella, web development and data analytics",
      email: CONTACT_EMAIL,
      telephone: getTelephone(),
      address: { "@type": "PostalAddress", addressLocality: "Agadir", addressCountry: "MA" },
      areaServed: "Morocco",
    },
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-8 md:py-12">
      <SEO
        structuredData={structuredData}
        breadcrumbs={[[t("nav.home"), "/"], [t("contact.title"), "/contact"]]}
      />
      <header className="mb-8 max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold tracking-[1px]! text-ink-strong md:text-4xl">{t("contact.title")}</h1>
        <p className="text-base leading-relaxed text-ink">{t("contact.lead")}</p>
      </header>

      <div className="rounded-md border border-line bg-surface p-6">
        <ContactCtaButtons className="justify-start" whatsappMessage={t("msg.whatsapp")} />
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold tracking-[1px]! text-ink-muted uppercase">WhatsApp</dt>
            <dd className="mt-1 text-ink-strong">{PHONE_DISPLAY}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold tracking-[1px]! text-ink-muted uppercase">Email</dt>
            <dd className="mt-1 break-all text-ink-strong">{CONTACT_EMAIL}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold tracking-[1px]! text-ink-muted uppercase">{t("contact.where")}</dt>
            <dd className="mt-1 text-ink-strong">{t("contact.whereValue")}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink">{t("home.contactText")}</p>
      <BusinessStatus className="mt-6" />
    </section>
  );
}
