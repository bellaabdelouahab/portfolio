import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";
import { PHONE_DISPLAY, getWhatsAppLink } from "../../../../shared/lib/contactConfig";

import { useT } from "../../../../shared/i18n/strings";
export default function GetInTouchSection() {
    const t = useT();
    return (
      <div
        className="get-in-touch hidden-area"
        style={{
          background:
            "linear-gradient(to bottom, #1c1c1c, transparent 30px),#171717",
          paddingTop: "30px",
        }}
      >
        <div className="home-sections-title">
          <span>09. </span>
          {t("home.contact")}
        </div>
        <p className="get-in-touch-content">
          {t("home.contactText")}
        </p>
        <div className="get-in-touch-btn">
          <ContactCtaButtons
            className="mb-12.5 justify-center"
            whatsappMessage={t("msg.whatsapp")}
          />
        </div>
        <p className="mb-10 text-center text-sm text-ink">
          {t("contact.phoneLine")}{" "}
          <a href={getWhatsAppLink(t("msg.whatsapp"))} target="_blank" rel="noopener noreferrer" className="font-bold text-success!">
            {PHONE_DISPLAY}
          </a>
        </p>
      </div>
    );
}