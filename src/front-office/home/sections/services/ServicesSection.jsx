import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../shared/lib/firebase";
import { servicesContent } from "../../homeContent";

// Eighteen form fields across three forms share one look, so the class lists
// live here instead of being repeated on every input.
const FIELD =
  "w-full rounded-sm border border-line bg-surface p-3 text-base text-ink-strong focus:border-success focus:outline-none";
const TEXTAREA = `${FIELD} min-h-25 resize-y`;

const BACK_BUTTON =
  "mb-1.25 inline-flex cursor-pointer items-center rounded-sm border border-success/80 bg-success/80 px-5 py-2.5 text-base font-semibold text-ink-strong transition-colors duration-300 ease-standard hover:bg-[#1e1e1e] hover:text-success";

const SUBMIT =
  "cursor-pointer rounded-sm border border-success bg-success px-6.25 py-3 text-xs font-bold text-ink-strong transition-all duration-300 ease-standard hover:bg-transparent hover:text-success disabled:cursor-not-allowed disabled:opacity-70";

// The panel scrolls on its own, so it keeps its custom scrollbar. Tailwind v4
// reaches ::-webkit-scrollbar through arbitrary variants, which is what let the
// SCSS module be deleted outright.
const FORM_CONTENT = [
  "mx-auto h-full max-w-200 overflow-y-auto rounded-sm p-2.5 shadow-[rgba(42,193,128,0.575)_0px_0px_0px_3px] sm:p-5",
  "[&::-webkit-scrollbar]:w-2",
  "[&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-track]:shadow-[inset_0_0_6px_rgba(0,0,0,0.3)]",
  "[&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-[#505156]",
].join(" ");

// Each form sits one full viewport to the right and slides in over the cards,
// which slide out to the left at the same time.
// Budgets are in MAD. Each service has its own ranges so the options match
// what the work realistically costs.
const FORMS = {
  web: {
    heading: "Start a web project",
    fields: [
      { name: "projectType", label: "Project Type", options: ["Business website", "Booking or management platform", "Online store", "Web application", "Redesign of an existing site", "Other"] },
      { name: "features", label: "Features Needed", textarea: "Pages, integrations, languages, anything you already have" },
    ],
    budgets: ["Less than 6,000 MAD", "6,000 - 15,000 MAD", "15,000 - 30,000 MAD", "More than 30,000 MAD"],
  },
  data: {
    heading: "Discuss your data project",
    fields: [
      { name: "projectType", label: "What do you need", options: ["Dashboard (Power BI or web)", "Automated reports", "Data cleaning and migration", "Web and sales analytics setup", "Machine learning or computer vision", "Not sure yet"] },
      { name: "dataSources", label: "Data Sources", textarea: "Excel files, ERP, database, website analytics..." },
    ],
    budgets: ["Less than 3,000 MAD", "3,000 - 8,000 MAD", "8,000 - 20,000 MAD", "More than 20,000 MAD"],
  },
};

const TIMELINES = ["Less than 1 month", "1-3 months", "3-6 months", "More than 6 months"];

const FORM_WRAPPER =
  "absolute top-0 left-full h-full w-full bg-[#1e1e1e] transition-transform duration-500 ease-standard";

function FormGroup({ label, children }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}

export default function ServicesSection() {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (service, additionalData = {}) => {
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...formData,
        ...additionalData,
        service,
        timestamp: new Date(),
      };
      await addDoc(collection(db, "offers"), dataToSubmit);
      alert(
        "Thank you! Your request has been submitted. I will be in touch shortly."
      );
      setActiveForm(null);
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-auto w-full bg-[#171717] bg-[linear-gradient(to_bottom,#0A0A0A,transparent_30px)] pt-7.5">
      <div className="home-sections-title">
        <span>07. </span>
        Services
      </div>

      {/* overflow-x-hidden is what hides the forms parked off to the right. */}
      <div className="relative h-auto w-full overflow-x-hidden">
        {/* Original Cards Display */}
        <div
          className={[
            "w-full transition-transform duration-500 ease-standard",
            activeForm ? "-translate-x-full" : "",
          ].join(" ")}
        >
          <div className="m-auto grid w-full grid-cols-1 justify-items-center gap-2.5 p-2.5 sm:gap-5 sm:p-5 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
            {servicesContent.map((s) => (
              // max-w rather than a fixed 350px width: the old fixed width
              // overflowed its own container on sub-350px phones.
              <div
                className="mb-5 flex w-full max-w-87.5 flex-col justify-between rounded-md bg-[#1e1e1e] p-2.5 text-center shadow-[#29b57820_6px_2px_16px_0px,#29b57820_-6px_-2px_16px_0px] sm:p-5 md:mb-0"
                key={s.id}
              >
                <img
                  src={s.icon}
                  alt=""
                  width="75"
                  height="75"
                  className="m-auto mb-2.5"
                />
                <h3 className="mb-2.5 text-2xl leading-snug font-bold text-success">
                  <Link to={`/services/${s.id}`} className="hover:underline">
                    {s.title}
                  </Link>
                </h3>
                <p className="mb-3 grow text-lg leading-tight text-ink">
                  {s.description}
                </p>
                <p className="mb-5 text-sm font-bold tracking-[1px] text-ink-strong">
                  {s.startingPrice}
                </p>
                <button
                  className="cursor-pointer rounded-sm border border-success bg-success px-5 py-2.5 text-xs font-bold text-[#2e2d2d] no-underline outline-none transition-all duration-300 ease-standard hover:bg-[#1e1e1e] hover:text-success"
                  onClick={() => setActiveForm(s.id)}
                >
                  {s.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {servicesContent.map((svc) => {
          const form = FORMS[svc.id];
          if (!form) return null;
          return (
            <div
              key={svc.id}
              className={[
                FORM_WRAPPER,
                activeForm === svc.id ? "-translate-x-full p-6.25" : "",
              ].join(" ")}
            >
              <div className={FORM_CONTENT}>
                <div className="mb-5">
                  <button className={BACK_BUTTON} onClick={() => setActiveForm(null)}>
                    ← Back to Services
                  </button>
                  <h2 className="mt-2.5 text-2xl leading-snug text-success">{form.heading}</h2>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = e.target;
                    const extra = { company: f.company.value, budget: f.budget.value, timeline: f.timeline.value, currency: "MAD" };
                    form.fields.forEach((field) => { extra[field.name] = f[field.name].value; });
                    handleSubmit(svc.id, extra);
                  }}
                >
                  <FormGroup label="Name">
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={FIELD} />
                  </FormGroup>
                  <FormGroup label="Email">
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={FIELD} />
                  </FormGroup>
                  <FormGroup label="Company or Organization">
                    <input type="text" name="company" className={FIELD} />
                  </FormGroup>
                  {form.fields.map((field) => (
                    <FormGroup key={field.name} label={field.label}>
                      {field.options ? (
                        <select name={field.name} required className={FIELD}>
                          <option value="">Select</option>
                          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <textarea name={field.name} placeholder={field.textarea} required className={TEXTAREA}></textarea>
                      )}
                    </FormGroup>
                  ))}
                  <FormGroup label="Budget Range (MAD)">
                    <select name="budget" required className={FIELD}>
                      <option value="">Select Budget</option>
                      {form.budgets.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup label="Timeline">
                    <select name="timeline" required className={FIELD}>
                      <option value="">Select Timeline</option>
                      {TIMELINES.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </FormGroup>
                  <button type="submit" className={SUBMIT}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
