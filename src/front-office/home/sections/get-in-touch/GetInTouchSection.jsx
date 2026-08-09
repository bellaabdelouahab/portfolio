import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";

export default function GetInTouchSection() {
    return (
      <div
        className="get-in-touch hidden-area"
        style={{
          background:
            "linear-gradient(to bottom, #0A0A0A, transparent 30px),#171717",
          paddingTop: "30px",
        }}
      >
        <div className="home-sections-title">
          <span>09. </span>
          Get in Touch
        </div>
        <p className="get-in-touch-content">
          Abdelouahab Bella is currently taking on freelance and consulting
          projects as an independent auto-entrepreneur in Agadir, Morocco. If
          you need help with digital adoption, data analytics, or web
          development, his inbox is open — let's talk about how he can help
          your business grow.
        </p>
        <div className="get-in-touch-btn">
          <ContactCtaButtons
            className="mb-12.5 justify-center"
            whatsappMessage="Hi Abdelouahab, I found your portfolio and would like to talk about a project."
          />
        </div>
      </div>
    );
}