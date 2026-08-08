import { useState, useEffect } from "react";
import "./CodeSampleForm.css";
import "../PopupShared.css"; // adjust path to wherever you place it
import { createStarryNight, common } from "@wooorm/starry-night";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faTimes,
  faInfoCircle,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

export default function CodeSampleForm({
  codeSamples,
  setCodeSamples,
  setPopupWindow,
}) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [scopes, setScopes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fillScopes = async () => {
      try {
        setLoading(true);
        const starryNight = await createStarryNight(common);
        const availableScopes = starryNight.scopes();
        setScopes(availableScopes);
        if (availableScopes.length > 0) {
          setLanguage(
            availableScopes.find((scope) => scope.includes("javascript")) ||
              availableScopes[0],
          );
        }
      } catch (error) {
        console.error("Error loading syntax highlighting:", error);
      } finally {
        setLoading(false);
      }
    };
    fillScopes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCode("");
    setError("");
    setEditIndex(null);
  };

  const handleEditClick = (index) => {
    const item = codeSamples[index];
    setTitle(item.title);
    setCode(item.code);
    setLanguage(item.language);
    setEditIndex(index);
    setError("");
  };

  const handleDeleteClick = (e, index) => {
    e.stopPropagation();
    const next = [...codeSamples];
    next.splice(index, 1);
    setCodeSamples(next);
    if (editIndex === index) resetForm();
    else if (editIndex !== null && index < editIndex)
      setEditIndex(editIndex - 1);
  };

  const handleSave = () => {
    if (!title.trim())
      return setError("Please enter a title for the code sample");
    if (!code.trim()) return setError("Please enter some code");
    if (!language) return setError("Please select a language");

    const entry = { title: title.trim(), code: code.trim(), language };

    if (editIndex !== null) {
      const next = [...codeSamples];
      next[editIndex] = entry;
      setCodeSamples(next);
    } else {
      setCodeSamples([...codeSamples, entry]);
    }
    resetForm();
  };

  return (
    <div className="popup-container">
      <div className="code-sample-form popup" style={{ maxWidth: "960px" }}>
        <button
          type="button"
          className="close-button"
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="form-title">
          <FontAwesomeIcon icon={faCode} className="title-icon" />
          {editIndex !== null ? "Edit Code Sample" : "Add Code Sample"}
        </h2>

        <div className="popup-body-split">
          <div className="popup-form-col">
            <div className="form-group">
              <label htmlFor="codeSampleTitle">Sample Title</label>
              <input
                type="text"
                id="codeSampleTitle"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Authentication Function'"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Programming Language</label>
              <div className="select-wrapper">
                <select
                  id="language"
                  className="form-control"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={loading}
                >
                  {loading ? (
                    <option value="">Loading languages...</option>
                  ) : (
                    <>
                      <option value="">Select a language</option>
                      {scopes.map((scope, index) => (
                        <option key={index} value={scope}>
                          {scope
                            .replace(/^source\./, "")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="code">Code</label>
              <textarea
                id="code"
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code snippet here..."
                rows={10}
                spellCheck="false"
              />
              <div className="code-helper">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                <span>Use proper indentation for better readability</span>
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-actions">
              {editIndex !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
              <button type="button" className="submit-btn" onClick={handleSave}>
                {editIndex !== null ? "Update Code Sample" : "Add Code Sample"}
              </button>
            </div>
          </div>

          <div className="popup-list-col">
            <div className="popup-list-heading">
              Added ({codeSamples.length})
            </div>
            {codeSamples.length === 0 && (
              <div className="popup-list-empty">No code samples yet</div>
            )}
            {codeSamples.map((item, index) => (
              <div
                key={index}
                className={`popup-list-item ${editIndex === index ? "popup-list-item--active" : ""}`}
                onClick={() => handleEditClick(index)}
              >
                <div className="popup-list-item__thumb popup-list-item__thumb--placeholder">
                  <FontAwesomeIcon icon={faPen} />
                </div>
                <div className="popup-list-item__info">
                  <div className="popup-list-item__title">{item.title}</div>
                  <div className="popup-list-item__meta">
                    {item.language.replace(/^source\./, "")}
                  </div>
                </div>
                <button
                  type="button"
                  className="popup-list-item__delete"
                  onClick={(e) => handleDeleteClick(e, index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
