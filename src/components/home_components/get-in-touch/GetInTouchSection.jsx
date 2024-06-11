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
          I am actively seeking new career opportunities and my inbox is open
          for potential job offers. Feel free to reach out with any relevant job
          opportunities or to connect for potential future collaborations. I
          look forward to hearing from you!
        </p>
        <div className="get-in-touch-btn">
          <a href="mailto:">
            <button style={{ marginBottom: "5rem" }}>Get in Touch</button>
          </a>
        </div>
      </div>
    );
}