import { useState } from "react";
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
                  {s.title}
                </h3>
                <p className="mb-5 grow text-lg leading-tight text-ink">
                  {s.description}
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

        {/* AI Form */}
        <div
          className={[
            FORM_WRAPPER,
            activeForm === "ai" ? "-translate-x-full p-6.25" : "",
          ].join(" ")}
        >
          <div className={FORM_CONTENT}>
            <div className="mb-5">
              <button
                className={BACK_BUTTON}
                onClick={() => setActiveForm(null)}
              >
                ← Back to Services
              </button>
              <h2 className="mt-2.5 text-2xl leading-snug text-success">
                AI Solutions
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const additionalData = {
                  company: e.target.company.value,
                  projectDescription: e.target.projectDescription.value,
                  budget: e.target.budget.value,
                  timeline: e.target.timeline.value,
                };
                handleSubmit("ai", additionalData);
              }}
            >
              {/* Form fields */}
              <FormGroup label="Name">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={FIELD}
                />
              </FormGroup>
              {/* ...other form fields... */}
              <FormGroup label="Email">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={FIELD}
                />
              </FormGroup>
              <FormGroup label="Company/Organization">
                <input type="text" name="company" required className={FIELD} />
              </FormGroup>
              <FormGroup label="Project Description">
                <textarea
                  name="projectDescription"
                  required
                  className={TEXTAREA}
                ></textarea>
              </FormGroup>
              <FormGroup label="Budget Range">
                <select name="budget" required className={FIELD}>
                  <option value="">Select Budget</option>
                  <option value="< $250">Less than $250</option>
                  <option value="$250 - $1,000">$250 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="> $2,500">More than $2,500</option>
                </select>
              </FormGroup>
              <FormGroup label="Timeline Expectations">
                <select name="timeline" required className={FIELD}>
                  <option value="">Select Timeline</option>
                  <option value="< 1 month">Less than 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="> 6 months">More than 6 months</option>
                </select>
              </FormGroup>
              <button type="submit" className={SUBMIT}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>

        {/* Web Dev Form */}
        <div
          className={[
            FORM_WRAPPER,
            activeForm === "web" ? "-translate-x-full p-6.25" : "",
          ].join(" ")}
        >
          <div className={FORM_CONTENT}>
            <div className="mb-5">
              <button
                className={BACK_BUTTON}
                onClick={() => setActiveForm(null)}
              >
                ← Back to Services
              </button>
              <h2 className="mt-2.5 text-2xl leading-snug text-success">
                Web Development
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const additionalData = {
                  projectType: e.target.projectType.value,
                  features: e.target.features.value,
                  budget: e.target.budget.value,
                  timeline: e.target.timeline.value,
                };
                handleSubmit("web", additionalData);
              }}
            >
              {/* Form fields */}
              <FormGroup label="Name">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={FIELD}
                />
              </FormGroup>
              <FormGroup label="Email">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={FIELD}
                />
              </FormGroup>
              <FormGroup label="Project Type">
                <select name="projectType" required className={FIELD}>
                  <option value="">Select Project Type</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Blog">Blog</option>
                  <option value="Corporate">Corporate Website</option>
                  <option value="Other">Other</option>
                </select>
              </FormGroup>
              <FormGroup label="Features Needed">
                <textarea
                  name="features"
                  placeholder="Describe the features you need..."
                  required
                  className={TEXTAREA}
                ></textarea>
              </FormGroup>
              <FormGroup label="Budget Range">
                <select name="budget" required className={FIELD}>
                  <option value="">Select Budget</option>
                  <option value="< $1,000">Less than $1,000</option>
                  <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="> $5,000">More than $5,000</option>
                </select>
              </FormGroup>
              <FormGroup label="Timeline Expectations">
                <select name="timeline" required className={FIELD}>
                  <option value="">Select Timeline</option>
                  <option value="< 2 weeks">Less than 2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="> 2 months">More than 2 months</option>
                </select>
              </FormGroup>
              <button type="submit" className={SUBMIT}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>

        {/* Learning Form */}
        <div
          className={[
            FORM_WRAPPER,
            activeForm === "learning" ? "-translate-x-full p-6.25" : "",
          ].join(" ")}
        >
          <div className={FORM_CONTENT}>
            <div className="mb-5">
              <button
                className={BACK_BUTTON}
                onClick={() => setActiveForm(null)}
              >
                ← Back to Services
              </button>
              <h2 className="mt-2.5 text-2xl leading-snug text-success">
                Online Learning
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const additionalData = {
                  technology: e.target.technology.value,
                  skillLevel: e.target.skillLevel.value,
                  learningGoals: e.target.learningGoals.value,
                  schedule: e.target.schedule.value,
                };
                handleSubmit("learning", additionalData);
              }}
            >
              {/* Form fields */}
              <FormGroup label="Name">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={FIELD}
                />
              </FormGroup>
              <FormGroup label="Email">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={FIELD}
                />
              </FormGroup>
              <FormGroup label="Technology Interested In">
                <select name="technology" required className={FIELD}>
                  <option value="">Select Technology</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Other">Other</option>
                </select>
              </FormGroup>
              <FormGroup label="Current Skill Level">
                <select name="skillLevel" required className={FIELD}>
                  <option value="">Select Skill Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </FormGroup>
              <FormGroup label="Learning Goals">
                <textarea
                  name="learningGoals"
                  placeholder="What do you want to achieve?"
                  required
                  className={TEXTAREA}
                ></textarea>
              </FormGroup>
              <FormGroup label="Preferred Schedule">
                <textarea
                  name="schedule"
                  placeholder="What days/times work best for you?"
                  required
                  className={TEXTAREA}
                ></textarea>
              </FormGroup>
              <button type="submit" className={SUBMIT}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
