import { useRef, useState, useEffect } from "react";
import "./form-components.css";

/* ---------- Text / Date / etc input ---------- */
// Static top label per screenshot (not floating) — recommended once a form
// has more than ~4 fields, since users can scan labels before focusing in.
const InputComponent = ({
  type = "text",
  name,
  className = "form__input",
  placeholder = "",
  required = true,
  value,
  onChange,
  defaultValue,
  label,
  hint,
  error,
}) => (
  <div className="input-flow">
    <label className="form__label" htmlFor={name}>
      {label}
      {required && <span className="form__required">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      className={`${className} ${error ? "form__input--error" : ""}`}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      aria-invalid={!!error}
      aria-describedby={error || hint ? `${name}-msg` : undefined}
    />
    {(error || hint) && (
      <span id={`${name}-msg`} className={error ? "form__error" : "form__hint"}>
        {error || hint}
      </span>
    )}
  </div>
);

/* ---------- Textarea (missing from the original set, needed for Description) ---------- */
const TextareaComponent = ({
  name,
  placeholder = "",
  required = true,
  value,
  defaultValue,
  onChange,
  label,
  hint,
  error,
  rows = 4,
}) => (
  <div className="input-flow input-flow--textarea">
    <label className="form__label" htmlFor={name}>
      {label}
      {required && <span className="form__required">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      className={`form__input ${error ? "form__input--error" : ""}`}
      placeholder={placeholder}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      rows={rows}
      aria-invalid={!!error}
    />
    {(error || hint) && (
      <span className={error ? "form__error" : "form__hint"}>
        {error || hint}
      </span>
    )}
  </div>
);

/* ---------- File input with drag & drop ---------- */
// Native <input type="file"> stays in the DOM (visually hidden, not display:none)
// so it's still keyboard- and screen-reader-reachable — drag-and-drop is a bonus,
// not the only way in.
const FileInputComponent = ({
  name,
  className = "form__input",
  label = "Upload cover image",
  hint = "PNG or JPG, 16:9 aspect ratio recommended",
  accept = "image/png,image/jpeg",
  required = true,
  value, // optional: File | null, controlled by parent
  onChange, // optional: (File | null) => void
  existingImageUrl, // optional: URL of the current/existing image, for Preview + diffing
}) => {
  const [dragging, setDragging] = useState(false);
  const [internalFile, setInternalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const inputRef = useRef(null);

  const isControlled = value !== undefined;
  const file = isControlled ? value : internalFile;

  const setFile = (f) => {
    if (!isControlled) setInternalFile(f);
    onChange?.(f || null);
  };

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const displayPreview = previewUrl || existingImageUrl;

  return (
    <div className="input-flow">
      <label className="form__label" htmlFor={name}>
        {label}
        {required && <span className="form__required">*</span>}
      </label>
      <div
        className={`file-drop ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          required={required && !file && !existingImageUrl}
          onChange={(e) => setFile(e.target.files?.[0])}
          className="file-drop__native"
        />
        <div className="file-drop__icon">⬆</div>
        <div className="file-drop__text">
          <strong>{file ? file.name : label}</strong>
          {!file && <span>{hint}</span>}
          {file && (
            <span className="file-drop__changed-badge">
              ✓ New file selected — will replace current on save
            </span>
          )}
        </div>

        {displayPreview && (
          <button
            type="button"
            className="file-drop__preview-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowLightbox(true);
            }}
          >
            Preview
          </button>
        )}

        {file && (
          <button
            type="button"
            className="file-drop__clear"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove file"
          >
            ✕
          </button>
        )}
      </div>

      {showLightbox && displayPreview && (
        <div
          className="lightbox-overlay"
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={displayPreview}
            alt="Preview"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setShowLightbox(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Toggle switch (binary choice — clearer state change than a checkbox) ---------- */
const ToggleComponent = ({ name, label, description, checked, onChange }) => (
  <label className="toggle-row" htmlFor={name}>
    <div className="toggle-row__text">
      <span className="toggle-row__label">{label}</span>
      {description && <span className="toggle-row__desc">{description}</span>}
    </div>
    <span className="toggle-switch">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="toggle-switch__track" />
    </span>
  </label>
);

/* ---------- Project data list (added items: code samples, resources, etc.) ---------- */
/* ---------- Project data list (Cards UI) ---------- */
const ProjectDataComponent = ({
  items,
  setItems,
  title,
  description,
  icon,
  setPopupWindow,
  formComponent,
}) => {
  const handleItemClose = (e, index) => {
    e.stopPropagation(); // Prevents opening the modal when deleting
    const next = [...items];
    next.splice(index, 1);
    setItems(next);
  };

  const hasItems = items && items.length > 0;

  return (
    <div className="input-flow" style={{ marginBottom: 0 }}>
      <div
        className={`content-card ${hasItems ? "has-items" : ""}`}
        onClick={() => setPopupWindow(formComponent)}
      >
        <div className="content-card__icon-wrap">{icon}</div>
        <div className="content-card__text">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="content-card__checkbox">
          {hasItems ? (
            <span
              style={{ fontSize: "0.4375rem", color: "#fff", fontWeight: 600 }}
            >
              {items.length}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export {
  InputComponent,
  TextareaComponent,
  FileInputComponent,
  ToggleComponent,
  ProjectDataComponent,
};
