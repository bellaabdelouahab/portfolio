import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faTimes,
  faPlus,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as s from "../formStyles";

export default function CarouselForm({
  carouselItems,
  setCarouselItems,
  onItemRemoved,
  setPopupWindow,
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [existingPath, setExistingPath] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(existingPath || null);
  }, [file, existingPath]);

  const validateAndSetFile = (f) => {
    if (!f.type.match("image.*"))
      return setError("Please select an image file");
    if (f.size > 5 * 1024 * 1024)
      return setError("Image must be less than 5MB");
    setFile(f);
    setError("");
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) validateAndSetFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };
  const handleDragLeave = (e) => e.currentTarget.classList.remove("drag-over");
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSetFile(f);
  };

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setExistingPath(null);
    setError("");
    setEditId(null);
  };

  const handleEditClick = (item) => {
    setTitle(item.title);
    setFile(null);
    setExistingPath(item.existingPath || null);
    setEditId(item.id);
    setError("");
  };

  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setCarouselItems(carouselItems.filter((i) => i.id !== item.id));
    onItemRemoved?.(item);
    if (editId === item.id) resetForm();
  };

  const handleSave = () => {
    if (!title.trim())
      return setError("Please enter a title for the carousel image");
    if (!file && !existingPath) return setError("Please select an image");

    if (editId) {
      setCarouselItems(
        carouselItems.map((item) =>
          item.id === editId
            ? {
                ...item,
                title: title.trim(),
                file: file || null,
                existingPath: file ? item.existingPath : existingPath,
              }
            : item,
        ),
      );
    } else {
      setCarouselItems([
        ...carouselItems,
        {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
          title: title.trim(),
          file,
          existingPath: null,
        },
      ]);
    }
    resetForm();
  };

  return (
    <div className={s.popupOverlay}>
      <div className={`${s.popupPanel} w-full max-w-200`}>
        <button
          type="button"
          className={s.popupClose}
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className={s.popupTitle}>
          {editId ? "Edit Carousel Image" : "Add Carousel Image"}
        </h2>

        <div className={s.bodySplit}>
          <div className={s.bodyFormCol}>
            <div className={s.fieldGroup}>
              <label className={s.fieldLabel} htmlFor="carouselTitle">
                Image Title
              </label>
              <input
                type="text"
                id="carouselTitle"
                className={s.control}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for this image"
              />
            </div>

            <div className={s.fieldGroup}>
              <label className={s.fieldLabel}>Image Upload</label>
              {/* `drag-over` is added and removed by the drag handlers above via
                  classList, so it is matched here as an arbitrary variant rather
                  than lifted into React state — the handlers keep working
                  untouched. */}
              <div
                className={[
                  "relative flex min-h-40 w-full items-center justify-center rounded-md border-2 border-dashed border-line",
                  "bg-page transition-colors duration-200 ease-standard",
                  "[&.drag-over]:border-success [&.drag-over]:bg-success/10",
                  preview ? "min-h-70 border-solid border-success/60 p-2.5" : "",
                ].join(" ")}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Covers the whole drop area so the plain click-to-browse path
                    works without a separate overlay handler. */}
                <input
                  type="file"
                  className="absolute inset-0 z-1 cursor-pointer opacity-0"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  id="carouselImage"
                />
                {preview ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="block h-auto max-h-65 w-full rounded-md bg-page object-contain"
                    />
                    {/* z-2 so it sits above the full-bleed file input */}
                    <button
                      type="button"
                      className="absolute top-2.5 right-2.5 z-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-danger text-white transition-transform duration-200 ease-standard hover:scale-110"
                      onClick={() => {
                        setFile(null);
                        setExistingPath(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-3xl text-ink-muted"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <p className="leading-relaxed font-medium text-ink">
                        Drag &amp; drop image here
                      </p>
                      <span className="text-xs leading-relaxed text-ink-muted">
                        or
                      </span>
                      <label
                        htmlFor="carouselImage"
                        className={`relative z-2 ${s.pickerChip}`}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Browse files
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {editId && !file && existingPath && (
                <div className={s.helperRow}>
                  <FontAwesomeIcon icon={faInfoCircle} className={s.helperIcon} />
                  <span>
                    Showing existing image — pick a new file above to replace it
                  </span>
                </div>
              )}
              <div className={s.helperRow}>
                <FontAwesomeIcon icon={faInfoCircle} className={s.helperIcon} />
                <span>
                  Recommended: JPG, PNG or WebP • Max 5MB • 16:9 aspect ratio
                </span>
              </div>
            </div>

            {error && <div className={s.formError}>{error}</div>}

            <div className={s.formActions}>
              {editId && (
                <button
                  type="button"
                  className={s.btnGhost}
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
              <button type="button" className={s.btnPrimary} onClick={handleSave}>
                {editId ? "Update Image" : "Add to Carousel"}
              </button>
            </div>
          </div>

          <div className={s.bodyListCol}>
            <div className={s.listHeading}>Added ({carouselItems.length})</div>
            {carouselItems.length === 0 && (
              <div className={s.listEmpty}>No images yet</div>
            )}
            {carouselItems.map((item) => (
              <CarouselListItem
                key={item.id}
                item={item}
                active={editId === item.id}
                onClick={() => handleEditClick(item)}
                onDelete={(e) => handleDeleteClick(e, item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselListItem({ item, active, onClick, onDelete }) {
  const [thumbUrl, setThumbUrl] = useState(item.existingPath || null);

  useEffect(() => {
    if (item.file) {
      const url = URL.createObjectURL(item.file);
      setThumbUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setThumbUrl(item.existingPath || null);
  }, [item]);

  return (
    <div
      className={[s.listItem, active ? s.listItemActive : s.listItemIdle].join(
        " ",
      )}
      onClick={onClick}
    >
      {thumbUrl && (
        <img src={thumbUrl} alt={item.title} className={s.listThumb} />
      )}
      <div className={s.listItemInfo}>
        <div className={s.listItemTitle}>{item.title}</div>
        {item.file && <div className={s.listItemMeta}>New / changed</div>}
      </div>
      <button type="button" className={s.listItemDelete} onClick={onDelete}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
}
