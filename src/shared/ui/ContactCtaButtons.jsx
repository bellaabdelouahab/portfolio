import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { getWhatsAppLink, getMailtoLink } from "../lib/contactConfig";

/**
 * Shared by the hero and Get in Touch: two contact channels side by side
 * rather than one — WhatsApp for the one-click/informal majority, email for
 * visitors who'd rather write first and stay asynchronous. A "Book a call"
 * third option is intentionally not here yet; it needs a scheduler link
 * (Calendly/Cal.com) that doesn't exist yet.
 */
export default function ContactCtaButtons({ className = "", whatsappMessage = "" }) {
  return (
    <div className={["flex flex-wrap items-center gap-3", className].join(" ")}>
      <a
        href={getWhatsAppLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-sm font-bold tracking-[1px]! text-white transition-transform duration-200 ease-standard hover:scale-105"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
        WhatsApp Me
      </a>
      <a
        href={getMailtoLink()}
        className="inline-flex items-center gap-2 rounded-sm border border-success px-5 py-2.5 text-sm font-bold tracking-[1px]! text-success transition-transform duration-200 ease-standard hover:scale-105 hover:bg-success/10"
      >
        <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
        Contact Me
      </a>
    </div>
  );
}
