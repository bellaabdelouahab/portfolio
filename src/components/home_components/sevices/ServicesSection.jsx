import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "./ServicesSection.module.scss";

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
    <div className={styles.servicesSection}>
      <div className="home-sections-title">
        <span>07. </span>
        Services
      </div>

      <div className={styles.servicesContainer}>
        {/* Original Cards Display */}
        <div
          className={`${styles.cardsWrapper} ${
            activeForm ? styles.slideOut : ""
          }`}
        >
          <div className={styles.cards}>
            <div className={styles.card}>
              <img src="icons/AI.png" alt="" width={75} />
              <h3 className={styles.cardTitle}>AI solutions</h3>
              <p className={styles.cardText}>
                Leverage my cutting-edge AI solutions to transform your business
                operations and gain valuable insights. With my expertise
                spanning chatbots, predictive analytics, and automation, I
                empower you to stay ahead in today's data-centric environment.
                Harness the power of AI with me to unlock new opportunities and
                drive innovation in your organization.
              </p>
              <button
                className={styles.cardButton}
                onClick={() => setActiveForm("ai")}
              >
                Learn More
              </button>
            </div>
            <div className={styles.card}>
              <img src="icons/web-dev.png" alt="" width={75} />
              <h3 className={styles.cardTitle}>Web Development</h3>
              <p className={styles.cardText}>
                Embark on your online journey with me. My website development
                services blend creativity and functionality to deliver visually
                stunning websites. I have worked on more than 100+ websites
                Specializing in both front-end and back-end development,I
                guarantee seamless performance and an intuitive user interface.
                Let us lay the groundwork for your digital success.
              </p>
              <button
                className={styles.cardButton}
                onClick={() => setActiveForm("web")}
              >
                Hire Me
              </button>
            </div>
            <div className={styles.card}>
              <img src="icons/online-learning.png" alt="" width={75} />
              <h3 className={styles.cardTitle}>Online Learning</h3>
              <p className={styles.cardText}>
                I offer personalized online tutoring services to help you master
                programming languages and frameworks. Whether you're a beginner
                or an experienced coder, I provide tailored lessons to suit your
                learning style. With my guidance, you can enhance your skills
                and achieve your learning goals. Let's embark on a learning
                journey together.
              </p>
              <button
                className={styles.cardButton}
                onClick={() => setActiveForm("learning")}
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>

        {/* AI Form */}
        <div
          className={`${styles.formWrapper} ${
            activeForm === "ai" ? styles.slideIn : ""
          }`}
        >
          <div className={styles.formContent}>
            <div className={styles.formHeader}>
              <button
                className={styles.backButton}
                onClick={() => setActiveForm(null)}
              >
                ← Back to Services
              </button>
              <h2>AI Solutions</h2>
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
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* ...other form fields... */}
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Company/Organization</label>
                <input type="text" name="company" required />
              </div>
              <div className={styles.formGroup}>
                <label>Project Description</label>
                <textarea name="projectDescription" required></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Budget Range</label>
                <select name="budget" required>
                  <option value="">Select Budget</option>
                  <option value="< $250">Less than $250</option>
                  <option value="$250 - $1,000">$250 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="> $2,500">More than $2,500</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Timeline Expectations</label>
                <select name="timeline" required>
                  <option value="">Select Timeline</option>
                  <option value="< 1 month">Less than 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="> 6 months">More than 6 months</option>
                </select>
              </div>
              <button type="submit" className={styles.submitButton}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>

        {/* Web Dev Form */}
        <div
          className={`${styles.formWrapper} ${
            activeForm === "web" ? styles.slideIn : ""
          }`}
        >
          <div className={styles.formContent}>
            <div className={styles.formHeader}>
              <button
                className={styles.backButton}
                onClick={() => setActiveForm(null)}
              >
                ← Back to Services
              </button>
              <h2>Web Development</h2>
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
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Project Type</label>
                <select name="projectType" required>
                  <option value="">Select Project Type</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Blog">Blog</option>
                  <option value="Corporate">Corporate Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Features Needed</label>
                <textarea
                  name="features"
                  placeholder="Describe the features you need..."
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Budget Range</label>
                <select name="budget" required>
                  <option value="">Select Budget</option>
                  <option value="< $1,000">Less than $1,000</option>
                  <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="> $5,000">More than $5,000</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Timeline Expectations</label>
                <select name="timeline" required>
                  <option value="">Select Timeline</option>
                  <option value="< 2 weeks">Less than 2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="> 2 months">More than 2 months</option>
                </select>
              </div>
              <button type="submit" className={styles.submitButton}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>

        {/* Learning Form */}
        <div
          className={`${styles.formWrapper} ${
            activeForm === "learning" ? styles.slideIn : ""
          }`}
        >
          <div className={styles.formContent}>
            <div className={styles.formHeader}>
              <button
                className={styles.backButton}
                onClick={() => setActiveForm(null)}
              >
                ← Back to Services
              </button>
              <h2>Online Learning</h2>
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
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Technology Interested In</label>
                <select name="technology" required>
                  <option value="">Select Technology</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Current Skill Level</label>
                <select name="skillLevel" required>
                  <option value="">Select Skill Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Learning Goals</label>
                <textarea
                  name="learningGoals"
                  placeholder="What do you want to achieve?"
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Preferred Schedule</label>
                <textarea
                  name="schedule"
                  placeholder="What days/times work best for you?"
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
