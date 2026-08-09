import { useState, useEffect } from "react";
import "./CarouselForm.css";
import "../PopupShared.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faTimes,
  faPlus,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="popup-container">
      <div className="carousel-form popup">
        <button
          type="button"
          className="close-button"
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="form-title">
          {editId ? "Edit Carousel Image" : "Add Carousel Image"}
        </h2>

        <div className="popup-body-split">
          <div className="popup-form-col">
            <div className="form-group">
              <label htmlFor="carouselTitle">Image Title</label>
              <input
                type="text"
                id="carouselTitle"
                className="carousel-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for this image"
              />
            </div>

            <div className="form-group">
              <label>Image Upload</label>
              <div
                className={`carousel-upload-area ${preview ? "has-preview" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="file-input"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  id="carouselImage"
                />
                {preview ? (
                  <div className="carousel-preview">
                    <img
                      src={preview}
                      alt="Preview"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        setFile(null);
                        setExistingPath(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FontAwesomeIcon icon={faImage} className="upload-icon" />
                    <div className="upload-text">
                      <p>Drag & drop image here</p>
                      <span>or</span>
                      <label htmlFor="carouselImage" className="browse-btn">
                        <FontAwesomeIcon icon={faPlus} /> Browse files
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {editId && !file && existingPath && (
                <div className="image-requirements">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  <span>
                    Showing existing image — pick a new file above to replace it
                  </span>
                </div>
              )}
              <div className="image-requirements">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                <span>
                  Recommended: JPG, PNG or WebP • Max 5MB • 16:9 aspect ratio
                </span>
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-actions">
              {editId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
              <button type="button" className="submit-btn" onClick={handleSave}>
                {editId ? "Update Image" : "Add to Carousel"}
              </button>
            </div>
          </div>

          <div className="popup-list-col">
            <div className="popup-list-heading">
              Added ({carouselItems.length})
            </div>
            {carouselItems.length === 0 && (
              <div className="popup-list-empty">No images yet</div>
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
      className={`popup-list-item ${active ? "popup-list-item--active" : ""}`}
      onClick={onClick}
    >
      {thumbUrl && (
        <img
          src={thumbUrl}
          alt={item.title}
          className="popup-list-item__thumb"
        />
      )}
      <div className="popup-list-item__info">
        <div className="popup-list-item__title">{item.title}</div>
        {item.file && (
          <div className="popup-list-item__meta">New / changed</div>
        )}
      </div>
      <button
        type="button"
        className="popup-list-item__delete"
        onClick={onDelete}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
}
