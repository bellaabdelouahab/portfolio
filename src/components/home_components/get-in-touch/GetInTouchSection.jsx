export default function GetInTouchSection() {
    return (
      <div
        className="get-in-touch hidden-area"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div className="home-sections-title">
          <span>08. </span>
          Get in Touch
        </div>
        <p className="get-in-touch-content">
          I'm currently taking on freelance and consulting projects as an
          independent auto-entrepreneur. If you need help with digital adoption,
          data analytics, or web development, my inbox is open. Let's talk about
          how I can help your business grow.
        </p>
        <div className="get-in-touch-btn">
          <a href="mailto:">
            <button style={{ marginBottom: "5rem" }}>Get in Touch</button>
          </a>
        </div>
      </div>
    );
}