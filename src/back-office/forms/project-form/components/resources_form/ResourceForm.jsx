import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as s from "../formStyles";

export default function ResourcesForm({ resources, setResources, setPopupWindow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      setError("Please enter a resource title");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a resource description");
      return;
    }

    // Add resource
    const newResources = [...resources];
    newResources.push({
      title: title.trim(),
      description: description.trim()
    });

    setResources(newResources);
    setPopupWindow(null);
  };

  // Resource type templates for quick selection
  const resourceTypes = [
    { type: "Book", prefix: "Book: " },
    { type: "Article", prefix: "Article: " },
    { type: "Video", prefix: "Video Tutorial: " },
    { type: "Documentation", prefix: "Documentation: " },
    { type: "Framework", prefix: "Framework: " },
    { type: "Library", prefix: "Library: " }
  ];

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
          <FontAwesomeIcon icon={faBook} className={s.popupTitleIcon} />
          Add Resource
        </h2>

        <div className={s.pickerPanel}>
          <label className={s.pickerLabel}>Resource Type:</label>
          <div className={s.pickerRow}>
            {resourceTypes.map((resource, index) => (
              <button
                key={index}
                type="button"
                className={s.pickerChip}
                onClick={() => setTitle(resource.prefix)}
              >
                {resource.type}
              </button>
            ))}
          </div>
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="resourceTitle">Resource Title</label>
          <input
            type="text"
            id="resourceTitle"
            className={s.control}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'Clean Code by Robert Martin', 'React Documentation'"
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="resourceDescription">Description</label>
          <textarea
            id="resourceDescription"
            className={`${s.control} resize-y leading-relaxed`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how this resource was helpful for your project"
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
            <FontAwesomeIcon icon={faPlus} /> Add Resource
          </button>
        </div>
      </div>
    </div>
  );
}
