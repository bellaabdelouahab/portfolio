import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";

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
      </div>
    );
}