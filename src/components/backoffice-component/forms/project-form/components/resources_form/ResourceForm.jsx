import { useState } from "react";
import "./ResourceForm.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

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
    <div className="popup-container">
      <div className="resource-form popup">
        <button 
          type="button" 
          className="close-button" 
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2 className="form-title">
          <FontAwesomeIcon icon={faBook} className="title-icon" />
          Add Resource
        </h2>
        
        <div className="resource-types">
          <label>Resource Type:</label>
          <div className="resource-type-buttons">
            {resourceTypes.map((resource, index) => (
              <button 
                key={index} 
                type="button" 
                className="resource-type-btn"
                onClick={() => setTitle(resource.prefix)}
              >
                {resource.type}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="resourceTitle">Resource Title</label>
          <input
            type="text"
            id="resourceTitle"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'Clean Code by Robert Martin', 'React Documentation'"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="resourceDescription">Description</label>
          <textarea
            id="resourceDescription"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how this resource was helpful for your project"
            rows={4}
          />
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
            <FontAwesomeIcon icon={faPlus} /> Add Resource
          </button>
        </div>
      </div>
    </div>
  );
}
