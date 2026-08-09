import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { getWhatsAppLink } from "../lib/contactConfig";

/**
 * Always-visible chat entry point, not just a hero/footer CTA. Moroccan
 * visitors default to WhatsApp over email for a first contact, and this is
 * the pattern local business sites already train them to expect: a small
 * green circle, bottom-right, on every page.
 */
export default function WhatsAppFloatingButton() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message me on WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition-transform duration-200 ease-standard hover:scale-110 md:right-6 md:bottom-6"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
}
