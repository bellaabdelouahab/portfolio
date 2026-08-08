import { useState } from "react";
import { Helmet } from "react-helmet";
import "./FAQSection.css";
import { faqData } from "../../homeContent";

export default function FAQSection() {
  const [openId, setOpenId] = useState(faqData[0]?.id);

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqPageSchema)}
        </script>
      </Helmet>

      <section className="faq-section hidden-area">
        <div className="home-sections-title">
          <span>09. </span>
          Frequently Asked Questions
        </div>

        <div className="faq-container">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div className="faq-item" key={item.id}>
                <button
                  className={`faq-question ${isOpen ? "open" : ""}`}
                  onClick={() =>
                    setOpenId(isOpen ? null : item.id)
                  }
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={`faq-answer-${item.id}`}
                  className={`faq-answer ${isOpen ? "open" : ""}`}
                  aria-hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
