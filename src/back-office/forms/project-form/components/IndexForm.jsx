import { useRef, useState, useEffect } from "react";
import * as s from "./formStyles";

/* ---------- Text / Date / etc input ---------- */
// Static top label per screenshot (not floating) — recommended once a form
// has more than ~4 fields, since users can scan labels before focusing in.
const InputComponent = ({
  type = "text",
  name,
  className = s.fieldInput,
  placeholder = "",
  required = true,
  value,
  onChange,
  defaultValue,
  label,
  hint,
  error,
}) => (
  <div className={s.fieldFlow}>
    <label className={s.fieldSmallLabel} htmlFor={name}>
      {label}
      {required && <span className={s.requiredMark}>*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      className={`${className} ${error ? "border-danger" : ""}`}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      aria-invalid={!!error}
      aria-describedby={error || hint ? `${name}-msg` : undefined}
    />
    {(error || hint) && (
      <span
        id={`${name}-msg`}
        className={error ? s.fieldErrorText : s.fieldHint}
      >
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
  <div className={s.fieldFlow}>
    <label className={s.fieldSmallLabel} htmlFor={name}>
      {label}
      {required && <span className={s.requiredMark}>*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      className={`${s.fieldInput} ${s.fieldTextarea} ${error ? "border-danger" : ""}`}
      placeholder={placeholder}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      rows={rows}
      aria-invalid={!!error}
    />
    {(error || hint) && (
      <span className={error ? s.fieldErrorText : s.fieldHint}>
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
  className = s.fieldInput,
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
    <div className={s.fieldFlow}>
      <label className={s.fieldSmallLabel} htmlFor={name}>
        {label}
        {required && <span className={s.requiredMark}>*</span>}
      </label>
      <div
        className={[
          "flex w-full cursor-pointer items-center gap-3 rounded-md border-[1.5px] border-dashed p-3",
          "transition-colors duration-200 ease-standard",
          dragging || file
            ? "border-success bg-surface"
            : "border-line bg-page hover:border-success hover:bg-surface",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* sr-only, not hidden: this input carries `required`, and Chrome
            refuses to submit a form containing a display:none required control
            ("not focusable"). It also matches the note above — drag-and-drop is
            a bonus, the native control stays keyboard-reachable. */}
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          required={required && !file && !existingImageUrl}
          onChange={(e) => setFile(e.target.files?.[0])}
          className="sr-only"
        />
        {/* Was a violet tile — the third competing accent on this screen. */}
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
          ⬆
        </div>
        <div>
          <strong className="mb-0.5 block text-xs leading-snug text-ink-strong">
            {file ? file.name : label}
          </strong>
          {!file && (
            <span className="text-xs leading-relaxed text-ink-muted">
              {hint}
            </span>
          )}
          {file && (
            <span className="mt-1 block text-xs leading-relaxed text-success">
              ✓ New file selected — will replace current on save
            </span>
          )}
        </div>

        {displayPreview && (
          <button
            type="button"
            className="ml-auto shrink-0 cursor-pointer rounded-sm border border-success/60 bg-success/15 px-12 py-3 text-xs text-success transition-colors duration-200 ease-standard hover:bg-success hover:text-page"
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
            className="shrink-0 cursor-pointer rounded-sm border border-line bg-surface-raised px-4 py-3 text-xs text-danger transition-colors duration-200 ease-standard hover:bg-danger hover:text-ink-strong"
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
          className="fixed inset-0 z-2000 flex items-center justify-center bg-black/85 p-5"
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={displayPreview}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-md object-contain shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="fixed top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-ink-strong"
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
  <label className={s.toggleRow} htmlFor={name}>
    <div>
      <span className={s.toggleLabel}>{label}</span>
      {description && <span className={s.toggleDesc}>{description}</span>}
    </div>
    <span className="relative h-6 w-11 shrink-0">
      {/* `peer` + `sr-only` rather than display:none, so the track and knob are
          driven by peer-checked:* instead of a sibling combinator in CSS. The
          input still submits — ProjectForm reads it via FormData. */}
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="absolute inset-0 rounded-full border border-line bg-surface-raised transition-colors duration-200 ease-standard before:absolute before:top-0.5 before:left-0.5 before:size-4.5 before:rounded-full before:bg-ink-muted before:transition-transform before:duration-200 before:ease-standard before:content-[''] peer-checked:border-success peer-checked:bg-success peer-checked:before:translate-x-5 peer-checked:before:bg-page" />
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
    <div className={s.fieldFlow}>
      <div
        className={[
          "flex w-full cursor-pointer items-center gap-2.5 rounded-md border p-2.5",
          "transition-colors duration-200 ease-standard",
          hasItems
            ? "border-success bg-success/10"
            : "border-line bg-page hover:border-success/40 hover:bg-surface",
        ].join(" ")}
        onClick={() => setPopupWindow(formComponent)}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/5 text-ink">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="mb-0.5 text-xs leading-snug font-medium text-ink-strong">
            {title}
          </h4>
          {/* These were 7.5px on #64748b — the descriptions the user called out
              as unreadable. text-xs is the floor for body copy here. */}
          <p className="text-xs leading-snug text-ink-muted">{description}</p>
        </div>
        {/* 20px rather than 18px so a two-digit count still fits at text-xs. */}
        <div
          className={[
            "flex size-5 items-center justify-center rounded-sm border",
            "transition-colors duration-200 ease-standard",
            hasItems ? "border-success bg-success" : "border-line",
          ].join(" ")}
        >
          {hasItems ? (
            <span className="text-xs font-semibold text-page">
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
