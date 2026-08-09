import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as s from "../formStyles";

export default function TechsForm({ techs, setTechs, setPopupWindow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      setError("Please enter a technology name");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a technology description");
      return;
    }

    // Add technology
    const newTechs = [...techs];
    newTechs.push({
      title: title.trim(),
      description: description.trim()
    });

    setTechs(newTechs);
    setPopupWindow(null);
  };

  // List of common technologies for quick selection
  const commonTechs = [
    { name: "React", desc: "A JavaScript library for building user interfaces" },
    { name: "Node.js", desc: "JavaScript runtime built on Chrome's V8 JavaScript engine" },
    { name: "Python", desc: "Interpreted high-level general-purpose programming language" },
    { name: "Docker", desc: "Platform for developing, shipping, and running applications in containers" },
    { name: "MongoDB", desc: "NoSQL document database with scalability and flexibility" },
    { name: "Firebase", desc: "Google's platform for app development, hosting and more" }
  ];

  const quickSelectTech = (tech) => {
    setTitle(tech.name);
    setDescription(tech.desc);
  };

  return (
    <div className={s.popupOverlay}>
      <div className={`${s.popupPanel} w-full max-w-150`}>
        <button
          type="button"
          className={s.popupClose}
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className={s.popupTitle}>
          <FontAwesomeIcon icon={faMicrochip} className={s.popupTitleIcon} />
          Add Technology
        </h2>

        <div className={s.pickerPanel}>
          <label className={s.pickerLabel}>Quick Select:</label>
          <div className={s.pickerRow}>
            {commonTechs.map((tech, index) => (
              <button
                key={index}
                type="button"
                onClick={() => quickSelectTech(tech)}
                className={s.pickerChip}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="techTitle">Technology Name</label>
          <input
            type="text"
            id="techTitle"
            className={s.control}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'React', 'TensorFlow', 'AWS'"
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="techDescription">Description</label>
          <textarea
            id="techDescription"
            className={`${s.control} resize-y leading-relaxed`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how this technology was used in your project"
            rows={4}
          />
        </div>

        {error && <div className={s.formError}>{error}</div>}

        <div className={s.formActions}>
          <button
            type="button"
            className={s.btnGhost}
            onClick={() => setPopupWindow(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={s.btnPrimary}
            onClick={handleSubmit}
          >
            Add Technology
          </button>
        </div>
      </div>
    </div>
  );
}
