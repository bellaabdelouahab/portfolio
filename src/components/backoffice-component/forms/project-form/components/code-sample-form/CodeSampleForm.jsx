import { useState, useEffect } from "react";
import "./CodeSampleForm.css";
import { createStarryNight, common } from "@wooorm/starry-night";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function CodeSampleForm({ codeSamples, setCodeSamples, setPopupWindow }) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [scopes, setScopes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fillScopes = async () => {
      try {
        setLoading(true);
        const starryNight = await createStarryNight(common);
        const availableScopes = starryNight.scopes();
        setScopes(availableScopes);
        
        // Set a default language
        if (availableScopes.length > 0) {
          setLanguage(availableScopes.find(scope => scope.includes('javascript')) || availableScopes[0]);
        }
      } catch (error) {
        console.error("Error loading syntax highlighting:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fillScopes();
  }, []);

  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      setError("Please enter a title for the code sample");
      return;
    }
    
    if (!code.trim()) {
      setError("Please enter some code");
      return;
    }
    
    if (!language) {
      setError("Please select a language");
      return;
    }
    
    // Add code sample
    const newCodeSamples = [...codeSamples];
    newCodeSamples.push({
      title: title.trim(),
      code: code.trim(),
      language: language
    });
    
    setCodeSamples(newCodeSamples);
    setPopupWindow(null);
  };

  return (
    <div className="popup-container">
      <div className="code-sample-form popup">
        <button 
          type="button" 
          className="close-button" 
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2 className="form-title">
          <FontAwesomeIcon icon={faCode} className="title-icon" />
          Add Code Sample
        </h2>
        
        <div className="form-group">
          <label htmlFor="codeSampleTitle">Sample Title</label>
          <input
            type="text"
            id="codeSampleTitle"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'Authentication Function', 'API Request Handler'"
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
                    <option key={index} value={scope}>{scope.replace(/^source\./, '').replace(/\b\w/g, l => l.toUpperCase())}</option>
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
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => setPopupWindow(null)}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="submit-btn" 
            onClick={handleSubmit}
          >
            Add Code Sample
          </button>
        </div>
      </div>
    </div>
  );
}
