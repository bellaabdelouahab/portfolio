import { useState, useEffect } from "react";
import { createStarryNight, common } from "@wooorm/starry-night";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faTimes,
  faInfoCircle,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import * as s from "../formStyles";

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
    <div className={s.popupOverlay}>
      <div className={`${s.popupPanel} w-full max-w-240`}>
        <button
          type="button"
          className={s.popupClose}
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className={s.popupTitle}>
          <FontAwesomeIcon icon={faCode} className={s.popupTitleIcon} />
          {editIndex !== null ? "Edit Code Sample" : "Add Code Sample"}
        </h2>

        <div className={s.bodySplit}>
          <div className={s.bodyFormCol}>
            <div className={s.fieldGroup}>
              <label className={s.fieldLabel} htmlFor="codeSampleTitle">
                Sample Title
              </label>
              <input
                type="text"
                id="codeSampleTitle"
                className={s.control}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Authentication Function'"
              />
            </div>

            <div className={s.fieldGroup}>
              <label className={s.fieldLabel} htmlFor="language">
                Programming Language
              </label>
              {/* The caret is a pseudo-element on the wrapper rather than a
                  background-image on the select, so it inherits the text
                  colour and never fights the native control's own painting. */}
              <div className="relative after:pointer-events-none after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:text-xs after:text-ink-muted after:content-['▼']">
                <select
                  id="language"
                  className={`${s.control} appearance-none pr-8`}
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

            <div className={s.fieldGroup}>
              <label className={s.fieldLabel} htmlFor="code">
                Code
              </label>
              <textarea
                id="code"
                className="min-h-50 w-full resize-y rounded-sm border border-line bg-page p-4 font-mono text-sm leading-relaxed text-ink-strong tab-2 outline-none transition-colors duration-200 ease-standard focus:border-success focus:ring-2 focus:ring-success/25"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code snippet here..."
                rows={10}
                spellCheck="false"
              />
              <div className={s.helperRow}>
                <FontAwesomeIcon icon={faInfoCircle} className={s.helperIcon} />
                <span>Use proper indentation for better readability</span>
              </div>
            </div>

            {error && <div className={s.formError}>{error}</div>}

            <div className={s.formActions}>
              {editIndex !== null && (
                <button
                  type="button"
                  className={s.btnGhost}
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
              <button type="button" className={s.btnPrimary} onClick={handleSave}>
                {editIndex !== null ? "Update Code Sample" : "Add Code Sample"}
              </button>
            </div>
          </div>

          <div className={s.bodyListCol}>
            <div className={s.listHeading}>Added ({codeSamples.length})</div>
            {codeSamples.length === 0 && (
              <div className={s.listEmpty}>No code samples yet</div>
            )}
            {codeSamples.map((item, index) => (
              <div
                key={index}
                className={[
                  s.listItem,
                  editIndex === index ? s.listItemActive : s.listItemIdle,
                ].join(" ")}
                onClick={() => handleEditClick(index)}
              >
                <div className={`${s.listThumb} ${s.listThumbPlaceholder}`}>
                  <FontAwesomeIcon icon={faPen} />
                </div>
                <div className={s.listItemInfo}>
                  <div className={s.listItemTitle}>{item.title}</div>
                  <div className={s.listItemMeta}>
                    {item.language.replace(/^source\./, "")}
                  </div>
                </div>
                <button
                  type="button"
                  className={s.listItemDelete}
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
