import ContactCtaButtons from "../../../../shared/ui/ContactCtaButtons";

export default function GetInTouchSection() {
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
          Get in Touch
        </div>
        <p className="get-in-touch-content">
          I take on freelance web development and data analytics projects
          from Agadir, Morocco, for clients in Morocco and abroad. Book a free
          30-minute call, or send a message with a few lines about what you
          need. You get a fixed price in MAD within two working days.
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