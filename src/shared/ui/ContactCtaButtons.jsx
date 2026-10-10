import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { getWhatsAppLink, getMailtoLink, BOOKING_URL } from "../lib/contactConfig";

import { useT } from "../i18n/strings";
/**
 * Shared by the hero and Get in Touch: two contact channels side by side
 * rather than one — WhatsApp for the one-click/informal majority, email for
 * visitors who'd rather write first and stay asynchronous, and a Calendly
 * link for visitors who want a 30-minute call straight away.
 */
const track = (name) => () => window.plausible?.(name);

export default function ContactCtaButtons({ className = "", whatsappMessage = "" }) {
  const t = useT();
  return (
    <div className={["flex flex-wrap items-center gap-3", className].join(" ")}>
      <a
        href={getWhatsAppLink(whatsappMessage)}
        onClick={track("Contact: WhatsApp")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-w-[12.5rem] items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent bg-[#25D366] px-5 py-2.5 text-sm font-bold tracking-[1px]! text-black! in-data-[theme=light]:bg-success in-data-[theme=light]:text-white! transition-transform duration-200 ease-standard hover:scale-105"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
        {t("cta.whatsapp")}
      </a>
      <a
        href={getMailtoLink()}
        onClick={track("Contact: Email")}
        className="inline-flex min-w-[12.5rem] items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-success px-5 py-2.5 text-sm font-bold tracking-[1px]! text-success! transition-transform duration-200 ease-standard hover:scale-105 hover:bg-success/10"
      >
        <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
        {t("cta.email")}
      </a>
      <a
        href={BOOKING_URL}
        onClick={track("Contact: Book a meeting")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-w-[12.5rem] items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent bg-success px-5 py-2.5 text-sm font-bold tracking-[1px]! text-on-success! in-data-[theme=light]:bg-ink-strong in-data-[theme=light]:text-page! transition-transform duration-200 ease-standard hover:scale-105"
      >
        <FontAwesomeIcon icon={faCalendarCheck} className="text-lg" />
        {t("cta.book")}
      </a>
    </div>
  );
}
